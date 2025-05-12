import { createFullVideo } from '../../services/handleVideo.js';
import fs from 'fs';

const handleVideoController = async (req, res) => {
  try {
    const images = req.files['images']?.map(file => file.path) || [];
    const audioFile = req.files['audio']?.[0];
    const audioPath = audioFile ? audioFile.path : null;

    const scripts = JSON.parse(req.body.scripts || '[]');
    const durations = JSON.parse(req.body.durations || '[]');

    console.log('📦 Số ảnh:', images.length);
    console.log('🎧 Audio:', audioPath);
    console.log('📝 Scripts:', scripts);
    console.log('⏱️ Durations:', durations);

    const finalVideo = await createFullVideo(images, scripts, durations, audioPath);

    console.log('✅ Video đã hoàn thành:', finalVideo);
    console.log('🔄 Đang gửi video về client...');

    res.download(finalVideo, 'output_video.mp4', (err) => {
      // Xoá file tạm sau khi gửi xong
      try {
        fs.unlinkSync(finalVideo);
        images.forEach(img => fs.unlinkSync(img));
        if (audioPath) fs.unlinkSync(audioPath);
      } catch (e) {
        console.warn('⚠️ Lỗi khi xoá tệp tạm:', e.message);
      }

      if (err) {
        console.error('❌ Lỗi khi tải video:', err);
        res.status(500).json({ error: 'Có lỗi khi gửi video' });
      }
    });

  } catch (err) {
    console.error('❌ Lỗi tạo video:', err);
    res.status(500).json({ error: 'Có lỗi xảy ra', details: err.message });
  }
};

export { handleVideoController };
