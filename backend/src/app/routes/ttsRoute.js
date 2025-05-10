const express = require('express');
const { synthesizeSpeech } = require('../controllers/TtsController');

const ttsRoutes = express.Router();

// Định nghĩa route cho Text to Speech
ttsRoutes.post('/', synthesizeSpeech);

module.exports = ttsRoutes;
