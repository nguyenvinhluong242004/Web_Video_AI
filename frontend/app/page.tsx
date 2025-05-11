"use client";
import { useState, useEffect } from "react";
import Script from "./(pages)/text-to-script/main";
import Speed from "./(pages)/text-to-speed-v1/contentMain";
import SpeedV2 from "./(pages)/text-to-speed-v2/main";
import mergeAudios from "./utils/mergeAudio";

export default function Home() {
  const [activeTab, setActiveTab] = useState("script");
  const [script, setScript] = useState("");
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Viết nội dung video cảm động, truyền cảm hứng về một khía cạnh của cuộc sống – hành trình đi tìm hạnh phúc...\n'Bỏ đi phần chú thích, ghi chú, giới thiệu, chỉ bao gồm mỗi đoạn văn chứa nội dung'");
  const [scripts, setScripts] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [restart, setRestart] = useState(false);
  const [speedVersion, setSpeedVersion] = useState<"v1" | "v2">("v2");
  const [audio, setAudio] = useState<string | null>(null);


  const tabs = [
    { key: "script", label: "Tạo nội dung" },
    { key: "image", label: "Tạo ảnh" },
    { key: "speed", label: "Tạo giọng nói" },
    { key: "video", label: "Tạo video" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "script":
        return <Script script={script} setScript={setScript} prompt={prompt} setPrompt={setPrompt} />;
      case "image":
        return <h1 className="text-2xl font-bold text-black">🖼️ Giao diện tạo ảnh ở đây</h1>;
      case "speed":
        return (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex space-x-4 mb-1">
              <button
                onClick={() => setSpeedVersion("v1")}
                className={`px-4 py-1 rounded-full text-sm font-semibold border ${speedVersion === "v1"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
                  }`}
              >
                Speed V1
              </button>
              <button
                onClick={() => setSpeedVersion("v2")}
                className={`px-4 py-1 rounded-full text-sm font-semibold border ${speedVersion === "v2"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
                  }`}
              >
                Speed V2
              </button>
            </div>
            {speedVersion === "v1" ? (
              <Speed
                restart={restart}
                scripts={scripts}
                setScripts={setScripts}
                audioUrls={audioUrls}
                setAudioUrls={setAudioUrls}
                mergedAudioUrl={mergedAudioUrl}
              />
            ) : (
              <SpeedV2
                script={scriptContent}
                setScript={setScriptContent}
                audio={audio}
                setAudio={setAudio}
              />
            )}
          </div>
        );

      case "video":
        return <h1 className="text-2xl font-bold text-black">🎞️ Giao diện tạo video ở đây</h1>;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (script) {
      setScriptContent(script);
      const splitScript = script.split(/(?<=[.?!])\s+|\n+/).filter((s) => s.trim() !== "");
      setScripts(splitScript);
      setAudioUrls(new Array(splitScript.length).fill("")); // Đặt giá trị mặc định cho audioUrls
      setRestart(true); // Đặt lại trạng thái restart
      setMergedAudioUrl(null); // Đặt lại mergedAudioUrl khi script thay đổi
    } else {
      setScripts([]);
    }

  }, [script]);

  useEffect(() => {
    const allAudiosExist = audioUrls.length === scripts.length && audioUrls.every(url => typeof url === "string" && url.trim() !== "");

    if (scripts.length > 0 && allAudiosExist) {
      (async () => {
        const mergedBlob = await mergeAudios(audioUrls);
        const mergedUrl = URL.createObjectURL(mergedBlob);
        setMergedAudioUrl(mergedUrl);
        setRestart(false); // Đặt lại trạng thái restart sau khi ghép nối
      })();
    }
  }, [audioUrls, scripts]);


  return (
    <div className="min-h-screen font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-md">
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2">
            {tabs.map((tab, index) => (
              <div key={tab.key} className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border rounded-xl cursor-pointer ${activeTab === tab.key
                    ? "bg-gray-300 border-black text-black"
                    : "text-gray-500 hover:text-black"
                    }`}
                >
                  {tab.label}
                </button>
                {index < tabs.length - 1 && <span className="text-gray-400 font-bold">»</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-24 px-4 flex-1 overflow-y-scroll max-h-screen" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="max-w-4xl mx-auto pb-20 flex flex-col items-center gap-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}