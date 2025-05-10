import express from 'express';
import { synthesizeSpeech } from '../controllers/TtsController.js';

const ttsRoute = express.Router();

// Định nghĩa route cho Text to Speech
ttsRoute.post('/', synthesizeSpeech);

export { ttsRoute };
