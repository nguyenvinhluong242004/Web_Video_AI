import { useEffect } from "react";

// Ép kiểu cho module CommonJS
const audioBufferToWav = require("audiobuffer-to-wav") as (buffer: AudioBuffer) => ArrayBuffer;

export async function mergeAudios(audioUrls: string[]): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Tải và decode toàn bộ audio URLs
  const audioBuffers = await Promise.all(
    audioUrls.map(async (url) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContext.decodeAudioData(arrayBuffer);
    })
  );

  // Tính tổng độ dài theo số sample (frame)
  const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const sampleRate = audioContext.sampleRate;
  const numberOfChannels = Math.max(...audioBuffers.map(b => b.numberOfChannels));
  const outputBuffer = audioContext.createBuffer(numberOfChannels, totalLength, sampleRate);

  // Gộp tất cả các buffer vào buffer kết quả
  let offset = 0;
  for (const buffer of audioBuffers) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const outData = outputBuffer.getChannelData(channel);
      const inData = buffer.getChannelData(channel % buffer.numberOfChannels);
      outData.set(inData, offset);
    }
    offset += buffer.length;
  }

  // Chuyển thành WAV và trả về Blob
  const wavData = audioBufferToWav(outputBuffer);
  const wavBlob = new Blob([wavData], { type: "audio/wav" });

  return wavBlob;
}

export async function addBackgroundMusic(
  musicBlob: Blob,
  mainAudioUrl: string,
  backgroundVolume: number = 0.3, // âm lượng nhạc nền, mặc định 0.3
  mainVolume: number = 1.0 // âm lượng audio chính, mặc định 1.0
): Promise<Blob> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Fetch và decode 2 nguồn âm thanh
  const [mainBuffer, musicBuffer] = await Promise.all([
    fetch(mainAudioUrl)
      .then(res => res.arrayBuffer())
      .then(buf => audioContext.decodeAudioData(buf)),
    musicBlob.arrayBuffer().then(buf => audioContext.decodeAudioData(buf))
  ]);

  // Độ dài output bằng độ dài của main audio
  const outputLength = mainBuffer.length; 
  const numberOfChannels = Math.max(mainBuffer.numberOfChannels, musicBuffer.numberOfChannels);
  const sampleRate = audioContext.sampleRate;

  const outputBuffer = audioContext.createBuffer(numberOfChannels, outputLength, sampleRate);

  // Trộn 2 audio bằng cách cộng sample, chỉ tính theo độ dài của main audio
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const outData = outputBuffer.getChannelData(channel);
    const mainData = mainBuffer.getChannelData(channel % mainBuffer.numberOfChannels);
    const musicData = musicBuffer.getChannelData(channel % musicBuffer.numberOfChannels);

    for (let i = 0; i < outputLength; i++) {
      const mainSample = (mainData[i] || 0) * mainVolume;
      const musicSample = (musicData[i] || 0) * backgroundVolume;
      outData[i] = mainSample + musicSample;
    }
  }

  // Normalize nếu lớn quá 1
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const outData = outputBuffer.getChannelData(channel);
    let maxSample = 0;
    for (let i = 0; i < outData.length; i++) {
      const absVal = Math.abs(outData[i]);
      if (absVal > maxSample) maxSample = absVal;
    }
    if (maxSample > 1) {
      for (let i = 0; i < outData.length; i++) {
        outData[i] /= maxSample;
      }
    }
  }

  const wavData = audioBufferToWav(outputBuffer);
  return new Blob([wavData], { type: "audio/wav" });
}
