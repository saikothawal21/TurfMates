const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');

router.get('/active/:playerId', sessionController.getActiveSessions);
router.put('/complete/:sessionId', sessionController.completeSession);

module.exports = router;