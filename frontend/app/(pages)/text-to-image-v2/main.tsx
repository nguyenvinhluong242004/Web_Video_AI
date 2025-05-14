"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface MainProps {
    idx: number;
    restart: boolean;
    prompt: string;
    setPromptAtIndex: (index: number, url: string) => void; // Hàm để cập nhật prompt image tại index
    image: string;
    setImagesAtIndex: (index: number, url: string) => void; // Hàm để cập nhật prompt image tại index
}

export default function Main({ idx, restart, prompt, setPromptAtIndex, image, setImagesAtIndex }: MainProps) {
    const calledRef = useRef(false);
    const [imageUrl, setImageUrl] = useState<string | null>(image);
    const [loaded, setLoaded] = useState(true);
    const [isNegative, setIsNegative] = useState("(deformed, distorted, disfigured), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, misspellings, typos");
    const [model, setModel] = useState("FLUX.1 [Schnell]");
    const [customLora, setCustomLora] = useState("");
    const [steps, setSteps] = useState(4);
    const [scale, setScale] = useState(7); // cfg_scale
    const [sampler, setSampler] = useState("DPM++ 2M Karras");
    const [seed, setSeed] = useState(-1);
    const [strength, setStrength] = useState(0.7);
    const [width, setWidth] = useState(1080);
    const [height, setHeight] = useState(1920);
    const [loading, setLoading] = useState(false);

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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/image-v2`, {
                prompt,
                model,
                custom_lora: customLora,
                is_negative: isNegative,
                steps,
                cfg_scale: scale,
                sampler,
                seed,
                strength,
                width,
                height,
            });

            const base64Image: string = response.data.data;

            const fullUrl = base64Image.startsWith("data:image")
                ? base64Image
                : `data:image/png;base64,${base64Image}`;

            setImageUrl(fullUrl);
            setImagesAtIndex(idx, fullUrl);
        } catch (err) {
            console.error("Lỗi tạo ảnh:", err);
            alert("Có lỗi khi tạo ảnh.");
        }

        setLoading(false);
    };

    return (
        <div className="w-full mx-auto flex flex-col gap-2 text-black px-2 text-sm">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-lg font-semibold">🎯 Prompt:</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPromptAtIndex(idx, e.target.value)}
                        className="w-full border rounded-md px-3 py-2 resize-none mt-2"
                        rows={3}
                    />

                    <label className="font-semibold mt-1 block">🚫 Negative Prompt:</label>
                    <textarea
                        value={isNegative}
                        onChange={(e) => setIsNegative(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 resize-none"
                        rows={2}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 text-sm">
                        <label className="block">
                            <span className="font-medium">🧠 Model:</span>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="FLUX.1 [Schnell]">FLUX.1 [Schnell]</option>
                                <option value="FLUX.1 [Dev]">FLUX.1 [Dev]</option>
                                <option value="Stable Diffusion 2-1">Stable Diffusion 2-1</option>
                                <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                                <option value="Stable Diffusion 3 Medium">Stable Diffusion 3 Medium</option>
                                <option value="Stable Diffusion 3.5 Large">Stable Diffusion 3.5 Large</option>
                                <option value="Stable Diffusion 3.5 Large Turbo">Stable Diffusion 3.5 Large Turbo</option>
                            </select>
                        </label>


                        <label className="block" style={{display: 'none'}}>
                            <span className="font-medium">🎨 Custom LoRA:</span>
                            <input
                                value={customLora}
                                onChange={(e) => setCustomLora(e.target.value)}
                                className="w-full border rounded-md px-3 py-1"
                            />
                        </label>

                        <label className="block">
                            <span className="font-medium">🔁 Steps:</span>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={steps}
                                onChange={(e) => setSteps(Number(e.target.value))}
                                className="w-full border rounded-md px-3 py-1"
                            />
                        </label>

                        <label className="block">
                            <span className="font-medium">🎚️ CFG Scale:</span>
                            <input
                                type="range"
                                min={1}
                                max={50}
                                value={scale}
                                step={0.1}
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-center">{scale}</div>
                        </label>

                        <label className="block" style={{display: 'none'}}>
                            <span className="font-medium">🧪 Sampler:</span>
                            <input
                                value={sampler}
                                onChange={(e) => setSampler(e.target.value)}
                                className="w-full border rounded-md px-3 py-1"
                            />
                        </label>

                        <label className="block" style={{display: 'none'}}>
                            <span className="font-medium">🌱 Seed:</span>
                            <input
                                type="number"
                                value={seed}
                                onChange={(e) => setSeed(Number(e.target.value))}
                                className="w-full border rounded-md px-3 py-1"
                            />
                        </label>

                        <label className="block" style={{display: 'none'}}>
                            <span className="font-medium">💧 Strength (0 - 1):</span>
                            <input
                                type="number"
                                step={0.01}
                                min={0}
                                max={1}
                                value={strength}
                                onChange={(e) => setStrength(Number(e.target.value))}
                                className="w-full border rounded-md px-3 py-1"
                            />
                        </label>

                        <label className="block">
                            <span className="font-medium">📐 Kích thước:</span>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(Number(e.target.value))}
                                    className="w-full border rounded-md px-3 py-1"
                                    placeholder="Width"
                                />
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="w-full border rounded-md px-3 py-1"
                                    placeholder="Height"
                                />
                            </div>
                        </label>

                    </div>



                    <div className="text-center mt-6">
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
                    {imageUrl ? (
                        <div className="flex flex-col items-center border rounded-lg p-2 shadow-md">
                            <img
                                src={imageUrl}
                                alt="Generated"
                                className="w-full rounded-md mb-2"
                            />
                            <a
                                href={imageUrl}
                                download="generated_image.png"
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1 rounded"
                            >
                                ⬇️ Tải xuống
                            </a>
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
