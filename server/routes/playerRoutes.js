const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.post('/register', playerController.registerPlayer);
router.post('/queue/join', playerController.joinQueue);
router.delete('/queue/leave/:playerId', playerController.leaveQueue);
router.get('/status/:playerId', playerController.getPlayerStatus);

module.exports = router;