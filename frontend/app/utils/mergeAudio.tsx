import { useEffect } from "react";
// ép kiểu thủ công khi import
const audioBufferToWav = require("audiobuffer-to-wav") as (buffer: AudioBuffer) => ArrayBuffer;
// npm install audiobuffer-to-wav

async function mergeAudios(audioUrls: string[]): Promise<Blob> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Tải và decode tất cả audio URLs
    const audioBuffers = await Promise.all(
        audioUrls.map(async (url) => {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await audioContext.decodeAudioData(arrayBuffer);
        })
    );

    const totalDuration = audioBuffers.reduce((sum, buffer) => sum + buffer.duration, 0);
    const sampleRate = audioContext.sampleRate;
    const numberOfChannels = Math.max(...audioBuffers.map(b => b.numberOfChannels));
    const outputBuffer = audioContext.createBuffer(numberOfChannels, totalDuration * sampleRate, sampleRate);

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