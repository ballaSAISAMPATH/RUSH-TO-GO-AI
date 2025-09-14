const express = require('express');
const router = express.Router();
const { AIController } = require('../controllers/AIController');
router.post('/chat',AIController);

module.exports = router;
