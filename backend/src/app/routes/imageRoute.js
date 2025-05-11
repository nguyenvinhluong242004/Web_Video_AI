import express from 'express';
import { synthesizeImage } from '../controllers/ImageController.js';

const imageRoute = express.Router();

// Định nghĩa route cho Text to Speech
imageRoute.post('/', synthesizeImage);

export { imageRoute };
