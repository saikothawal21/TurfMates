const Queue = require('../models/Queue');
const Player = require('../models/Player');
const TeamSession = require('../models/TeamSession');

class QueueService {
  constructor() {
    this.matchInterval = 15000; // Check for matches every 15 seconds
    this.teamSize = 2; // Players per team
    this.playersPerMatch = 4; // Total players needed (2 teams of 2)
  }

  async startMatchingEngine() {
    setInterval(async () => {
      try {
        await this.checkForMatches();
      } catch (err) {
        console.error('Matching error:', err);
      }
    }, this.matchInterval);
  }

  async joinQueue(playerId, gameName, skillLevel) {
    // Remove if already in queue
    await this.leaveQueue(playerId);

    const queueEntry = new Queue({
      player: playerId,
      gameName,
      skillLevel
    });

    await queueEntry.save();
    await Player.findByIdAndUpdate(playerId, { 
      inQueue: true,
      lastActive: new Date() 
    });

    return queueEntry;
  }

  async leaveQueue(playerId) {
    await Queue.deleteOne({ player: playerId });
    await Player.findByIdAndUpdate(playerId, { inQueue: false });
  }

  async checkForMatches() {
    const gamesInQueue = await Queue.aggregate([
      { $group: { _id: "$gameName", count: { $sum: 1 } } },
      { $match: { count: { $gte: this.playersPerMatch } } }
    ]);

    for (const game of gamesInQueue) {
      await this.matchPlayersForGame(game._id);
    }
  }

  async matchPlayersForGame(gameName) {
    // Get players grouped by similar skill level (±2 levels)
    const players = await Queue.aggregate([
      { $match: { gameName } },
      { $sort: { skillLevel: -1, joinedAt: 1 } }, // Highest skill first, oldest first
      { 
        $bucket: {
          groupBy: "$skillLevel",
          boundaries: [1, 4, 7, 10],
          default: "other",
          output: {
            players: { $push: "$$ROOT" }
          }
        }
      }
    ]);

    for (const group of players) {
      if (group.players.length >= this.playersPerMatch) {
        await this.createTeams(gameName, group.players);
      }
    }
  }

  async createTeams(gameName, queueEntries) {
    const players = queueEntries.map(entry => entry.player);
    const team1 = players.slice(0, this.teamSize);
    const team2 = players.slice(this.teamSize, this.teamSize * 2);

    // Create team session
    const session = new TeamSession({
      gameName,
      teams: [team1, team2],
      active: true
    });
    await session.save();

    // Remove matched players from queue
    await Queue.deleteMany({ player: { $in: players } });
    await Player.updateMany(
      { _id: { $in: players } },
      { inQueue: false }
    );

    return session;
  }
}

module.exports = new QueueService();