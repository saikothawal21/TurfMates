const Team = require('../models/Team');

// Create a team
exports.createTeam = async (req, res) => {
  const { name, sport, turf, matchTime } = req.body;
  try {
    const newTeam = await Team.create({
      name,
      sport,
      turf,
      createdBy: req.user.id,
      players: [req.user.id],
      matchTime
    });
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a team (e.g., rename, change match time or turf)
exports.updateTeam = async (req, res) => {
  const { teamId } = req.params;
  const { name, matchTime, turf } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the creator can update the team' });
    }

    team.name = name || team.name;
    team.matchTime = matchTime || team.matchTime;
    team.turf = turf || team.turf;

    const updated = await team.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a team
exports.deleteTeam = async (req, res) => {
  const { teamId } = req.params;
  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the creator can delete the team' });
    }

    await team.deleteOne();
    res.json({ msg: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
