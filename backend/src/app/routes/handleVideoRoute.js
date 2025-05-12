import express from 'express';
import multer from 'multer';
import { handleVideoController } from '../controllers/HandleVideoController.js';
import path from 'path';
import fs from 'fs';

const handleVideoRoute = express.Router();

// Tạo thư mục uploads nếu chưa có
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu ảnh/audio vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Cho phép nhận nhiều ảnh và 1 audio
handleVideoRoute.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'audio', maxCount: 1 }
  ]),
  handleVideoController
);

export { handleVideoRoute };
