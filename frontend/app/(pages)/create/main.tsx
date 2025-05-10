"use client";
import React, { useState } from "react";
import axios from "axios";

export default function Main() {
    const [text, setText] = useState("");
    const [vcn, setVcn] = useState("xiaoyun");
    const [speed, setSpeed] = useState(40);
    const [volume, setVolume] = useState(50);
    const [pitch, setPitch] = useState(60);
    const [aue, setAue] = useState("lame");
    const [auf, setAuf] = useState("audio/L16;rate=16000");
    const [bgs, setBgs] = useState(0);
    const [tte, setTte] = useState("utf8");
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:6868/tts",
                {
                    text,
                    vcn,
                    speed,
                    volume,
                    pitch,
                    aue,
                    auf,
                    bgs,
                    tte,
                },
                {
                    responseType: "arraybuffer", // nhận dữ liệu nhị phân
                }
            );

            console.log("Response:", response);

            const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);

            // Tự động phát khi tạo xong
            // const audio = new Audio(url);
            // audio.play();
        } catch (error) {
            console.error("Error during API call:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-md space-y-6 text-black flex gap-5">
            <div>
                <h1 className="text-2xl font-bold text-center text-gray-800">🗣️ Text to Speech</h1>

                <div className="space-y-4">
                    <label className="block">
                        <span className="font-medium">Text</span>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Nhập văn bản"
                            rows={4}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="font-medium">VCN</span>
                            <input
                                type="text"
                                value={vcn}
                                onChange={(e) => setVcn(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </label>

                        <label className="block">
                            <span className="font-medium">Speed</span>
                            <input
                                type="range"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                min={0}
                                max={100}
                                step={1}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                            <span className="block text-center">{speed}</span>
                        </label>

                        <label className="block">
                            <span className="font-medium">Volume</span>
                            <input
                                type="range"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                min={0}
                                max={100}
                                step={1}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                            <span className="block text-center">{volume}</span>
                        </label>

                        <label className="block">
                            <span className="font-medium">Pitch</span>
                            <input
                                type="range"
                                value={pitch}
                                onChange={(e) => setPitch(Number(e.target.value))}
                                min={0}
                                max={100}
                                step={1}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                            <span className="block text-center">{pitch}</span>
                        </label>


                        <label className="block">
                            <span className="font-medium">AUE</span>
                            <select
                                value={aue}
                                onChange={(e) => setAue(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="lame">Lame</option>
                                <option value="speex">Speex</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-medium">AUF</span>
                            <input
                                type="text"
                                value={auf}
                                onChange={(e) => setAuf(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </label>

                        <label className="block">
                            <span className="font-medium">BGS</span>
                            <input
                                type="number"
                                value={bgs}
                                onChange={(e) => setBgs(Number(e.target.value))}
                                min={0}
                                max={1}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </label>

                        <label className="block">
                            <span className="font-medium">TTE</span>
                            <select
                                value={tte}
                                onChange={(e) => setTte(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="utf8">UTF-8</option>
                                <option value="gb2312">GB2312</option>
                            </select>
                        </label>
                    </div>

                    <div className="pt-4 text-center">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-6 py-2 rounded-md text-white font-semibold ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Đang xử lý..." : "🔊 Convert to Speech"}
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div>Result</div>
                {audioUrl && (
                    <div className="mt-4 text-center">
                        <audio controls src={audioUrl} />
                    </div>
                )}
            </div>
        </div>
    );
}
