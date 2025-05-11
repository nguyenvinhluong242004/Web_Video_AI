import React, { useState } from "react";
import axios from "axios";

export default function Main() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [prompt, setPrompt] = useState("A small cabin on top of a snowy mountain in the style of Disney, artstation");
    const [negative, setNegative] = useState("low quality, ugly");
    const [scale, setScale] = useState(7);
    const [loading, setLoading] = useState(false);

    const handleGenerateImage = async () => {
        if (!prompt.trim()) return alert("Prompt không được để trống.");
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/image`, {
                prompt,
                negative,
                scale,
            });

            // Giả sử backend trả về: { data: [[base64, base64, base64, base64]] }
            const base64Images: string[] = response.data.data;

            // Nếu thiếu prefix, thêm vào:
            const fullUrls = base64Images.map((img) =>
                img.startsWith("data:image") ? img : `data:image/png;base64,${img}`
            );

            setImageUrls(fullUrls);
        } catch (err) {
            console.error("Lỗi tạo ảnh:", err);
            alert("Có lỗi khi tạo ảnh.");
        }

        setLoading(false);
    };

    return (
        <div className="w-full mx-auto flex flex-col gap-2 text-black px-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">🖼️ Tạo Ảnh từ Prompt</h1>

            <div className="flex flex-col md:flex-row gap-6 mt-2">
                <div className="flex-1">
                    <label className="text-lg font-semibold">🎯 Prompt:</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Nhập mô tả ảnh..."
                        className="w-full border rounded-md px-3 py-2 resize-none mt-2"
                        rows={4}
                    />

                    <label className="font-semibold mt-4 block">🚫 Negative Prompt:</label>
                    <textarea
                        value={negative}
                        onChange={(e) => setNegative(e.target.value)}
                        placeholder="Những gì cần tránh..."
                        className="w-full border rounded-md px-3 py-2 resize-none"
                        rows={3}
                    />

                    <label className="font-semibold mt-4 block">🎚️ Scale (1-50):</label>
                    <input
                        type="range"
                        min={1}
                        max={50}
                        value={scale}
                        step={0.1}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-center mt-2">{scale}</div>

                    <div className="text-center mt-4">
                        <button
                            onClick={handleGenerateImage}
                            disabled={loading}
                            className={`px-6 py-2 rounded-md text-white font-semibold ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {loading ? "Đang tạo..." : "🎨 Tạo ảnh"}
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">📷 Kết quả</h3>
                    {imageUrls.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                            {imageUrls.map((url, idx) => (
                                <div key={idx} className="flex flex-col items-center border rounded-lg p-2 shadow-md">
                                    <img
                                        src={url}
                                        alt={`Ảnh ${idx + 1}`}
                                        className="w-full rounded-md mb-2"
                                    />
                                    <a
                                        href={url}
                                        download={`image_${idx + 1}.png`}
                                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1 rounded"
                                    >
                                        ⬇️ Tải xuống
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-md">
                            Chưa có ảnh
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
