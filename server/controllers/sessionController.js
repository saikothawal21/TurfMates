const TeamSession = require('../models/TeamSession');

exports.getActiveSessions = async (req, res) => {
  try {
    const { playerId } = req.params;
    const sessions = await TeamSession.find({
      active: true,
      $or: [
        { 'teams.0': playerId },
        { 'teams.1': playerId }
      ]
    }).populate('teams.0 teams.1');
    
    res.json(sessions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TeamSession.findByIdAndUpdate(
      sessionId,
      { active: false },
      { new: true }
    );
    
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};