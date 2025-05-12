import { createFullVideo } from '../../services/handleVideo.js';
import fs from 'fs';

const handleVideoController = async (req, res) => {
    try {
        const { scripts, durations, audioPath } = req.body;
        const images = req.files.map(file => file.path); // Lấy đường dẫn đến các ảnh đã upload

        console.log('🔹 Đang tạo video...');

        // Gọi hàm createFullVideo để thực hiện toàn bộ quá trình
        const finalVideo = await createFullVideo(images, scripts, durations, audioPath);

        // Trả video cho người dùng
        res.download(finalVideo, 'output_video.mp4', (err) => {
            if (err) {
                console.error('❌ Lỗi khi tải video:', err);
                res.status(500).json({ error: 'Có lỗi xảy ra khi tải video', details: err.message });
            } else {
                // Xóa các file tạm sau khi tải về
                fs.unlinkSync(finalVideo);
            }
        });
    } catch (err) {
        console.error('❌ Lỗi tạo video:', err);
        res.status(500).json({ error: 'Có lỗi xảy ra khi tạo video', details: err.message });
    }
};

export { handleVideoController };
