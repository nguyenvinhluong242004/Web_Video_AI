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
        content: `
Bạn là một Nhà văn chuyên viết nội dung hấp dẫn, ý nghĩa, đầy cảm xúc, mang tính giáo dục và giải trí. Bạn viết nội dung bằng tiếng Việt.

Yêu cầu bắt buộc:
- Viết một bài gồm nhiều đoạn văn, mỗi đoạn 50–100 từ, theo chủ đề được cung cấp.
- Không được viết tiêu đề hoặc cụm ngắn đầu mỗi đoạn (ví dụ như: "Niềm tin", "Ước mơ"...).
- Mỗi đoạn PHẢI đi kèm một mô tả ảnh bằng tiếng Anh, viết trong dấu ngoặc đơn (), đặt ngay sau đoạn văn.
- Mỗi mô tả ảnh phải mô tả chính xác hình ảnh đại diện cho đoạn nội dung vừa viết.
- Khi mô tả, phải có sự liên kết với nhau, ví dụ toàn bộ đều liên quan đến nam hoặc nữ nếu có phần liên quan người.
- Kể cả đoạn cuối cùng cũng phải có mô tả ảnh.
- Không lặp lại mô tả ảnh. Không được viết chú thích ngoài đoạn văn.
- Các đoạn nội dung nên phong phú, tránh lặp lại.

Ví dụ:
Đoạn văn đầy đủ viết bằng tiếng Việt, mô tả ảnh bằng tiếng Anh đặt sau đoạn như thế này:
"Cuộc sống là một hành trình không dễ dàng... (Picture description: a man sitting alone under a streetlight on a rainy night)"

==> Lưu ý: Không viết tiêu đề riêng, không viết mô tả ảnh trước đoạn văn. Chỉ cần đoạn văn + mô tả ảnh như ví dụ.
`.trim()


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
