const Turf = require('../models/Turf');

// Create a new Turf
exports.createTurf = async (req, res) => {
  const { name, location, mapCoords, sportsAvailable, slotCapacity } = req.body;
  try {
    const newTurf = await Turf.create({
      name,
      location,
      mapCoords,
      sportsAvailable,
      slotCapacity
    });
    res.status(201).json(newTurf);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all Turfs
exports.getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
