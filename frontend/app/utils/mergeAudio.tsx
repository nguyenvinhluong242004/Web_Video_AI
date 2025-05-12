import { useEffect } from "react";

// Ép kiểu cho module CommonJS
const audioBufferToWav = require("audiobuffer-to-wav") as (buffer: AudioBuffer) => ArrayBuffer;

async function mergeAudios(audioUrls: string[]): Promise<Blob> {
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

export default mergeAudios;
