// import { Client } from '@gradio/client';
// import axios from "axios";

// const synthesizeImageVer2 = async (req, res) => {
//     try {
//         const {
//             prompt,
//             model,
//             custom_lora,
//             is_negative,
//             steps,
//             cfg_scale,
//             sampler,
//             seed,
//             strength,
//             width,
//             height,
//         } = req.body;

//         const client = await Client.connect("Nymbo/Serverless-ImgGen-Hub");

//         const result = await client.predict("/query", {
//             prompt,
//             model,
//             custom_lora,
//             is_negative,
//             steps,
//             cfg_scale,
//             sampler,
//             seed,
//             strength,
//             width,
//             height,
//         });

//         console.log(result)

//         // Kiểm tra kết quả
//         const images = result.data[0]; // Mảng object ảnh, nhưng chỉ có 1 ảnh
//         const imageUrl = images.url; // URL của ảnh

//         // Đọc ảnh từ URL và chuyển đổi sang base64
//         const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
//         const base64Image = `data:image/webp;base64,${Buffer.from(imageResponse.data, "binary").toString("base64")}`;

//         // Trả về kết quả base64
//         res.json({
//             type: "image",
//             data: base64Image, // Mảng base64 chứa 1 ảnh
//         });
        
//     } catch (error) {
//         console.error("Gradio image error:", error);
//         res.status(500).json({ message: error.message, error: "Không tạo được ảnh." });
//     }
// };

// export { synthesizeImageVer2 };

import axios from "axios";
import fs from "fs";
import path from "path";

const synthesizeImageVer2 = async (req, res) => {
    try {
        const {
            prompt,
            negative_prompt,
            model,
            steps,
            cfg_scale,
            sampler_name,
            width,
            height,
        } = req.body;

        const url = "http://127.0.0.1:7860"; // local Stable Diffusion

        // Đổi model
        await axios.post(`${url}/sdapi/v1/options`, {
            sd_model_checkpoint: "darkSushiMixMix_225D.safetensors [cca17b08da]",
        });

        // Tạo ảnh
        const response = await axios.post(`${url}/sdapi/v1/txt2img`, {
            prompt,
            negative_prompt,
            steps: 10,
            cfg_scale: cfg_scale || 7,
            sampler_name: "DPM++ 2M Karras",
            width: 500,
            height: 800,
        });

        if (!response.data.images || response.data.images.length === 0) {
            return res.status(500).json({ message: "Không nhận được ảnh từ Stable Diffusion." });
        }

        // Giải mã base64 và lưu
        const imgBase64 = response.data.images[0];
        // const outputDir = path.resolve("outputs");
        // if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        // const filePath = path.join(outputDir, `output_${Date.now()}.png`);
        // fs.writeFileSync(filePath, Buffer.from(imgBase64, "base64"));

        // Trả về base64
        res.json({
            type: "image",
            data: `data:image/png;base64,${imgBase64}`,
        });

    } catch (err) {
        console.error("Stable Diffusion local error:", err.message);
        res.status(500).json({ error: "Không tạo được ảnh từ local." });
    }
};

export { synthesizeImageVer2 };

