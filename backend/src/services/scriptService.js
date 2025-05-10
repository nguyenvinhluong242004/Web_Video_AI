import { Groq } from 'groq-sdk';

import dotenv from 'dotenv';
dotenv.config({ path: './src/app/config/.env' });

// Khởi tạo Groq API
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Hàm gọi Groq API để tạo kịch bản video
export function generateScript(prompt) {
  return new Promise((resolve, reject) => {
    const messages = [
      {
        role: 'system',
        content:
          'Bạn là một Nhà văn chuyên viết nội dung hấp dẫn, ý nghĩa, đầy cảm xúc, trí tưởng tượng, mang tính giáo dục và giải trí. Bạn viết nội dung bằng tiếng Việt.',
      },
      {
        role: 'user',
        content: `Viết nội dung khoảng 100-200 từ với yêu cầu: "${prompt}". Vietnamese!`,
      },
    ];

    try {
      // Tạo kết nối tới Groq API để tạo kịch bản
      groq.chat.completions.create({
        model: 'llama3-8b-8192',
        messages,
        temperature: 0.7,
      }).then((completion) => {
        const script = completion.choices[0]?.message?.content || 'Không tạo được kịch bản.';
        resolve({ script });
      }).catch((error) => {
        console.error('Lỗi khi gọi Groq:', error);
        reject({ script: 'Lỗi khi tạo kịch bản.' });
      });
    } catch (error) {
      console.error('Lỗi khi gọi Groq:', error);
      reject({ script: 'Lỗi khi tạo kịch bản.' });
    }
  });
}
