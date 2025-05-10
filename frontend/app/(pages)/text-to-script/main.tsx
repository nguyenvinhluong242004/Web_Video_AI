"use client";
import React, { useState } from "react";
import axios from "axios";

export default function Main() {
    const [prompt, setPrompt] = useState("");
    const [script, setScript] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/script`, {
                prompt,
            });
            setScript(response.data.script);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            setScript("⚠️ Không thể tạo kịch bản.");
        }
        setLoading(false);
    };

    return (
        <div className="min-w-5xl mx-auto mt-10 p-6 rounded-xl shadow-md space-y-6 text-black flex flex-col gap-5 max-w-2xl">
            <h1 className="text-2xl font-bold text-center text-gray-800">🎬 Viết kịch bản Tiktok</h1>

            <label className="block">
                <span className="font-medium">Tiêu đề video</span>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Nhập tiêu đề video..."
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </label>

            <div className="text-center">
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`px-6 py-2 rounded-md text-white font-semibold ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {loading ? "Đang tạo..." : "✍️ Tạo kịch bản"}
                </button>
            </div>

            {script && (
                <div className="bg-gray-100 rounded-md p-4 mt-4 shadow-inner whitespace-pre-wrap">
                    <h2 className="font-semibold text-lg mb-2">📜 Kịch bản</h2>
                    {script}
                </div>
            )}
        </div>
    );
}
