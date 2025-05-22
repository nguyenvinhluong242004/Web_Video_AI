import { createFullVideo } from '../../services/handleVideo.js';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { Client } from '@gradio/client';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

dotenv.config();

const handleVideoController = async (req, res) => {
  try {
    // Đảm bảo thư mục uploads tồn tại
    await fs.mkdir('uploads', { recursive: true });

    // Lấy dữ liệu từ request
    const images = req.files['images']?.map(file => file.path) || [];
    const audioFile = req.files['audio']?.[0];
    const audioPath = audioFile ? audioFile.path : null;

    // Parse scripts và durations
    let scripts, durations;
    try {
      scripts = JSON.parse(req.body.scripts || '[]') || [];
      durations = JSON.parse(req.body.durations || '[]') || [];
    } catch (e) {
      console.error('❌ Lỗi parse JSON:', e.message);
      return res.status(400).json({ error: 'Dữ liệu scripts hoặc durations không hợp lệ' });
    }

    // Log dữ liệu đầu vào
    console.log('📦 Số ảnh:', images.length);
    console.log('🎧 Audio:', audioPath);
    console.log('📝 Scripts:', scripts);
    console.log('⏱️ Durations:', durations);

    // Kiểm tra và chuyển đổi tệp ảnh
    const validImageMimeTypes = ['image/jpeg', 'image/png'];
    const imageBlobs = await Promise.all(
      images.map(async (img, index) => {
        if (!(await fs.access(img).then(() => true).catch(() => false))) {
          throw new Error(`Tệp ảnh không tồn tại: ${img}`);
        }
        const buffer = await fs.readFile(img);
        const fileType = await fileTypeFromBuffer(buffer);
        console.log(`File: ${img}, MIME type: ${fileType?.mime}, Size: ${buffer.length} bytes`);
        if (!fileType || !validImageMimeTypes.includes(fileType.mime)) {
          throw new Error(`Tệp không phải định dạng hình ảnh hợp lệ: ${img}. MIME types hỗ trợ: ${validImageMimeTypes.join(', ')}`);
        }
        // Chuyển đổi sang .png
        const outputPath = path.join('uploads', `converted_${index}_${Date.now()}.png`);
        await sharp(buffer).png({ quality: 100 }).toFile(outputPath);
        const convertedBuffer = await fs.readFile(outputPath);
        const convertedFileType = await fileTypeFromBuffer(convertedBuffer);
        console.log(`Converted file: ${outputPath}, MIME type: ${convertedFileType?.mime}, Size: ${convertedBuffer.length} bytes`);
        if (!convertedFileType || convertedFileType.mime !== 'image/png') {
          throw new Error(`Tệp .png sau chuyển đổi không hợp lệ: ${outputPath}`);
        }
        return new Blob([convertedBuffer], { type: 'image/png' });
      })
    );

    // Kiểm tra tệp âm thanh
    let audioBlob = null;
    if (audioPath) {
      if (!(await fs.access(audioPath).then(() => true).catch(() => false))) {
        throw new Error(`Tệp âm thanh không tồn tại: ${audioPath}`);
      }
      const buffer = await fs.readFile(audioPath);
      const fileType = await fileTypeFromBuffer(buffer);
      console.log(`Audio file: ${audioPath}, MIME type: ${fileType?.mime}, Size: ${buffer.length} bytes`);
      const validAudioMimeTypes = ['audio/wav', 'audio/mpeg'];
      if (!fileType || !validAudioMimeTypes.includes(fileType.mime)) {
        throw new Error(`Tệp âm thanh không phải định dạng hợp lệ: ${audioPath}. MIME types hỗ trợ: ${validAudioMimeTypes.join(', ')}`);
      }
      audioBlob = new Blob([buffer], { type: fileType.mime });
    }

    // Kiểm tra số lượng đầu vào
    if (imageBlobs.length !== scripts.length || scripts.length !== durations.length) {
      return res.status(400).json({ error: 'Số lượng ảnh, scripts và durations phải bằng nhau!' });
    }

    let finalVideo;

    if (process.env.ENV === 'local') {
      // Chạy cục bộ
      finalVideo = await createFullVideo(images, scripts, durations, audioPath);

      // Kiểm tra finalVideo
      if (!(await fs.access(finalVideo).then(() => true).catch(() => false))) {
        throw new Error(`Tệp video không tồn tại: ${finalVideo}`);
      }

      console.log('✅ Video đã hoàn thành:', finalVideo);
      console.log('🔄 Đang gửi video về client...');

      res.download(finalVideo, 'output_video.mp4', async (err) => {
        try {
          await fs.unlink(finalVideo);
          await Promise.all(images.map(img => fs.unlink(img).catch(() => { })));
          if (audioPath) await fs.unlink(audioPath);
        } catch (e) {
          console.warn('⚠️ Lỗi khi xóa tệp tạm:', e.message);
        }

        if (err) {
          console.error('❌ Lỗi khi tải video:', err);
          return res.status(500).json({ error: 'Có lỗi khi gửi video' });
        }
      });
    } else if (process.env.ENV === 'render') {
      // Gọi Gradio Space
      try {
        const client = await Client.connect("Luongsosad/video");

        // Log dữ liệu gửi đến Gradio
        console.log('📡 Gửi dữ liệu tới Gradio:', {
          image_files: imageBlobs.map((_, i) => `Blob ${i} (image/png)`),
          script_input: JSON.stringify(scripts),
          duration_input: JSON.stringify(durations),
          audio_file: audioPath ? `Blob (${audioBlob.type})` : null,
          fps: 60
        });

        const result = await client.predict("/predict", {
          image_files: imageBlobs,
          script_input: JSON.stringify(scripts),
          duration_input: JSON.stringify(durations),
          audio_file: audioBlob,
          fps: 60
        });

        console.log('📡 Kết quả từ Gradio:', result);

        let videoData = result.data[0].video;
        console.log('Video data:', videoData);

        if (videoData && videoData.path && (await fs.access(videoData.path).then(() => true).catch(() => false))) {
          finalVideo = videoData.path;
        } else if (videoData && videoData.url && videoData.url.startsWith('http')) {
          const outputPath = path.join('uploads', `output_video_${Date.now()}.mp4`);
          const response = await fetch(videoData.url);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          await fs.writeFile(outputPath, buffer);
          finalVideo = outputPath;
        } else {
          throw new Error('Kết quả từ Gradio không chứa đường dẫn tệp hợp lệ');
        }

        if (!(await fs.access(finalVideo).then(() => true).catch(() => false))) {
          throw new Error(`Tệp video không tồn tại: ${finalVideo}`);
        }

        console.log('✅ Video đã hoàn thành:', finalVideo);
        console.log('🔄 Đang gửi video về client...');

        res.download(finalVideo, 'output_video.mp4', async (err) => {
          if (err) {
            console.error('❌ Lỗi khi tải video:', err);
            return; // Không gửi response khác
          }

          try {
            await fs.unlink(finalVideo);
            await Promise.all(images.map(img => fs.unlink(img).catch(() => { })));
            if (audioPath) await fs.unlink(audioPath);
          } catch (e) {
            console.warn('⚠️ Lỗi khi xóa tệp tạm:', e.message);
          }
        });
      } catch (gradioError) {
        console.error('❌ Lỗi khi gọi Gradio Space:', gradioError.message);
        return res.status(500).json({ error: 'Lỗi khi gọi Gradio Space', details: gradioError.message });
      }
    } else {
      throw new Error('Biến ENV không hợp lệ. Phải là "local" hoặc "render".');
    }
  } catch (err) {
    console.error('❌ Lỗi tạo video:', err);
    return res.status(500).json({ error: 'Có lỗi xảy ra', details: err.message });
  }
};

export { handleVideoController };