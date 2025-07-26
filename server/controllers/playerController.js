const Player = require('../models/Player');
const queueService = require('../services/queueService');

exports.registerPlayer = async (req, res) => {
  try {
    const { username, gameName, skillLevel } = req.body;
    
    let player = await Player.findOne({ username });
    
    if (!player) {
      player = new Player({
        username,
        gamePreferences: [{ gameName, skillLevel }]
      });
    } else {
      const gameIndex = player.gamePreferences.findIndex(g => g.gameName === gameName);
      
      if (gameIndex >= 0) {
        player.gamePreferences[gameIndex].skillLevel = skillLevel;
      } else {
        player.gamePreferences.push({ gameName, skillLevel });
      }
    }
    
    await player.save();
    res.json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.joinQueue = async (req, res) => {
  try {
    const { playerId, gameName } = req.body;
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const gamePref = player.gamePreferences.find(g => g.gameName === gameName);
    if (!gamePref) {
      return res.status(400).json({ error: 'Game preference not set' });
    }
    
    const queueEntry = await queueService.joinQueue(
      playerId, 
      gameName, 
      gamePref.skillLevel
    );
    
    res.json(queueEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.leaveQueue = async (req, res) => {
  try {
    const { playerId } = req.params;
    await queueService.leaveQueue(playerId);
    res.json({ message: 'Left queue successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPlayerStatus = async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({
      inQueue: player.inQueue,
      lastActive: player.lastActive,
      gamePreferences: player.gamePreferences
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};