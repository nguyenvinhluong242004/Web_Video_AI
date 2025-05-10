import express from 'express';
import { synthesizeGradioSpeech } from '../controllers/TtsControllerVer2.js';

const ttsVer2Route = express.Router();

// Định nghĩa route cho Text to Speech
ttsVer2Route.post('/', synthesizeGradioSpeech);

export { ttsVer2Route };
