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
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ping`);
            
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/tts`,
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
                    responseType: "arraybuffer",
                }
            );

            const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        } catch (error) {
            console.error("Error during API call:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-w-5xl mx-auto mt-10 p-6 rounded-xl shadow-md space-y-6 text-black flex gap-5">
            <div className="w-full max-w-xl">
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
                            <select
                                value={vcn}
                                onChange={(e) => setVcn(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <optgroup label="Tiếng Việt">
                                    <option value="xiaoyun">xiaoyun</option>
                                </optgroup>
                                <optgroup label="Tiếng Anh">
                                    <option value="x_John">x_John</option>
                                    <option value="x_Steve">x_Steve</option>
                                    <option value="x_Catherine">x_Catherine</option>
                                </optgroup>
                                <optgroup label="Tiếng Trung">
                                    <option value="x_xiaoyan">x_xiaoyan</option>
                                    <option value="x_xiaomei">x_xiaomei</option>
                                </optgroup>
                                <optgroup label="Khác">
                                    <option value="mariane">mariane</option>
                                    <option value="leonie">leonie</option>
                                    <option value="mohamed">mohamed</option>
                                </optgroup>
                            </select>
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
                                className="mt-1 w-full"
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
                                className="mt-1 w-full"
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
                                className="mt-1 w-full"
                            />
                            <span className="block text-center">{pitch}</span>
                        </label>

                        <label className="block">
                            <span className="font-medium">AUE</span>
                            <select
                                value={aue}
                                onChange={(e) => setAue(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="lame">lame (MP3)</option>
                                <option value="raw">raw (PCM)</option>
                                <option value="speex">speex (8k)</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-medium">AUF</span>
                            <select
                                value={auf}
                                onChange={(e) => setAuf(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="audio/L16;rate=16000">audio/L16;rate=16000</option>
                                <option value="audio/L16;rate=8000">audio/L16;rate=8000</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-medium">BGS (âm nền)</span>
                            <select
                                value={bgs}
                                onChange={(e) => setBgs(Number(e.target.value))}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value={0}>Không</option>
                                <option value={1}>Có</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-medium">TTE</span>
                            <select
                                value={tte}
                                onChange={(e) => setTte(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="utf8">utf8</option>
                                <option value="gb2312">gb2312</option>
                                <option value="gbk">gbk</option>
                                <option value="big5">big5</option>
                                <option value="unicode">unicode (UTF-16LE)</option>
                                <option value="gb18030">gb18030</option>
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

            <div className="w-full max-w-sm">
                <h2 className="font-semibold text-lg mb-2">🎧 Kết quả</h2>
                {audioUrl && (
                    <div className="mt-4 text-center">
                        <audio controls src={audioUrl} />
                    </div>
                )}
            </div>
        </div>
    );
}
