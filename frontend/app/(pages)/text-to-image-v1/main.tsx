"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface MainProps {
    idx: number;
    restart: boolean;
    prompt: string;
    setPromptAtIndex: (index: number, url: string) => void; // Hàm để cập nhật prompt image tại index
    images: string[];
    setImagesAtIndex: (index: number, url: string[]) => void;
    setImagesVer1AtIndex: (index: number, url: string) => void; // Hàm để cập nhật prompt image tại index
    imgChooseVer1: Number[];
    setChooseImgAtIndex: (index: number, num: number) => void;
}

export default function Main({ idx, restart, prompt, setPromptAtIndex, images, setImagesAtIndex, setImagesVer1AtIndex, imgChooseVer1, setChooseImgAtIndex }: MainProps) {
    const calledRef = useRef(false);
    const [loaded, setLoaded] = useState(true);
    const [imageUrls, setImageUrls] = useState<string[]>(images || []);
    const [negative, setNegative] = useState("(deformed, distorted, disfigured), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, misspellings, typos, face error");
    const [scale, setScale] = useState(7);
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState("");

    useEffect(() => {
        if (restart && loaded && !calledRef.current) {
            calledRef.current = true;
            setLoaded(false);
            handleGenerateImage();
            console.log("calllll")
        }
    }, [restart, loaded]);

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
            console.log(fullUrls)
            setImageUrls(fullUrls)
            setImagesAtIndex(idx, fullUrls);
            setImagesVer1AtIndex(idx, fullUrls[0]);
            setChooseImgAtIndex(idx, 0);
            setLog("");
        } catch (err) {
            let errorMessage = "Không thể tạo ảnh ngay bây giờ! Hãy thử lại sau!";

            // ✅ Sửa từ 'responsive' → 'response'
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data?.message || err.message;
            } else if (typeof err === "string") {
                errorMessage = err;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = JSON.stringify(err);
            }

            console.error("Lỗi tạo ảnh:", err);
            setLog(errorMessage);
        }
        setLoading(false);
    };


    return (
        <div className="w-full mx-auto flex flex-col md:flex-row gap-2 text-black md:ml-3">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 md:max-w-[240px]">
                    <label className="text-lg font-semibold">🎯 Prompt:</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPromptAtIndex(idx, e.target.value)}
                        placeholder="Nhập mô tả ảnh..."
                        className="text-sm w-full border rounded-md px-3 py-2 resize-none mt-2"
                        rows={4}
                    />

                    <label className="font-semibold mt-4 block">🚫 Negative Prompt:</label>
                    <textarea
                        value={negative}
                        onChange={(e) => setNegative(e.target.value)}
                        placeholder="Những gì cần tránh..."
                        className="text-sm w-full border rounded-md px-3 py-2 resize-none"
                        rows={3}
                    />

                    <label className="font-semibold mt-4 block">🎚️ Scale (1-50): {scale}</label>
                    <input
                        type="range"
                        min={1}
                        max={50}
                        value={scale}
                        step={0.1}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full"
                    />

                    <div className="text-center mt-4">
                        <button
                            onClick={handleGenerateImage}
                            disabled={loading}
                            className={`px-6 py-2 rounded-md text-white font-semibold ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {loading ? "Đang tạo..." : "🎨 Tạo ảnh"}
                        </button>
                    </div>
                    {log !== "" &&
                        <div className="text-red-500 text-xs mt-3 text-center font-bold">
                            {log}
                        </div>
                    }
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">📷 Kết quả</h3>
                    {imageUrls.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                            {imageUrls.map((url, imgIndex) => (
                                <div key={imgIndex} className="flex flex-col items-center border rounded-lg p-2 shadow-md">
                                    <div>
                                        <img
                                            src={url}
                                            alt={`Ảnh ${imgIndex + 1}`}
                                            className="w-full rounded-md mb-2"
                                        />
                                    </div>
                                    <div className="flex w-full flex-row gap-2">
                                        <a
                                            onClick={() => setChooseImgAtIndex(idx, imgIndex)}
                                            className={`flex-1 text-center ${imgChooseVer1[idx] === imgIndex
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                                } text-white text-sm font-medium px-2 py-1 rounded`}
                                        >
                                            {imgChooseVer1[idx] === imgIndex ? "Đã chọn" : "Chọn"}
                                        </a>
                                        <a
                                            href={url}
                                            download={`image_${imgIndex + 1}.png`}
                                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-2 py-1 rounded"
                                        >
                                            Tải xuống
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-md">
                            Chưa có ảnh
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}
