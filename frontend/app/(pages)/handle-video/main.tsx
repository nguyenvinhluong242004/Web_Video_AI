"use client";
import React, { useState, useEffect } from "react";

interface ContentMainProps {
  promptImages: string[];
  images: string[][];
  setImages: React.Dispatch<React.SetStateAction<string[][]>>;
  restart: boolean;
  allImages: string[];
  setAllImages: React.Dispatch<React.SetStateAction<string[]>>;
  mergeAudio: string | null;  // đường dẫn tới file audio
  scripts: string[];   // các script cho từng clip
}

export default function Main({
  promptImages,
  images,
  setImages,
  restart,
  allImages,
  setAllImages,
  mergeAudio,
  scripts,
}: ContentMainProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number[]>([]); // thời gian của từng clip
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputVideo, setOutputVideo] = useState<string | null>(null);

  const toggleSelectImage = (imgUrl: string) => {
    setAllImages((prev) => {
      if (prev.includes(imgUrl)) {
        return prev.filter((url) => url !== imgUrl);
      } else {
        return [...prev, imgUrl];
      }
    });
  };

  const handleCreateVideo = async () => {
    if (allImages.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }

    setIsProcessing(true);

    // Tính duration cho từng ảnh (có thể là 5 giây mặc định hoặc tùy chỉnh)
    const durations = new Array(allImages.length).fill(5);

    try {
      // Gọi backend API để tạo video (cần gửi `images`, `scripts`, `durations`, và `mergeAudio`)
      const response = await fetch("/api/create-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: allImages,
          scripts,
          durations,
          audio: mergeAudio,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutputVideo(data.outputVideo); // Video output path
      } else {
        alert("Lỗi khi tạo video");
      }
    } catch (error) {
      console.error("Error creating video:", error);
      alert("Đã xảy ra lỗi khi tạo video!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-3 text-gray-800">🖼️ Image Viewer</h1>

      <div className="flex flex-col md:flex-row border-b-2 pb-12 md:pb-3 border-gray-600">
        <div className="flex flex-col space-x-2 pb-1 mb-0 text-black gap-1 md:mr-3">
          <span className="text-medium mb-5">List Content: {images.length}</span>

          <div className="w-full max-h-[120px] md:max-h-[500px] overflow-y-auto custom-scroll flex flex-col space-x-2 pb-2 mb-3 text-black gap-1"
               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {images.map((_, index) => (
              <div className="w-full md:w-[500px] text-center flex bg-gray-300 rounded-md" key={index}>
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`px-4 py-2 w-full md:w-[100px] h-full rounded-t ${activeIndex === index ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  style={{ borderRadius: "5px 0 0 5px" }}
                >
                  Content {index + 1}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📌 Prompt: </h2>
            <p className="bg-yellow-100 text-black p-2 rounded-md">{promptImages[activeIndex]}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🖼️ Ảnh cho Content {activeIndex + 1}</h2>
            <div className={`grid ${images[activeIndex] ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'} gap-3`}>
              {images[activeIndex].map((img, i) => (
                <div key={i} className="relative group cursor-pointer" onClick={() => toggleSelectImage(img)}>
                  <img
                    src={img}
                    alt={`image-${activeIndex}-${i}`}
                    className={`w-full h-32 object-cover rounded-md border-2 ${allImages.includes(img) ? "border-blue-500" : "border-gray-300"}`}
                  />
                  {allImages.includes(img) && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">Selected</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {allImages.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-green-700 mb-2">🎬 Ảnh đã chọn để làm video: ({allImages.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`selected-${i}`}
                className="w-full h-full object-cover rounded-md border border-green-500"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {isProcessing ? (
          <button disabled className="px-4 py-2 bg-gray-300 rounded">Đang xử lý...</button>
        ) : (
          <button onClick={handleCreateVideo} className="px-4 py-2 bg-blue-500 text-white rounded">Tạo video</button>
        )}

        {outputVideo && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Video đã tạo</h2>
            <video width="100%" controls>
              <source src={outputVideo} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
