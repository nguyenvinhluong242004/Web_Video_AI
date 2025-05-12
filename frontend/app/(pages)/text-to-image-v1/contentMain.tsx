"use client";
import React, { useState } from "react";

interface ContentMainProps {
    promptImages: string[];
    images: string[][];
    setImages: React.Dispatch<React.SetStateAction<string[][]>>;
    restartImg: boolean;
    allImages: string[];
    setAllImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ContentMain({
    promptImages,
    images,
    setImages,
    restartImg,
    allImages,
    setAllImages,
}: ContentMainProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleSelectImage = (imgUrl: string) => {
        setAllImages((prev) => {
            if (prev.includes(imgUrl)) {
                return prev.filter((url) => url !== imgUrl);
            } else {
                return [...prev, imgUrl];
            }
        });
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
                                        className={`w-full h-32 object-cover rounded-md border-2 ${allImages.includes(img) ? "border-blue-500" : "border-gray-300"
                                            }`}
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
        </div>
    );
}
