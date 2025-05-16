import { Client } from '@gradio/client';
import axios from "axios";

const synthesizeImageVer2 = async (req, res) => {
    try {
        const {
            prompt,
            model,
            custom_lora,
            is_negative,
            steps,
            cfg_scale,
            sampler,
            seed,
            strength,
            width,
            height,
        } = req.body;

        const client = await Client.connect("Nymbo/Serverless-ImgGen-Hub");

        const result = await client.predict("/query", {
            prompt,
            model,
            custom_lora,
            is_negative,
            steps,
            cfg_scale,
            sampler,
            seed,
            strength,
            width,
            height,
        });

        console.log(result)

        // Kiểm tra kết quả
        const images = result.data[0]; // Mảng object ảnh, nhưng chỉ có 1 ảnh
        const imageUrl = images.url; // URL của ảnh

        // Đọc ảnh từ URL và chuyển đổi sang base64
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const base64Image = `data:image/webp;base64,${Buffer.from(imageResponse.data, "binary").toString("base64")}`;

        // Trả về kết quả base64
        res.json({
            type: "image",
            data: base64Image, // Mảng base64 chứa 1 ảnh
        });
        
    } catch (error) {
        console.error("Gradio image error:", error);
        res.status(500).json({ message: error.message, error: "Không tạo được ảnh." });
    }
};

export { synthesizeImageVer2 };
