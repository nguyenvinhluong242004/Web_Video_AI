import express from 'express';
import multer from 'multer';
import { handleVideoController } from '../controllers/HandleVideoController.js';
import path from 'path';


const handleVideoRoute = express.Router();

// Cấu hình multer để lưu ảnh vào thư mục tạm thời
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Chọn thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file là thời gian hiện tại + mở rộng file
  }
});

const upload = multer({ storage: storage });

// Định nghĩa route cho Text to Script
handleVideoRoute.post('/', upload.array('images', 14), handleVideoController);

export { handleVideoRoute };
