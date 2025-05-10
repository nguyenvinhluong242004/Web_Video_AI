import WebSocket from 'ws';
import crypto from 'crypto';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config({ path: './src/app/config/.env' });

const API_KEY = process.env.XFYUN_API_KEY;
const API_SECRET = process.env.XFYUN_API_SECRET;
const APP_ID = process.env.XFYUN_APP_ID;

// Service xử lý Text-to-Speech
export const textToSpeech = (options) => {
  return new Promise((resolve, reject) => {
    const { text, vcn = 'xiaoyun', speed = 40, volume = 50, pitch = 60, aue = 'lame', auf = 'audio/L16;rate=16000', bgs = 0, tte = 'utf8' } = options;

    const wsUrl = 'wss://tts-api-sg.xf-yun.com/v2/tts';
    const date = new Date().toUTCString();
    const signatureOrigin = `host: tts-api-sg.xf-yun.com\ndate: ${date}\nGET /v2/tts HTTP/1.1`;

    const signature = crypto
      .createHmac('sha256', API_SECRET)
      .update(signatureOrigin)
      .digest('base64');

    const authorization = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorizationBase64 = Buffer.from(authorization).toString('base64');

    const wsUrlWithParams = `${wsUrl}?authorization=${authorizationBase64}&date=${encodeURIComponent(date)}&host=tts-api-sg.xf-yun.com`;

    const ws = new WebSocket(wsUrlWithParams);

    ws.on('open', () => {
      const textUtf8 = Buffer.from(text, 'utf8');
      const textBase64 = textUtf8.toString('base64');
      console.log(options)
      const payload = {
        common: {
          app_id: APP_ID,
        },
        business: {
          aue,
          auf,
          vcn,
          speed,
          volume,
          pitch,
          bgs,
          tte,
        },
        data: {
          status: 2,
          text: textBase64,
        },
      };

      ws.send(JSON.stringify(payload));
    });

    ws.on('message', (data) => {
      const decodedData = Buffer.from(data).toString('utf-8');
      const message = JSON.parse(decodedData);

      if (message.code === 0 && message.data && message.data.audio) {
        const buffer = Buffer.from(message.data.audio, 'base64');
        resolve(buffer);  // Trả về audio buffer
      }
    });

    ws.on('error', (error) => {
      reject(error);
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed.');
    });
  });
};
