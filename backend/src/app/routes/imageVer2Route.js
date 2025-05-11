import express from 'express';
import { synthesizeImageVer2 } from '../controllers/ImageControllerVer2.js';

const imageVer2Route = express.Router();

// Định nghĩa route cho Text to Speech
imageVer2Route.post('/', synthesizeImageVer2);

export { imageVer2Route };
