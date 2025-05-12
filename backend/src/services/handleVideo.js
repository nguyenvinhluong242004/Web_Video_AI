import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Tạo clip từ ảnh + text
async function createVideoSegments(images, scripts, durations) {
  const promises = images.map((image, index) => {
    const duration = durations[index];
    const text = scripts[index].replace(/:/g, '\\:');
    const output = `clip_${index}.mp4`;

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(image)
        .loop(duration)
        .videoCodec('libx264')
        .outputOptions([
          '-vf',
          `drawtext=text='${text}':fontsize=32:fontcolor=white:x=(w-text_w)/2:y=h-100:box=1:boxcolor=black@0.5:boxborderw=10`,
          `-t ${duration}`
        ])
        .noAudio()
        .save(output)
        .on('end', () => resolve(output))
        .on('error', (err) => {
          console.error('❌ Lỗi khi tạo clip:', err);
          reject(err);
        });
    });
  });

  return Promise.all(promises);
}

// Nối các clip lại thành một video
async function concatVideoSegments(videoPaths) {
  const listFile = 'video_list.txt';
  const content = videoPaths.map(file => `file '${path.resolve(file)}'`).join('\n');
  fs.writeFileSync(listFile, content);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(listFile)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .videoCodec('libx264')
      .output('temp_video.mp4')
      .on('end', () => resolve('temp_video.mp4'))
      .on('error', (err) => {
        console.error('❌ Lỗi khi nối video:', err);
        reject(err);
      })
      .run();
  });
}

// Ghép video với audio
async function mergeWithAudio(videoPath, audioPath, outputPath = 'final_output.mp4') {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions(['-c:v copy', '-c:a aac', '-shortest'])
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => {
        console.error('❌ Lỗi khi ghép video với âm thanh:', err);
        reject(err);
      });
  });
}

// Gọi toàn bộ quá trình
async function createFullVideo(images, scripts, durations, audioPath, outputPath = 'final_output.mp4') {
  try {
    console.log('🔹 Đang tạo từng clip từ ảnh...');
    const clips = await createVideoSegments(images, scripts, durations);

    console.log('🔹 Đang nối các clip lại...');
    const mergedVideo = await concatVideoSegments(clips);

    console.log('🔹 Đang ghép với âm thanh...');
    const finalOutput = await mergeWithAudio(mergedVideo, audioPath, outputPath);

    console.log('✅ Video đã hoàn thành:', finalOutput);
    // Xóa tệp tạm sau khi tạo xong
    clips.forEach(file => fs.unlinkSync(file));
    fs.unlinkSync(mergedVideo);
    fs.unlinkSync('video_list.txt'); // Xóa tệp danh sách

    return finalOutput;
  } catch (err) {
    console.error('❌ Lỗi tạo video:', err);
    throw err;
  }
}

// Export các hàm
export {
  createFullVideo,
  createVideoSegments,
  concatVideoSegments,
  mergeWithAudio
};
