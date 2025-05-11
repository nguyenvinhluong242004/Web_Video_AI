import { Client } from '@gradio/client';  // Import Client từ @gradio/client
import axios from "axios";

const synthesizeImage = async (req, res) => {
    try {
        const { prompt, negative, scale = 0 } = req.body;

        const client = await Client.connect("stabilityai/stable-diffusion");
        const result = await client.predict("/infer", {
            prompt,
            negative,
            scale,
        });

        const images = result.data[0]; // Mảng chứa các ảnh

        // Duyệt qua từng ảnh và chuyển về base64
        const base64Images = await Promise.all(
            images.map(async (imgObj) => {
                const imageUrl = imgObj.image.url;
                const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
                return `data:image/png;base64,${Buffer.from(imageResponse.data, "binary").toString("base64")}`;
            })
        );

        res.json({
            type: "images",
            data: base64Images, // Mảng base64
        });
    } catch (error) {
        console.error("Gradio image error:", error);
        res.status(500).json({ error: "Không tạo được ảnh." });
    }
};


// Thay vì module.exports, sử dụng export
export { synthesizeImage };
