"use client";
import { useState, useEffect } from "react";
import Script from "./(pages)/text-to-script/main";
import MainImage from "./(pages)/text-to-image-v1/contentMain";
import MainImageV2 from "./(pages)/text-to-image-v2/contentMain";
import MainSpeed from "./(pages)/text-to-speed-v1/contentMain";
import MainSpeedV2 from "./(pages)/text-to-speed-v2/contentMain";
import mergeAudios from "./utils/mergeAudio";
import MainVideo from "./(pages)/handle-video/main";

export default function Home() {
  const [activeTab, setActiveTab] = useState("script");
  const [script, setScript] = useState<string | null>(null);
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>("Viết nội dung video cảm động, truyền cảm hứng về một khía cạnh của cuộc sống – hành trình đi tìm hạnh phúc...");
  const [scripts, setScripts] = useState<string[]>([]);
  const [promptImages, setPromptImages] = useState<string[]>([]);
  const initialImages: string[][] = [
    [],
  ];
  const [images, setImages] = useState<string[][]>(initialImages);
  const [imagesVer2, setImagesVer2] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [restart, setRestart] = useState(false);
  const [restartImg, setRestartImg] = useState(false);
  const [restartImgVer2, setRestartImgVer2] = useState(false);
  const [audioUrlsVer2, setAudioUrlsVer2] = useState<string[]>([]);
  const [mergedAudioUrlVer2, setMergedAudioUrlVer2] = useState<string | null>(null);
  const [restartVer2, setRestartVer2] = useState(false);
  const [speedVersion, setSpeedVersion] = useState<"v1" | "v2">("v2");
  const [imageVersion, setImageVersion] = useState<"v1" | "v2">("v2");
  const [audio, setAudio] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [restartVideo, setRestartVideo] = useState(false);

  const [outputVideo, setOutputVideo] = useState<string>("");


  const tabs = [
    { key: "script", label: "Content" },
    { key: "image", label: "Image" },
    { key: "speed", label: "Speed" },
    { key: "video", label: "Video" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "script":
        return <Script script={script} setScript={setScript} prompt={prompt} setPrompt={setPrompt} handleScriptDone={handleScriptDone} />;
      case "image":
        return (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex space-x-4 mb-1">
              <button
                onClick={() => setImageVersion("v1")}
                className={`px-4 py-1 rounded-full text-sm font-semibold border ${imageVersion === "v1"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
                  }`}
              >
                Image V1
              </button>
              <button
                onClick={() => setImageVersion("v2")}
                className={`px-4 py-1 rounded-full text-sm font-semibold border ${imageVersion === "v2"
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
                  }`}
              >
                Image V2
              </button>
            </div>
            {imageVersion === "v1" ? (
              <MainImage
                promptImages={promptImages}
                images={images}
                setImages={setImages}
                restartImg={restartImg}
                allImages={allImages}
                setAllImages={setAllImages}
              />
            ) : (
              <MainImageV2
                promptImages={promptImages}
                setPromptImages={setPromptImages}
                images={imagesVer2}
                setImages={setImagesVer2}
                restartImg={restartImgVer2}
                allImages={allImages}
                setAllImages={setAllImages}
              />
            )}
          </div>
        );
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
              <MainSpeed
                script={scriptContent}
                setScript={setScriptContent}
                restart={restart}
                scripts={scripts}
                setScripts={setScripts}
                audioUrls={audioUrls}
                setAudioUrls={setAudioUrls}
                mergedAudioUrl={mergedAudioUrl}
              />
            ) : (
              <MainSpeedV2
                script={scriptContent}
                setScript={setScriptContent}
                restart={restartVer2}
                scripts={scripts}
                setScripts={setScripts}
                audioUrls={audioUrlsVer2}
                setAudioUrls={setAudioUrlsVer2}
                mergedAudioUrl={mergedAudioUrlVer2}
              />
            )}
          </div>
        );

      case "video":
        return (
          <div className="w-full flex flex-col items-center gap-4 mr-4 ml-4">
            <MainVideo
              promptImages={promptImages}
              images={images}
              setImages={setImages}
              restart={restartVideo}
              allImages={allImages}
              setAllImages={setAllImages}
              mergeAudio={mergedAudioUrlVer2}
              scripts={scripts}
              audioUrlsVer2={audioUrlsVer2}
              script={scriptContent}
              outputVideo={outputVideo}
              setOutputVideo={setOutputVideo}
            />;
          </div>
        );
      default:
        return null;
    }
  };

  const handleScriptDone = (text: string) => {
    if (text.trim() === "") return;
    setScripts([]);
    setScript(text);

    const splitScript = text
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const contentList: string[] = [];
    const imageList: string[] = [];

    for (let i = 0; i < splitScript.length; i++) {
      const line = splitScript[i];

      // Trường hợp 1: prompt ở cuối dòng
      const matchInline = line.match(/^(.*)\s*\(([^)]*)\)\s*$/);
      if (matchInline) {
        const [_, content, prompt] = matchInline;

        if (content.trim() !== "") {
          contentList.push(content.trim());
          imageList.push(prompt.trim());
          continue;
        }
      }

      // Trường hợp 2: prompt ở dòng sau
      if (i + 1 < splitScript.length) {
        const nextLine = splitScript[i + 1];
        const matchNextLine = nextLine.match(/^\(([^)]*)\)$/);
        if (matchNextLine && line.trim() !== "") {
          contentList.push(line.trim());
          imageList.push(matchNextLine[1].trim());
          i++; // bỏ qua dòng tiếp theo vì đã xử lý rồi
          continue;
        }
      }

      // Không có prompt
      if (line.trim() !== "") {
        contentList.push(line.trim());
        imageList.push("Default: a person walking on a mountain trail, looking out at a beautiful sunrise");
      }
    }

    // Xử lý cleanTextOnly (xóa prompt ra khỏi văn bản gốc)
    const cleanTextOnly = contentList.join("\n\n");

    setScriptContent(cleanTextOnly);
    setScripts(contentList);
    setPromptImages(imageList);
    setAudioUrls(new Array(contentList.length).fill(""));
    setAudioUrlsVer2(new Array(contentList.length).fill(""));
    setRestart(true);
    setRestartVer2(true);
    setRestartImg(true);
    setRestartImgVer2(true);
    setMergedAudioUrl(null);
    setMergedAudioUrlVer2(null);
    setImages(initialImages);
    setImagesVer2([]);
    setAllImages([]);

    console.log(cleanTextOnly);
    console.log(contentList);
    console.log(imageList);
  };


  useEffect(() => {
    const allAudiosExist =
      audioUrls.length === scripts.length &&
      audioUrls.every(url => typeof url === "string" && url.trim() !== "");

    if (scripts.length > 0 && allAudiosExist) {
      (async () => {
        try {
          const mergedBlob = await mergeAudios(audioUrls);
          const mergedUrl = URL.createObjectURL(mergedBlob);
          setMergedAudioUrl(mergedUrl);
          setRestart(false);
          console.log(mergedUrl);
        } catch (err) {
          console.error("Lỗi khi merge audio:", err);
        }
      })();
    }
  }, [audioUrls, scripts]);

  useEffect(() => {
    const allAudiosExist =
      audioUrlsVer2.length === scripts.length &&
      audioUrlsVer2.every(url => typeof url === "string" && url.trim() !== "");

    if (scripts.length > 0 && allAudiosExist) {
      (async () => {
        try {
          const mergedBlob = await mergeAudios(audioUrlsVer2);
          const mergedUrl = URL.createObjectURL(mergedBlob);
          setMergedAudioUrlVer2(mergedUrl);
          setRestartVer2(false);
          console.log(mergedUrl);
        } catch (err) {
          console.error("Lỗi khi merge audio:", err);
        }
      })();
    }
  }, [audioUrlsVer2, scripts]);

  useEffect(() => {
    const allImagesExist =
      imagesVer2.length === scripts.length &&
      imagesVer2.every(url => typeof url === "string" && url.trim() !== "");

    if (scripts.length > 0 && allImagesExist) {
      // Ghép mảng hoặc xử lý ảnh (tuỳ nhu cầu)
      setAllImages([...imagesVer2]); // hoặc xử lý thêm nếu cần
      console.log("Đã merge ảnh:", imagesVer2);
      setRestartImgVer2(false);
    }
  }, [imagesVer2]);


  return (
    <div className="min-h-screen font-sans overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-md">
        <div className="flex justify-center py-4">
          <div className="flex flex-wrap items-center space-x-2">
            {tabs.map((tab, index) => (
              <div key={tab.key} className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1 text-xs md:px-4 md:py-2 md:text-sm font-medium border rounded-xl cursor-pointer 
                      ${activeTab === tab.key
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

      <div className="pt-17 md:pt-20 px-4 flex-1 overflow-y-scroll max-h-screen" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
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