import express from 'express';
import { synthesizeScript } from '../controllers/ScriptController.js';

const scriptRoute = express.Router();

// Định nghĩa route cho Text to Script
scriptRoute.post('/', synthesizeScript);

export { scriptRoute };
