import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import sizeOf from 'image-size';
import fs from 'fs';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function wrapText(text, maxWidth = 600 + 460, fontSize = 20) {
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';

  // Giả lập wrap text: Chia từ thành dòng không vượt quá maxWidth
  words.forEach(word => {
    if ((currentLine + ' ' + word).length * fontSize <= maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
}

// Tính chiều cao của text
function calculateTextHeight(text, fontSize = 20, lineSpacing = 10) {
  const lines = text.split('\n').length;  // Số dòng
  const textHeight = lines * fontSize + (lines - 1) * lineSpacing;  // Tổng chiều cao (tính cả khoảng cách giữa các dòng)
  return textHeight;
}

async function createVideoSegments(images, scripts, durations) {
  const promises = images.map((image, index) => {
    const duration = durations[index];
    const rawText = scripts[index];
    const text = wrapText(rawText).replace(/:/g, '\\:');  // Tự động xuống dòng và thay dấu ":" bằng "\:"

    const output = `clip_${index}.mp4`;

    // Lấy kích thước ảnh
    const { width, height } = { width: 600, height: 800 };

    const sValue = `${width}x${height}`;
    const fps = 60;
    const dFrames = Math.ceil(duration * fps);

    // Tính chiều cao của text
    const textHeight = calculateTextHeight(text, 20, 10);  // Giả sử fontsize là 20, lineSpacing là 10

    // Xác định vị trí của text trên video
    const yPosition = height - textHeight - 30;  // Cách đáy 30px

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(image)
        .loop(duration)
        .videoCodec('libx264')
        .outputOptions([
          '-vf',
          `scale=2400:-1,zoompan=z='min(zoom+0.0005,1.5)':x='floor(iw/2-(iw/zoom/2))':y='floor(ih/2-(ih/zoom/2))':d=${dFrames}:s=${sValue}:fps=${fps},
          drawtext=text='${text}':fontsize=20:fontcolor=white:x=(w-text_w)/2:y=${yPosition}:box=1:boxcolor=black@0.5:boxborderw=10:line_spacing=10`,
          `-t ${duration}`,
          '-pix_fmt yuv420p',
        ])
        // .outputOptions([
        //   '-vf',
        //   `scale='2400:trunc(ih*2400/iw/2)*2',fade=t=in:st=0:d=1,drawtext=text='${text.replace(/:/g, '\\:').replace(/'/g, "\\'")}':fontsize=20:fontcolor=white:x=(w-text_w)/2:y=${yPosition}:box=1:boxcolor=black@0.5:boxborderw=10:line_spacing=10`,
        //   `-t ${duration}`,
        //   '-pix_fmt yuv420p',
        // ])
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
