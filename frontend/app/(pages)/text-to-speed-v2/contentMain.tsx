"use client";
import React, { useState, useEffect } from "react";
import Main from "./main";

interface ContentMainProps {
    script: string | null;
    setScript: React.Dispatch<React.SetStateAction<string | null>>;
    restart: boolean;
    scripts: string[];
    setScripts: React.Dispatch<React.SetStateAction<string[]>>;
    audioUrls: string[];
    setAudioUrls: React.Dispatch<React.SetStateAction<string[]>>;
    mergedAudioUrl: string | null;
}

export default function ContentMain({ script, setScript, restart, scripts, setScripts, audioUrls, setAudioUrls, mergedAudioUrl }: ContentMainProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Hàm set URL tại index chính xác
    const setAudioUrlAtIndex = (index: number, url: string) => {
        setAudioUrls((prev) => {
            const updated = [...prev];
            updated[index] = url;
            return updated;
        });
        console.log("Đã cập nhật audioUrls tại index:", index, "với URL:", url);
    };

    useEffect(() => {
        // Khi scripts thay đổi, cập nhật audioUrls
        console.log("Đã cập nhật audioUrls:", audioUrls);
    }, [audioUrls]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-3 text-gray-800">🗣️ Text to Speech</h1>
            <div className="flex flex-col md:flex-row border-b-2 pb-12 md:pb-3 border-gray-600">
                <div className="flex flex-col space-x-2 pb-1 mb-0 text-black gap-1 md:mr-3">
                    <div>
                        <span className="text-medium mb-5">List Content: {scripts.length}</span>
                    </div>
                    <div className="w-full max-h-[120px] md:max-h-[500px] overflow-y-auto custom-scroll flex flex-col space-x-2 pb-2 mb-3 text-black gap-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Firefox, IE
                    >
                        {scripts.map((_, index) => (
                            <div className="w-full md:w-[500px] text-center flex bg-gray-400 rounded-md" key={index}>
                                <div>
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`px-4 py-2 w-full md:w-[100px] h-full rounded-t ${activeIndex === index ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        style={{ borderRadius: "5px 0 0 5px" }}
                                    >
                                        Text {index + 1}
                                    </button>
                                </div>
                                <div className="w-full md:w-[400px] pr-2 pl-2 text-sm">{scripts[index]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {scripts.length > 0 && scripts.map((script, index) => (
                    // Hiển thị nội dung chỉ khi phần tử là active
                    <div key={index} style={{ display: activeIndex === index ? 'block' : 'none' }}>
                        <Main idx={index} restart={restart} script={script} scripts={scripts} setScripts={setScripts} url={audioUrls[index]} setAudioUrlAtIndex={setAudioUrlAtIndex} />
                    </div>
                ))}
                {scripts.length == 0 &&
                    <div>
                        <Main idx={-1} restart={restart} script={""} scripts={scripts} setScripts={setScripts} url={""} setAudioUrlAtIndex={setAudioUrlAtIndex} />
                    </div>
                }
            </div>
            {mergedAudioUrl && (
                <div className="mt-3 md:mt-3 flex flex-col md:flex-row md:items-center justify-center gap-2">
                    <div>

                        <h2 className="text-xl font-bold text-gray-800 pr-15">🎧 Audio đã được ghép nối: </h2>
                    </div>

                    <div>
                        <audio controls src={mergedAudioUrl}></audio>
                    </div>
                    <div>
                        <a href={mergedAudioUrl} download="merged_audio.wav" className="text-blue-500 ml-2 text-sm rounded-xl border-1 p-1 hover:bg-gray-200">Tải xuống</a></div>
                </div>
            )}
        </div>
    );
}
