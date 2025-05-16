"use client";
import React, { useState } from "react";
import Main from "./main";

interface ContentMainProps {
    promptImages: string[];
    setPromptImages: React.Dispatch<React.SetStateAction<string[]>>;
    images: string[][];
    setImages: React.Dispatch<React.SetStateAction<string[][]>>;
    imagesVer1: string[];
    setImagesVer1: React.Dispatch<React.SetStateAction<string[]>>;
    restartImg: boolean;
    allImages: string[];
    setAllImages: React.Dispatch<React.SetStateAction<string[]>>;
    imgChooseVer1: Number[];
    setImgChooseVer1: React.Dispatch<React.SetStateAction<Number[]>>;
}

export default function ContentMain({
    promptImages,
    setPromptImages,
    images,
    setImages,
    imagesVer1,
    setImagesVer1,
    restartImg,
    allImages,
    setAllImages,
    imgChooseVer1,
    setImgChooseVer1
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

    // Hàm set URL tại index chính xác
    const setPromptAtIndex = (index: number, pmt: string) => {
        setPromptImages((prev) => {
            const updated = [...prev];
            updated[index] = pmt;
            return updated;
        });
        console.log("Đã cập nhật audioUrls tại PromptImages:", index, "với Prompt:", pmt);
    };

    const setImagesAtIndex = (index: number, _images: string[]) => {
        setImages((prev) => {
            const updated = [...prev];
            updated[index] = _images;
            return updated;
        });
        console.log("Đã cập nhật images tại: ", index);
    };

    const setChooseImgAtIndex = (index: number, num: number) => {
        setImgChooseVer1((prev) => {
            const updated = [...prev];
            updated[index] = num;
            return updated;
        });
        if (images[index] && images[index][num] !== undefined) {
            setImagesVer1AtIndex(index, images[index][num]);
        }
        console.log("Đã cập nhật images tại: ", index);
    };

    // Hàm set URL tại index chính xác
    const setImagesVer1AtIndex = (index: number, img: string) => {
        setImagesVer1((prev) => {
            const updated = [...prev];
            updated[index] = img;
            return updated;
        });
        console.log("Đã cập nhật imagesVer1 tại :", index);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-3 text-gray-800">🖼️ Text to Image</h1>

            <div className="flex flex-col md:flex-row border-b-2 pb-12 md:pb-3 border-gray-600">
                <div className="flex flex-col space-x-2 pb-1 mb-0 text-black md:mr-0">
                    <h3 className="text-lg font-semibold mb-2">List Prompt: {promptImages.length}</h3>

                    <div className="w-full max-h-[120px] md:max-h-[500px] overflow-y-auto custom-scroll flex flex-col space-x-2 pb-2 mb-3 text-black gap-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        {promptImages.map((pmt, index) => (
                            <div className="w-full md:w-[250px] text-center flex bg-gray-300 rounded-md" key={index}>
                                <div>
                                    <button
                                        onClick={() => setActiveIndex(index)}
                                        className={`text-sm px-1 py-2 w-full md:w-[50px] h-full rounded-t ${activeIndex === index ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        style={{ borderRadius: "5px 0 0 5px" }}
                                    >
                                        P{index + 1}
                                    </button>
                                </div>

                                <div className="w-full md:w-[200px] pr-2 pl-2 text-sm text-black">{pmt}</div>
                            </div>

                        ))}
                    </div>
                </div>

                {promptImages.length > 0 && promptImages.map((pmt, index) => (
                    // Hiển thị nội dung chỉ khi phần tử là active
                    <div key={index} style={{ display: activeIndex === index ? 'block' : 'none' }}>
                        <Main idx={index} restart={restartImg} prompt={pmt} setPromptAtIndex={setPromptAtIndex} images={images[index]} setImagesAtIndex={setImagesAtIndex} setImagesVer1AtIndex={setImagesVer1AtIndex} imgChooseVer1={imgChooseVer1} setChooseImgAtIndex={setChooseImgAtIndex} />
                    </div>
                ))}
                {promptImages.length == 0 &&
                    <div>
                        <Main idx={-1} restart={false} prompt={"default"} setPromptAtIndex={setPromptAtIndex} images={[""]} setImagesAtIndex={setImagesAtIndex} setImagesVer1AtIndex={setImagesVer1AtIndex} imgChooseVer1={imgChooseVer1} setChooseImgAtIndex={setChooseImgAtIndex} />
                    </div>
                }


                {/* <Main /> */}
            </div>

            {(imagesVer1 && imagesVer1.length > 0) && (
                <div className="mt-3">
                    <h2 className="text-lg font-bold text-green-700 mb-2">🎬 Ảnh đã chọn để làm video: ({imagesVer1.length})</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {imagesVer1.map((img, i) => (
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