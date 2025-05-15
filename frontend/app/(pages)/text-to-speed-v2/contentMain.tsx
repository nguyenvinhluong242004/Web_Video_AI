"use client";
import React, { useState, useEffect } from "react";
import Main from "./main";
import { addBackgroundMusic } from "../../utils/mergeAudio";

interface ContentMainProps {
    script: string | null;
    setScript: React.Dispatch<React.SetStateAction<string | null>>;
    restart: boolean;
    scripts: string[];
    setScripts: React.Dispatch<React.SetStateAction<string[]>>;
    audioUrls: string[];
    setAudioUrls: React.Dispatch<React.SetStateAction<string[]>>;
    mergedAudioUrl: string | null;
    setMergedAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
    mergedAudioUrlMusic: string | null;
    setMergedAudioUrlMusic: React.Dispatch<React.SetStateAction<string | null>>;
    selectedAudioType: string;
    setSelectedAudioType: React.Dispatch<React.SetStateAction<"original" | "withMusic">>;
}

export default function ContentMain({
    script, setScript,
    restart,
    scripts, setScripts,
    audioUrls, setAudioUrls,
    mergedAudioUrl, setMergedAudioUrl,
    mergedAudioUrlMusic, setMergedAudioUrlMusic,
    selectedAudioType, setSelectedAudioType
}: ContentMainProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [backgroundMusicFile, setBackgroundMusicFile] = useState<File | null>(null);
    const setAudioUrlAtIndex = (index: number, url: string) => {
        setAudioUrls((prev) => {
            const updated = [...prev];
            updated[index] = url;
            return updated;
        });
        console.log("Đã cập nhật audioUrls tại index:", index, "với URL:", url);
    };

    const handleMergeWithMusic = async () => {
        if (!mergedAudioUrl || !backgroundMusicFile) {
            alert("Vui lòng chọn nhạc nền và đảm bảo đã có audio merge.");
            return;
        }
        const mixedBlob = await addBackgroundMusic(backgroundMusicFile, mergedAudioUrl, 0.1, 0.7); // musicVolume, mainVolume
        const mixedUrl = URL.createObjectURL(mixedBlob);
        setMergedAudioUrlMusic(mixedUrl);
        setSelectedAudioType("withMusic");
    };

    useEffect(() => {
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
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        {scripts.map((_, index) => (
                            <div className="w-full md:w-[500px] text-center flex bg-gray-400 rounded-md" key={index}>
                                <div>
                                    <button
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
                    <div key={index} style={{ display: activeIndex === index ? 'block' : 'none' }}>
                        <Main
                            idx={index}
                            restart={restart}
                            script={script}
                            scripts={scripts}
                            setScripts={setScripts}
                            url={audioUrls[index]}
                            setAudioUrlAtIndex={setAudioUrlAtIndex}
                        />
                    </div>
                ))}
                {scripts.length === 0 && (
                    <div>
                        <Main
                            idx={-1}
                            restart={restart}
                            script={""}
                            scripts={scripts}
                            setScripts={setScripts}
                            url={""}
                            setAudioUrlAtIndex={setAudioUrlAtIndex}
                        />
                    </div>
                )}
            </div>

            {mergedAudioUrl && (
                <div className="mt-6 flex flex-col items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800">🎧 Audio Preview:</h2>

                    {/* Chọn loại audio */}
                    <div className="flex gap-2">
                        <button
                            className={`cursor-pointer px-3 py-1 rounded ${selectedAudioType === "original" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                            onClick={() => setSelectedAudioType("original")}
                        >
                            🎙️ Audio Gốc
                        </button>
                        {mergedAudioUrlMusic && (
                            <button
                                className={`cursor-pointer px-3 py-1 rounded ${selectedAudioType === "withMusic" ? "bg-green-600 text-white" : "bg-gray-300"}`}
                                onClick={() => setSelectedAudioType("withMusic")}
                            >
                                🎶 Audio Có Nhạc Nền
                            </button>
                        )}
                    </div>

                    {/* Trình phát audio tương ứng */}
                    <audio
                        controls
                        src={selectedAudioType === "withMusic" && mergedAudioUrlMusic
                            ? mergedAudioUrlMusic
                            : mergedAudioUrl}
                    />

                    <a
                        href={selectedAudioType === "withMusic" && mergedAudioUrlMusic
                            ? mergedAudioUrlMusic
                            : mergedAudioUrl}
                        download={selectedAudioType === "withMusic" ? "final_audio_with_music.wav" : "merged_audio.wav"}
                        className="text-blue-500 text-sm rounded-xl border p-1 hover:bg-gray-200"
                    >
                        ⬇️ Tải xuống
                    </a>

                    <div className="mt-0 flex flex-col items-center gap-2 text-black">
                        <label className="text-xl font-medium">🎵 Thêm nhạc nền:</label>
                        <input className="cursor-pointer" type="file" accept="audio/*" onChange={(e) => setBackgroundMusicFile(e.target.files?.[0] || null)} />
                        <button
                            onClick={handleMergeWithMusic}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
                        >
                            🎚️ Merge với nhạc nền
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
