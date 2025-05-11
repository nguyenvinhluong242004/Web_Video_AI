"use client";
import React, { useState } from "react";
import axios from "axios";

interface MainProps {
    script: string | null;
    setScript: React.Dispatch<React.SetStateAction<string | null>>;
    prompt: string | null;
    setPrompt: React.Dispatch<React.SetStateAction<string | null>>;
    handleScriptDone: (text: string) => void;
}

export default function Main({ script, setScript, prompt, setPrompt, handleScriptDone }: MainProps) {

    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        if (prompt.trim().length < 7) {
            alert("Vui lòng nhập tiêu đề video dài hơn 7 ký tự.");
            return;
        }
        setLoading(true);
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ping`);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/script`,
                {
                    prompt,
                }
            );
            console.log("Đã nhận phản hồi từ API:", response);
            const { data } = response;
            console.log("Kịch bản:", data.script);
            let scriptContent = data.script;
            if (typeof data.script === 'string') {
                console.log("string")
                script = data.script;
            } else if (typeof data.script === 'object') {
                console.log("object")
                script = JSON.stringify(data.script);
            }

            handleScriptDone(scriptContent);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("bug")
        }
        setLoading(false);
    };

    return (
        <div className="w-full mx-auto justify-content-center rounded-xl text-black flex flex-col gap-1 h-full">
            <h1 className="text-2xl font-bold text-center text-gray-800">🎬 Viết kịch bản Video</h1>

            <div className="flex gap-4 mt-2">

                <div className="h-full">

                    <h3 className="text-xl mt-4 font-bold">Tiêu đề video</h3>
                    <label className="block">
                        <textarea
                            value={prompt ? prompt : ""}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Nhập tiêu đề video..."
                            className="w-[400px] mt-0 block rounded-md border border-gray-300 px-3 py-2 resize-none focus:outline-none :focus:border-transparent :focus:ring-none"
                            rows={14}
                        />
                    </label>


                    <div className="text-center mt-3">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`px-6 py-2 rounded-md text-white font-semibold ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {loading ? "Đang tạo..." : "✍️ Tạo kịch bản"}
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    <h3 className="text-xl font-bold mt-4">📜 Kịch bản</h3>
                    <div className={`bg-gray-100 rounded-md px-3 py-2 mt-0 w-[500px] whitespace-pre-wrap ${script ? "" : "h-[404px]"} `}>
                        {script}
                    </div>
                </div>

            </div>


        </div>
    );
}
