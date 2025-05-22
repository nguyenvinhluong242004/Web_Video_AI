"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface ContentMainProps {
    promptImages: string[];
    restart: boolean;
    imageVersion: string,
    setImageVersion: React.Dispatch<React.SetStateAction<"v1" | "v2">>;
    allImages: string[];
    setAllImages: React.Dispatch<React.SetStateAction<string[]>>;
    allImagesVer1: string[];
    setAllImagesVer1: React.Dispatch<React.SetStateAction<string[]>>;
    mergeAudio: string | null;  // đường dẫn tới file audio
    setMergedAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
    mergedAudioUrlMusic: string | null;
    setMergedAudioUrlMusic: React.Dispatch<React.SetStateAction<string | null>>;
    selectedAudioType: string;
    setSelectedAudioType: React.Dispatch<React.SetStateAction<"original" | "withMusic">>;
    scripts: string[];   // các script cho từng clip
    audioUrlsVer2: string[];
    script: string | null;
    outputVideo: string | "";
    setOutputVideo: React.Dispatch<React.SetStateAction<string>>;
}

export default function Main({
    promptImages,
    restart,
    imageVersion, setImageVersion,
    allImages, setAllImages,
    allImagesVer1, setAllImagesVer1,
    mergeAudio, setMergedAudioUrl,
    mergedAudioUrlMusic, setMergedAudioUrlMusic,
    selectedAudioType, setSelectedAudioType,
    scripts,
    audioUrlsVer2,
    script,
    outputVideo,
    setOutputVideo
}: ContentMainProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [videoDuration, setVideoDuration] = useState<number[]>([]); // thời gian của từng clip
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleSelectImage = (imgUrl: string) => {
        setAllImages((prev) => {
            if (prev.includes(imgUrl)) {
                return prev.filter((url) => url !== imgUrl);
            } else {
                return [...prev, imgUrl];
            }
        });
    };

    useEffect(() => {
        console.log('Video URL:', outputVideo);
        return () => {
            if (outputVideo !== "") {
                console.log('Video URL:', outputVideo);
                URL.revokeObjectURL(outputVideo);  // Giải phóng URL blob khi không còn sử dụng
            }
        };
    }, [outputVideo]);

    const handleCreateVideo = async () => {
        if (imageVersion === "v1") {
            if (allImagesVer1.length === 0) {
                alert("Vui lòng chọn ít nhất 1 ảnh!");
                return;
            }
        }
        else {
            if (allImages.length === 0) {
                alert("Vui lòng chọn ít nhất 1 ảnh!");
                return;
            }
        }


        setIsProcessing(true);

        // Khởi tạo mảng durations với kiểu number[]
        const durations: number[] = [];
        setOutputVideo("");

        try {
            // Fetch thời gian cho từng audio
            for (let i = 0; i < audioUrlsVer2.length; i++) {
                const audioUrl = audioUrlsVer2[i];
                const res = await fetch(audioUrl);
                const audioBlob = await res.blob();
                const audioUrlObject = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrlObject);

                // Wait for audio metadata to load and get the duration
                await new Promise<void>((resolve, reject) => {
                    audio.onloadedmetadata = () => {
                        durations.push(audio.duration); // thời gian của mỗi audio ứng với mỗi ảnh
                        resolve();
                    };
                    audio.onerror = reject; // handle error if audio loading fails
                });
            }

            // Kiểm tra số lượng audio và hình ảnh có khớp không
            if (imageVersion === "v1") {
                if (durations.length !== allImagesVer1.length) {

                    alert("Số lượng ảnh không khớp với số lượng âm thanh");
                    return;
                }
            }
            else {
                if (durations.length !== allImages.length) {

                    alert("Số lượng ảnh không khớp với số lượng âm thanh");
                    return;
                }
            }

            const formData = new FormData();

            try {
                if (imageVersion === "v1") {
                    if (!allImagesVer1) return;
                    // Convert từng ảnh sang File và append vào formData
                    for (let i = 0; i < allImagesVer1.length; i++) {
                        const imgUrl = allImagesVer1[i];
                        const res = await fetch(imgUrl); // fetch base64 hoặc blob url
                        const blob = await res.blob();
                        const file = new File([blob], `image${i}.jpg`, { type: blob.type });

                        formData.append("images", file); // name 'images' phải trùng với multer
                    }
                }
                else {
                    if (!allImages) return;
                    // Convert từng ảnh sang File và append vào formData
                    for (let i = 0; i < allImages.length; i++) {
                        const imgUrl = allImages[i];
                        const res = await fetch(imgUrl); // fetch base64 hoặc blob url
                        const blob = await res.blob();
                        const file = new File([blob], `image${i}.jpg`, { type: blob.type });

                        formData.append("images", file); // name 'images' phải trùng với multer
                    }
                }


                formData.append("scripts", JSON.stringify(scripts));
                formData.append("durations", JSON.stringify(durations));

                // Nếu mergeAudio là base64 hoặc blob url thì cũng phải fetch rồi append file
                if (mergeAudio) {
                    let res;
                    if (selectedAudioType === 'original') {
                        res = await fetch(mergeAudio);
                    }
                    else {
                        if (!mergedAudioUrlMusic) {
                            return;
                        }
                        res = await fetch(mergedAudioUrlMusic);
                    }
                    const audioBlob = await res.blob();
                    const audioFile = new File([audioBlob], "audio.mp3", { type: audioBlob.type });

                    formData.append("audio", audioFile);
                }
                else {
                    return;
                }

                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/create-video`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        responseType: 'blob',
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                    }
                );

                console.log(response);  // Kiểm tra dữ liệu trả về từ server
                const videoBlob = new Blob([response.data], { type: "video/mp4" });  // Kiểm tra xem videoBlob có hợp lệ không
                if (videoBlob instanceof Blob) {
                    console.log('Blob is valid', videoBlob);
                    const videoUrl = URL.createObjectURL(videoBlob);  // Tạo URL từ blob

                    // // Tạo liên kết để tải video
                    // const a = document.createElement('a');
                    // a.href = videoUrl;
                    // a.download = 'output_video.mp4';  // Tên file khi tải về
                    // document.body.appendChild(a);
                    // a.click();
                    // a.remove();
                    // window.URL.revokeObjectURL(videoUrl);  // Giải phóng bộ nhớ

                    setOutputVideo(videoUrl);
                    console.log('Video URL:', videoUrl);  // Kiểm tra URL video
                } else {
                    console.error('Received data is not a valid blob');
                }
            } catch (error) {
                console.error("Lỗi khi tạo video:", error);
                alert("Đã xảy ra lỗi khi tạo video!");
            } finally {
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Lỗi khi xử lý thời gian âm thanh:", error);
            alert("Đã xảy ra lỗi khi xử lý thời gian âm thanh!");
            setIsProcessing(false);
        }
    };

    return (
        <div className="text-black">
            <h1 className="text-2xl font-bold text-center mb-3 text-gray-800">🖼️ Image Viewer</h1>
            <div className="flex flex-col md:flex-row">
                <div>
                    <h3 className="text-xl font-bold">Tiêu đề video</h3>
                    <div className="flex flex-col md:flex-row border-b-2 pb-3 md:pb-3 border-gray-600">

                        {script &&
                            <div className="border-1 border-gray-300 p-2 rounded-md text-sm mt-2 md:mt-4">
                                {script}
                            </div>
                        }
                    </div>

                    <h3 className="text-xl font-bold mt-3">🎧 Audio Preview:</h3>

                    {/* Chọn loại audio */}
                    <div className="flex gap-2 mt-2">
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
                    {(mergeAudio || mergedAudioUrlMusic) &&
                        <audio
                            className="mt-3"
                            controls
                            src={selectedAudioType === "withMusic" && mergedAudioUrlMusic
                                ? mergedAudioUrlMusic
                                : (mergeAudio ? mergeAudio : "")}
                        />}

                    <div className="mt-3 border-t-2 pt-4">
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
                        {imageVersion === 'v1' ? (
                            <>
                                {allImagesVer1 &&
                                    <>
                                        <h2 className="text-lg font-bold text-green-700 mb-2">🎬 Ảnh đã chọn để làm video: ({allImagesVer1.length})</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {allImagesVer1.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt={`selected-${i}`}
                                                    className="w-full h-full object-cover rounded-md border border-green-200"
                                                />
                                            ))}
                                        </div>
                                    </>}
                            </>) : (
                            <>
                                {allImages &&
                                    <>
                                        <h2 className="text-lg font-bold text-green-700 mb-2">🎬 Ảnh đã chọn để làm video: ({allImages.length})</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {allImages.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt={`selected-${i}`}
                                                    className="w-full h-full object-cover rounded-md border border-green-200"
                                                />
                                            ))}
                                        </div>
                                    </>
                                }
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-4 md:mt-0 text-black w-full md:w-[360px] md:ml-5">
                    <div className="flex justify-between items-center w-full md:w-[360px]">

                        <h3 className="text-xl font-bold">Video đã tạo</h3>
                        <div className="text-black mt-0">
                            {isProcessing ? (
                                <button disabled className=" bg-gray-300 p-3 pt-1 pb-1 text-gray-400 rounded">Đang xử lý...</button>
                            ) : (
                                <button onClick={handleCreateVideo} className=" bg-blue-500 text-white p-3 pt-1 pb-1 rounded cursor-pointer">Tạo video</button>
                            )}
                        </div>
                    </div>
                    {outputVideo !== "" && (
                        <div className="mt-2">
                            <video className="rounded-md w-[360px]" width="100%" controls>
                                <source src={outputVideo} type="video/mp4" />
                                Trình duyệt của bạn không hỗ trợ video.
                            </video>
                            <div className="justify-center flex">
                                <a
                                    href={outputVideo}
                                    download="output_video.mp4"
                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-1 rounded"
                                >
                                    ⬇️ Tải xuống
                                </a>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
