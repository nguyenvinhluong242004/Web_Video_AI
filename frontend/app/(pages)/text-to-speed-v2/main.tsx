"use client";
import React, { useState } from "react";
import axios from "axios";

interface MainProps {
    script: string | null;
    setScript: React.Dispatch<React.SetStateAction<string | null>>;
    audio: string | null;
    setAudio: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Main({ script, setScript, audio, setAudio }: MainProps) {
    const [text, setText] = useState(script || "");
    const [voice, setVoice] = useState("vi-VN-HoaiMyNeural (vi-VN, Female)");
    const [rate, setRate] = useState(0);
    const [num_lines, setNumLines] = useState(2);
    const [pitch, setPitch] = useState(0);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(audio);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ping`);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/tts-v2`,
                {
                    text,
                    voice,
                    rate,
                    pitch,
                    num_lines
                }
            );

            console.log("Response:", response);
            const { audioUrl } = response.data;
            console.log("Audio URL:", audioUrl);
            setAudioUrl(audioUrl);
            setAudio(audioUrl);
        } catch (error) {
            console.error("Error during API call:", error);
        }
        setLoading(false);
    };

    const setTextConfig = (text: string) => {
        setText(text);
        setScript(text);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-center text-gray-800">🗣️ Text to Speech</h1>
            <div className="mt-2 mx-auto p-0 rounded-xl text-black flex gap-5">
                <div className="w-full max-w-xl">

                    <div className="space-y-4">
                        <label className="block">
                            <span className="font-medium">Text</span>
                            <textarea
                                value={text}
                                onChange={(e) => setTextConfig(e.target.value)}
                                placeholder="Nhập văn bản"
                                rows={12}
                                className="w-[500px] mt-1 block rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </label>

                        <label className="block w-full">
                            <span className="font-medium">Voice</span>
                            <select
                                value={voice}
                                onChange={(e) => setVoice(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="af-ZA-AdriNeural (af-ZA, Female)">Afrikaans (South Africa) - Female</option>
                                <option value="af-ZA-WillemNeural (af-ZA, Male)">Afrikaans (South Africa) - Male</option>
                                <option value="sq-AL-AnilaNeural (sq-AL, Female)">Albanian (Albania) - Female</option>
                                <option value="sq-AL-IlirNeural (sq-AL, Male)">Albanian (Albania) - Male</option>
                                <option value="am-ET-AmehaNeural (am-ET, Male)">Amharic (Ethiopia) - Male</option>
                                <option value="am-ET-MekdesNeural (am-ET, Female)">Amharic (Ethiopia) - Female</option>
                                <option value="ar-DZ-AminaNeural (ar-DZ, Female)">Arabic (Algeria) - Female</option>
                                <option value="ar-DZ-IsmaelNeural (ar-DZ, Male)">Arabic (Algeria) - Male</option>
                                <option value="ar-BH-AliNeural (ar-BH, Male)">Arabic (Bahrain) - Male</option>
                                <option value="ar-BH-LailaNeural (ar-BH, Female)">Arabic (Bahrain) - Female</option>
                                <option value="ar-EG-SalmaNeural (ar-EG, Female)">Arabic (Egypt) - Female</option>
                                <option value="ar-EG-ShakirNeural (ar-EG, Male)">Arabic (Egypt) - Male</option>
                                <option value="ar-IQ-BasselNeural (ar-IQ, Male)">Arabic (Iraq) - Male</option>
                                <option value="ar-IQ-RanaNeural (ar-IQ, Female)">Arabic (Iraq) - Female</option>
                                <option value="ar-JO-SanaNeural (ar-JO, Female)">Arabic (Jordan) - Female</option>
                                <option value="ar-JO-TaimNeural (ar-JO, Male)">Arabic (Jordan) - Male</option>
                                <option value="ar-KW-FahedNeural (ar-KW, Male)">Arabic (Kuwait) - Male</option>
                                <option value="ar-KW-NouraNeural (ar-KW, Female)">Arabic (Kuwait) - Female</option>
                                <option value="ar-LB-LaylaNeural (ar-LB, Female)">Arabic (Lebanon) - Female</option>
                                <option value="ar-LB-RamiNeural (ar-LB, Male)">Arabic (Lebanon) - Male</option>
                                <option value="ar-LY-ImanNeural (ar-LY, Female)">Arabic (Libya) - Female</option>
                                <option value="ar-LY-OmarNeural (ar-LY, Male)">Arabic (Libya) - Male</option>
                                <option value="ar-MA-JamalNeural (ar-MA, Male)">Arabic (Morocco) - Male</option>
                                <option value="ar-MA-MounaNeural (ar-MA, Female)">Arabic (Morocco) - Female</option>
                                <option value="ar-OM-AbdullahNeural (ar-OM, Male)">Arabic (Oman) - Male</option>
                                <option value="ar-OM-AyshaNeural (ar-OM, Female)">Arabic (Oman) - Female</option>
                                <option value="ar-QA-AmalNeural (ar-QA, Female)">Arabic (Qatar) - Female</option>
                                <option value="ar-QA-MoazNeural (ar-QA, Male)">Arabic (Qatar) - Male</option>
                                <option value="ar-SA-HamedNeural (ar-SA, Male)">Arabic (Saudi Arabia) - Male</option>
                                <option value="ar-SA-ZariyahNeural (ar-SA, Female)">Arabic (Saudi Arabia) - Female</option>
                                <option value="ar-SY-AmanyNeural (ar-SY, Female)">Arabic (Syria) - Female</option>
                                <option value="ar-SY-LaithNeural (ar-SY, Male)">Arabic (Syria) - Male</option>
                                <option value="ar-TN-HediNeural (ar-TN, Male)">Arabic (Tunisia) - Male</option>
                                <option value="ar-TN-ReemNeural (ar-TN, Female)">Arabic (Tunisia) - Female</option>
                                <option value="ar-AE-FatimaNeural (ar-AE, Female)">Arabic (United Arab Emirates) - Female</option>
                                <option value="ar-AE-HamdanNeural (ar-AE, Male)">Arabic (United Arab Emirates) - Male</option>
                                <option value="ar-YE-MaryamNeural (ar-YE, Female)">Arabic (Yemen) - Female</option>
                                <option value="ar-YE-SalehNeural (ar-YE, Male)">Arabic (Yemen) - Male</option>
                                <option value="az-AZ-BabekNeural (az-AZ, Male)">Azerbaijani (Azerbaijan) - Male</option>
                                <option value="az-AZ-BanuNeural (az-AZ, Female)">Azerbaijani (Azerbaijan) - Female</option>
                                <option value="bn-BD-NabanitaNeural (bn-BD, Female)">Bangla (Bangladesh) - Female</option>
                                <option value="bn-BD-PradeepNeural (bn-BD, Male)">Bangla (Bangladesh) - Male</option>
                                <option value="bn-IN-BashkarNeural (bn-IN, Male)">Bangla (India) - Male</option>
                                <option value="bn-IN-TanishaaNeural (bn-IN, Female)">Bengali (India) - Female</option>
                                <option value="bs-BA-VesnaNeural (bs-BA, Female)">Bosnian (Bosnia and Herzegovina) - Female</option>
                                <option value="bs-BA-GoranNeural (bs-BA, Male)">Bosnian (Bosnia) - Male</option>
                                <option value="bg-BG-BorislavNeural (bg-BG, Male)">Bulgarian (Bulgaria) - Male</option>
                                <option value="bg-BG-KalinaNeural (bg-BG, Female)">Bulgarian (Bulgaria) - Female</option>
                                <option value="my-MM-NilarNeural (my-MM, Female)">Burmese (Myanmar) - Female</option>
                                <option value="my-MM-ThihaNeural (my-MM, Male)">Burmese (Myanmar) - Male</option>
                                <option value="ca-ES-EnricNeural (ca-ES, Male)">Catalan - Male</option>
                                <option value="ca-ES-JoanaNeural (ca-ES, Female)">Catalan - Female</option>
                                <option value="zh-HK-HiuGaaiNeural (zh-HK, Female)">Chinese (Cantonese Traditional) - Female</option>
                                <option value="zh-HK-HiuMaanNeural (zh-HK, Female)">Chinese (Hong Kong SAR) - Female</option>
                                <option value="zh-HK-WanLungNeural (zh-HK, Male)">Chinese (Hong Kong SAR) - Male</option>
                                <option value="zh-CN-XiaoxiaoNeural (zh-CN, Female)">Chinese (Mainland) - Female</option>
                                <option value="zh-CN-XiaoyiNeural (zh-CN, Female)">Chinese (Mainland) - Female</option>
                                <option value="zh-CN-YunjianNeural (zh-CN, Male)">Chinese (Mainland) - Male</option>
                                <option value="zh-CN-YunxiNeural (zh-CN, Male)">Chinese (Mainland) - Male</option>
                                <option value="zh-CN-YunxiaNeural (zh-CN, Male)">Chinese (Mainland) - Male</option>
                                <option value="zh-CN-YunyangNeural (zh-CN, Male)">Chinese (Mainland) - Male</option>
                                <option value="zh-CN-liaoning-XiaobeiNeural (zh-CN-liaoning, Female)">Chinese (Northeastern Mandarin) - Female</option>
                                <option value="zh-TW-HsiaoChenNeural (zh-TW, Female)">Chinese (Taiwan) - Female</option>
                                <option value="zh-TW-YunJheNeural (zh-TW, Male)">Chinese (Taiwan) - Male</option>
                                <option value="zh-TW-HsiaoYuNeural (zh-TW, Female)">Chinese (Taiwanese Mandarin) - Female</option>
                                <option value="zh-CN-shaanxi-XiaoniNeural (zh-CN-shaanxi, Female)">Chinese (Zhongyuan Mandarin Shaanxi) - Female</option>
                                <option value="hr-HR-GabrijelaNeural (hr-HR, Female)">Croatian (Croatia) - Female</option>
                                <option value="hr-HR-SreckoNeural (hr-HR, Male)">Croatian (Croatia) - Male</option>
                                <option value="cs-CZ-AntoninNeural (cs-CZ, Male)">Czech (Czech) - Male</option>
                                <option value="cs-CZ-VlastaNeural (cs-CZ, Female)">Czech (Czech) - Female</option>
                                <option value="da-DK-ChristelNeural (da-DK, Female)">Danish (Denmark) - Female</option>
                                <option value="da-DK-JeppeNeural (da-DK, Male)">Danish (Denmark) - Male</option>
                                <option value="nl-BE-ArnaudNeural (nl-BE, Male)">Dutch (Belgium) - Male</option>
                                <option value="nl-BE-DenaNeural (nl-BE, Female)">Dutch (Belgium) - Female</option>
                                <option value="nl-NL-ColetteNeural (nl-NL, Female)">Dutch (Netherlands) - Female</option>
                                <option value="nl-NL-FennaNeural (nl-NL, Female)">Dutch (Netherlands) - Female</option>
                                <option value="nl-NL-MaartenNeural (nl-NL, Male)">Dutch (Netherlands) - Male</option>
                                <option value="en-AU-NatashaNeural (en-AU, Female)">English (Australia) - Female</option>
                                <option value="en-AU-WilliamNeural (en-AU, Male)">English (Australia) - Male</option>
                                <option value="en-CA-ClaraNeural (en-CA, Female)">English (Canada) - Female</option>
                                <option value="en-CA-LiamNeural (en-CA, Male)">English (Canada) - Male</option>
                                <option value="en-HK-YanNeural (en-HK, Female)">English (Hong Kong SAR) - Female</option>
                                <option value="en-HK-SamNeural (en-HK, Male)">English (Hongkong) - Male</option>
                                <option value="en-IN-NeerjaExpressiveNeural (en-IN, Female)">English (India) (Preview) - Female</option>
                                <option value="en-IN-NeerjaNeural (en-IN, Female)">English (India) - Female</option>
                                <option value="en-IN-PrabhatNeural (en-IN, Male)">English (India) - Male</option>
                                <option value="en-IE-ConnorNeural (en-IE, Male)">English (Ireland) - Male</option>
                                <option value="en-IE-EmilyNeural (en-IE, Female)">English (Ireland) - Female</option>
                                <option value="en-KE-AsiliaNeural (en-KE, Female)">English (Kenya) - Female</option>
                                <option value="en-KE-ChilembaNeural (en-KE, Male)">English (Kenya) - Male</option>
                                <option value="en-NZ-MitchellNeural (en-NZ, Male)">English (New Zealand) - Male</option>
                                <option value="en-NZ-MollyNeural (en-NZ, Female)">English (New Zealand) - Female</option>
                                <option value="en-NG-AbeoNeural (en-NG, Male)">English (Nigeria) - Male</option>
                                <option value="en-NG-EzinneNeural (en-NG, Female)">English (Nigeria) - Female</option>
                                <option value="en-PH-JamesNeural (en-PH, Male)">English (Philippines) - Male</option>
                                <option value="en-PH-RosaNeural (en-PH, Female)">English (Philippines) - Female</option>
                                <option value="en-US-AvaNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-AndrewNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-US-EmmaNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-BrianNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-SG-LunaNeural (en-SG, Female)">English (Singapore) - Female</option>
                                <option value="en-SG-WayneNeural (en-SG, Male)">English (Singapore) - Male</option>
                                <option value="en-ZA-LeahNeural (en-ZA, Female)">English (South Africa) - Female</option>
                                <option value="en-ZA-LukeNeural (en-ZA, Male)">English (South Africa) - Male</option>
                                <option value="en-TZ-ElimuNeural (en-TZ, Male)">English (Tanzania) - Male</option>
                                <option value="en-TZ-ImaniNeural (en-TZ, Female)">English (Tanzania) - Female</option>
                                <option value="en-GB-LibbyNeural (en-GB, Female)">English (United Kingdom) - Female</option>
                                <option value="en-GB-MaisieNeural (en-GB, Female)">English (United Kingdom) - Female</option>
                                <option value="en-GB-RyanNeural (en-GB, Male)">English (United Kingdom) - Male</option>
                                <option value="en-GB-SoniaNeural (en-GB, Female)">English (United Kingdom) - Female</option>
                                <option value="en-GB-ThomasNeural (en-GB, Male)">English (United Kingdom) - Male</option>
                                <option value="en-US-AnaNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-AndrewMultilingualNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-US-AriaNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-AvaMultilingualNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-BrianMultilingualNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-US-ChristopherNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-US-EmmaMultilingualNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-EricNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-US-GuyNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-US-JennyNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-MichelleNeural (en-US, Female)">English (United States) - Female</option>
                                <option value="en-US-RogerNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="en-US-SteffanNeural (en-US, Male)">English (United States) - Male</option>
                                <option value="et-EE-AnuNeural (et-EE, Female)">Estonian (Estonia) - Female</option>
                                <option value="et-EE-KertNeural (et-EE, Male)">Estonian (Estonia) - Male</option>
                                <option value="fil-PH-AngeloNeural (fil-PH, Male)">Filipino (Philippines) - Male</option>
                                <option value="fil-PH-BlessicaNeural (fil-PH, Female)">Filipino (Philippines) - Female</option>
                                <option value="fi-FI-HarriNeural (fi-FI, Male)">Finnish (Finland) - Male</option>
                                <option value="fi-FI-NooraNeural (fi-FI, Female)">Finnish (Finland) - Female</option>
                                <option value="fr-BE-CharlineNeural (fr-BE, Female)">French (Belgium) - Female</option>
                                <option value="fr-BE-GerardNeural (fr-BE, Male)">French (Belgium) - Male</option>
                                <option value="fr-CA-ThierryNeural (fr-CA, Male)">French (Canada) - Male</option>
                                <option value="fr-CA-AntoineNeural (fr-CA, Male)">French (Canada) - Male</option>
                                <option value="fr-CA-JeanNeural (fr-CA, Male)">French (Canada) - Male</option>
                                <option value="fr-CA-SylvieNeural (fr-CA, Female)">French (Canada) - Female</option>
                                <option value="fr-FR-VivienneMultilingualNeural (fr-FR, Female)">French (France) - Female</option>
                                <option value="fr-FR-RemyMultilingualNeural (fr-FR, Male)">French (France) - Male</option>
                                <option value="fr-FR-DeniseNeural (fr-FR, Female)">French (France) - Female</option>
                                <option value="fr-FR-EloiseNeural (fr-FR, Female)">French (France) - Female</option>
                                <option value="fr-FR-HenriNeural (fr-FR, Male)">French (France) - Male</option>
                                <option value="fr-CH-ArianeNeural (fr-CH, Female)">French (Switzerland) - Female</option>
                                <option value="fr-CH-FabriceNeural (fr-CH, Male)">French (Switzerland) - Male</option>
                                <option value="gl-ES-RoiNeural (gl-ES, Male)">Galician - Male</option>
                                <option value="gl-ES-SabelaNeural (gl-ES, Female)">Galician - Female</option>
                                <option value="ka-GE-EkaNeural (ka-GE, Female)">Georgian (Georgia) - Female</option>
                                <option value="ka-GE-GiorgiNeural (ka-GE, Male)">Georgian (Georgia) - Male</option>
                                <option value="de-AT-IngridNeural (de-AT, Female)">German (Austria) - Female</option>
                                <option value="de-AT-JonasNeural (de-AT, Male)">German (Austria) - Male</option>
                                <option value="de-DE-SeraphinaMultilingualNeural (de-DE, Female)">German (Germany) - Female</option>
                                <option value="de-DE-FlorianMultilingualNeural (de-DE, Male)">German (Germany) - Male</option>
                                <option value="de-DE-AmalaNeural (de-DE, Female)">German (Germany) - Female</option>
                                <option value="de-DE-ConradNeural (de-DE, Male)">German (Germany) - Male</option>
                                <option value="de-DE-KatjaNeural (de-DE, Female)">German (Germany) - Female</option>
                                <option value="de-DE-KillianNeural (de-DE, Male)">German (Germany) - Male</option>
                                <option value="de-CH-JanNeural (de-CH, Male)">German (Switzerland) - Male</option>
                                <option value="de-CH-LeniNeural (de-CH, Female)">German (Switzerland) - Female</option>
                                <option value="el-GR-AthinaNeural (el-GR, Female)">Greek (Greece) - Female</option>
                                <option value="el-GR-NestorasNeural (el-GR, Male)">Greek (Greece) - Male</option>
                                <option value="gu-IN-DhwaniNeural (gu-IN, Female)">Gujarati (India) - Female</option>
                                <option value="gu-IN-NiranjanNeural (gu-IN, Male)">Gujarati (India) - Male</option>
                                <option value="he-IL-AvriNeural (he-IL, Male)">Hebrew (Israel) - Male</option>
                                <option value="he-IL-HilaNeural (he-IL, Female)">Hebrew (Israel) - Female</option>
                                <option value="hi-IN-MadhurNeural (hi-IN, Male)">Hindi (India) - Male</option>
                                <option value="hi-IN-SwaraNeural (hi-IN, Female)">Hindi (India) - Female</option>
                                <option value="hu-HU-NoemiNeural (hu-HU, Female)">Hungarian (Hungary) - Female</option>
                                <option value="hu-HU-TamasNeural (hu-HU, Male)">Hungarian (Hungary) - Male</option>
                                <option value="is-IS-GudrunNeural (is-IS, Female)">Icelandic (Iceland) - Female</option>
                                <option value="is-IS-GunnarNeural (is-IS, Male)">Icelandic (Iceland) - Male</option>
                                <option value="id-ID-ArdiNeural (id-ID, Male)">Indonesian (Indonesia) - Male</option>
                                <option value="id-ID-GadisNeural (id-ID, Female)">Indonesian (Indonesia) - Female</option>
                                <option value="iu-Latn-CA-SiqiniqNeural (iu-Latn-CA, Female)">Inuktitut (Latin, Canada) - Female</option>
                                <option value="iu-Latn-CA-TaqqiqNeural (iu-Latn-CA, Male)">Inuktitut (Latin, Canada) - Male</option>
                                <option value="iu-Cans-CA-SiqiniqNeural (iu-Cans-CA, Female)">Inuktitut (Syllabics, Canada) - Female</option>
                                <option value="iu-Cans-CA-TaqqiqNeural (iu-Cans-CA, Male)">Inuktitut (Syllabics, Canada) - Male</option>
                                <option value="ga-IE-ColmNeural (ga-IE, Male)">Irish (Ireland) - Male</option>
                                <option value="ga-IE-OrlaNeural (ga-IE, Female)">Irish (Ireland) - Female</option>
                                <option value="it-IT-GiuseppeMultilingualNeural (it-IT, Male)">Italian (Italy) - Male</option>
                                <option value="it-IT-DiegoNeural (it-IT, Male)">Italian (Italy) - Male</option>
                                <option value="it-IT-ElsaNeural (it-IT, Female)">Italian (Italy) - Female</option>
                                <option value="it-IT-IsabellaNeural (it-IT, Female)">Italian (Italy) - Female</option>
                                <option value="ja-JP-KeitaNeural (ja-JP, Male)">Japanese (Japan) - Male</option>
                                <option value="ja-JP-NanamiNeural (ja-JP, Female)">Japanese (Japan) - Female</option>
                                <option value="jv-ID-DimasNeural (jv-ID, Male)">Javanese (Indonesia) - Male</option>
                                <option value="jv-ID-SitiNeural (jv-ID, Female)">Javanese (Indonesia) - Female</option>
                                <option value="kn-IN-GaganNeural (kn-IN, Male)">Kannada (India) - Male</option>
                                <option value="kn-IN-SapnaNeural (kn-IN, Female)">Kannada (India) - Female</option>
                                <option value="kk-KZ-AigulNeural (kk-KZ, Female)">Kazakh (Kazakhstan) - Female</option>
                                <option value="kk-KZ-DauletNeural (kk-KZ, Male)">Kazakh (Kazakhstan) - Male</option>
                                <option value="km-KH-PisethNeural (km-KH, Male)">Khmer (Cambodia) - Male</option>
                                <option value="km-KH-SreymomNeural (km-KH, Female)">Khmer (Cambodia) - Female</option>
                                <option value="ko-KR-HyunsuMultilingualNeural (ko-KR, Male)">Korean (Korea) - Male</option>
                                <option value="ko-KR-InJoonNeural (ko-KR, Male)">Korean (Korea) - Male</option>
                                <option value="ko-KR-SunHiNeural (ko-KR, Female)">Korean (Korea) - Female</option>
                                <option value="lo-LA-ChanthavongNeural (lo-LA, Male)">Lao (Laos) - Male</option>
                                <option value="lo-LA-KeomanyNeural (lo-LA, Female)">Lao (Laos) - Female</option>
                                <option value="lv-LV-EveritaNeural (lv-LV, Female)">Latvian (Latvia) - Female</option>
                                <option value="lv-LV-NilsNeural (lv-LV, Male)">Latvian (Latvia) - Male</option>
                                <option value="lt-LT-LeonasNeural (lt-LT, Male)">Lithuanian (Lithuania) - Male</option>
                                <option value="lt-LT-OnaNeural (lt-LT, Female)">Lithuanian (Lithuania) - Female</option>
                                <option value="mk-MK-AleksandarNeural (mk-MK, Male)">Macedonian (North Macedonia) - Male</option>
                                <option value="mk-MK-MarijaNeural (mk-MK, Female)">Macedonian (North Macedonia) - Female</option>
                                <option value="ms-MY-OsmanNeural (ms-MY, Male)">Malay (Malaysia) - Male</option>
                                <option value="ms-MY-YasminNeural (ms-MY, Female)">Malay (Malaysia) - Female</option>
                                <option value="ml-IN-MidhunNeural (ml-IN, Male)">Malayalam (India) - Male</option>
                                <option value="ml-IN-SobhanaNeural (ml-IN, Female)">Malayalam (India) - Female</option>
                                <option value="mt-MT-GraceNeural (mt-MT, Female)">Maltese (Malta) - Female</option>
                                <option value="mt-MT-JosephNeural (mt-MT, Male)">Maltese (Malta) - Male</option>
                                <option value="mr-IN-AarohiNeural (mr-IN, Female)">Marathi (India) - Female</option>
                                <option value="mr-IN-ManoharNeural (mr-IN, Male)">Marathi (India) - Male</option>
                                <option value="mn-MN-BataaNeural (mn-MN, Male)">Mongolian (Mongolia) - Male</option>
                                <option value="mn-MN-YesuiNeural (mn-MN, Female)">Mongolian (Mongolia) - Female</option>
                                <option value="ne-NP-HemkalaNeural (ne-NP, Female)">Nepali (Nepal) - Female</option>
                                <option value="ne-NP-SagarNeural (ne-NP, Male)">Nepali (Nepal) - Male</option>
                                <option value="nb-NO-FinnNeural (nb-NO, Male)">Norwegian (Bokmål Norway) - Male</option>
                                <option value="nb-NO-PernilleNeural (nb-NO, Female)">Norwegian (Bokmål, Norway) - Female</option>
                                <option value="ps-AF-GulNawazNeural (ps-AF, Male)">Pashto (Afghanistan) - Male</option>
                                <option value="ps-AF-LatifaNeural (ps-AF, Female)">Pashto (Afghanistan) - Female</option>
                                <option value="fa-IR-DilaraNeural (fa-IR, Female)">Persian (Iran) - Female</option>
                                <option value="fa-IR-FaridNeural (fa-IR, Male)">Persian (Iran) - Male</option>
                                <option value="pl-PL-MarekNeural (pl-PL, Male)">Polish (Poland) - Male</option>
                                <option value="pl-PL-ZofiaNeural (pl-PL, Female)">Polish (Poland) - Female</option>
                                <option value="pt-BR-ThalitaMultilingualNeural (pt-BR, Female)">Portuguese (Brazil) - Female</option>
                                <option value="pt-BR-AntonioNeural (pt-BR, Male)">Portuguese (Brazil) - Male</option>
                                <option value="pt-BR-FranciscaNeural (pt-BR, Female)">Portuguese (Brazil) - Female</option>
                                <option value="pt-PT-DuarteNeural (pt-PT, Male)">Portuguese (Portugal) - Male</option>
                                <option value="pt-PT-RaquelNeural (pt-PT, Female)">Portuguese (Portugal) - Female</option>
                                <option value="ro-RO-AlinaNeural (ro-RO, Female)">Romanian (Romania) - Female</option>
                                <option value="ro-RO-EmilNeural (ro-RO, Male)">Romanian (Romania) - Male</option>
                                <option value="ru-RU-DmitryNeural (ru-RU, Male)">Russian (Russia) - Male</option>
                                <option value="ru-RU-SvetlanaNeural (ru-RU, Female)">Russian (Russia) - Female</option>
                                <option value="sr-RS-NicholasNeural (sr-RS, Male)">Serbian (Serbia) - Male</option>
                                <option value="sr-RS-SophieNeural (sr-RS, Female)">Serbian (Serbia) - Female</option>
                                <option value="si-LK-SameeraNeural (si-LK, Male)">Sinhala (Sri Lanka) - Male</option>
                                <option value="si-LK-ThiliniNeural (si-LK, Female)">Sinhala (Sri Lanka) - Female</option>
                                <option value="sk-SK-LukasNeural (sk-SK, Male)">Slovak (Slovakia) - Male</option>
                                <option value="sk-SK-ViktoriaNeural (sk-SK, Female)">Slovak (Slovakia) - Female</option>
                                <option value="sl-SI-PetraNeural (sl-SI, Female)">Slovenian (Slovenia) - Female</option>
                                <option value="sl-SI-RokNeural (sl-SI, Male)">Slovenian (Slovenia) - Male</option>
                                <option value="so-SO-MuuseNeural (so-SO, Male)">Somali (Somalia) - Male</option>
                                <option value="so-SO-UbaxNeural (so-SO, Female)">Somali (Somalia) - Female</option>
                                <option value="es-AR-ElenaNeural (es-AR, Female)">Spanish (Argentina) - Female</option>
                                <option value="es-AR-TomasNeural (es-AR, Male)">Spanish (Argentina) - Male</option>
                                <option value="es-BO-MarceloNeural (es-BO, Male)">Spanish (Bolivia) - Male</option>
                                <option value="es-BO-SofiaNeural (es-BO, Female)">Spanish (Bolivia) - Female</option>
                                <option value="es-CL-CatalinaNeural (es-CL, Female)">Spanish (Chile) - Female</option>
                                <option value="es-CL-LorenzoNeural (es-CL, Male)">Spanish (Chile) - Male</option>
                                <option value="es-CO-GonzaloNeural (es-CO, Male)">Spanish (Colombia) - Male</option>
                                <option value="es-CO-SalomeNeural (es-CO, Female)">Spanish (Colombia) - Female</option>
                                <option value="es-ES-XimenaNeural (es-ES, Female)">Spanish (Colombia) - Female</option>
                                <option value="es-CR-JuanNeural (es-CR, Male)">Spanish (Costa Rica) - Male</option>
                                <option value="es-CR-MariaNeural (es-CR, Female)">Spanish (Costa Rica) - Female</option>
                                <option value="es-CU-BelkysNeural (es-CU, Female)">Spanish (Cuba) - Female</option>
                                <option value="es-CU-ManuelNeural (es-CU, Male)">Spanish (Cuba) - Male</option>
                                <option value="es-DO-EmilioNeural (es-DO, Male)">Spanish (Dominican Republic) - Male</option>
                                <option value="es-DO-RamonaNeural (es-DO, Female)">Spanish (Dominican Republic) - Female</option>
                                <option value="es-EC-AndreaNeural (es-EC, Female)">Spanish (Ecuador) - Female</option>
                                <option value="es-EC-LuisNeural (es-EC, Male)">Spanish (Ecuador) - Male</option>
                                <option value="es-SV-LorenaNeural (es-SV, Female)">Spanish (El Salvador) - Female</option>
                                <option value="es-SV-RodrigoNeural (es-SV, Male)">Spanish (El Salvador) - Male</option>
                                <option value="es-GQ-JavierNeural (es-GQ, Male)">Spanish (Equatorial Guinea) - Male</option>
                                <option value="es-GQ-TeresaNeural (es-GQ, Female)">Spanish (Equatorial Guinea) - Female</option>
                                <option value="es-GT-AndresNeural (es-GT, Male)">Spanish (Guatemala) - Male</option>
                                <option value="es-GT-MartaNeural (es-GT, Female)">Spanish (Guatemala) - Female</option>
                                <option value="es-HN-CarlosNeural (es-HN, Male)">Spanish (Honduras) - Male</option>
                                <option value="es-HN-KarlaNeural (es-HN, Female)">Spanish (Honduras) - Female</option>
                                <option value="es-MX-DaliaNeural (es-MX, Female)">Spanish (Mexico) - Female</option>
                                <option value="es-MX-JorgeNeural (es-MX, Male)">Spanish (Mexico) - Male</option>
                                <option value="es-NI-FedericoNeural (es-NI, Male)">Spanish (Nicaragua) - Male</option>
                                <option value="es-NI-YolandaNeural (es-NI, Female)">Spanish (Nicaragua) - Female</option>
                                <option value="es-PA-MargaritaNeural (es-PA, Female)">Spanish (Panama) - Female</option>
                                <option value="es-PA-RobertoNeural (es-PA, Male)">Spanish (Panama) - Male</option>
                                <option value="es-PY-MarioNeural (es-PY, Male)">Spanish (Paraguay) - Male</option>
                                <option value="es-PY-TaniaNeural (es-PY, Female)">Spanish (Paraguay) - Female</option>
                                <option value="es-PE-AlexNeural (es-PE, Male)">Spanish (Peru) - Male</option>
                                <option value="es-PE-CamilaNeural (es-PE, Female)">Spanish (Peru) - Female</option>
                                <option value="es-PR-KarinaNeural (es-PR, Female)">Spanish (Puerto Rico) - Female</option>
                                <option value="es-PR-VictorNeural (es-PR, Male)">Spanish (Puerto Rico) - Male</option>
                                <option value="es-ES-AlvaroNeural (es-ES, Male)">Spanish (Spain) - Male</option>
                                <option value="es-ES-ElviraNeural (es-ES, Female)">Spanish (Spain) - Female</option>
                                <option value="es-US-AlonsoNeural (es-US, Male)">Spanish (United States) - Male</option>
                                <option value="es-US-PalomaNeural (es-US, Female)">Spanish (United States) - Female</option>
                                <option value="es-UY-MateoNeural (es-UY, Male)">Spanish (Uruguay) - Male</option>
                                <option value="es-UY-ValentinaNeural (es-UY, Female)">Spanish (Uruguay) - Female</option>
                                <option value="es-VE-PaolaNeural (es-VE, Female)">Spanish (Venezuela) - Female</option>
                                <option value="es-VE-SebastianNeural (es-VE, Male)">Spanish (Venezuela) - Male</option>
                                <option value="su-ID-JajangNeural (su-ID, Male)">Sundanese (Indonesia) - Male</option>
                                <option value="su-ID-TutiNeural (su-ID, Female)">Sundanese (Indonesia) - Female</option>
                                <option value="sw-KE-RafikiNeural (sw-KE, Male)">Swahili (Kenya) - Male</option>
                                <option value="sw-KE-ZuriNeural (sw-KE, Female)">Swahili (Kenya) - Female</option>
                                <option value="sw-TZ-DaudiNeural (sw-TZ, Male)">Swahili (Tanzania) - Male</option>
                                <option value="sw-TZ-RehemaNeural (sw-TZ, Female)">Swahili (Tanzania) - Female</option>
                                <option value="sv-SE-MattiasNeural (sv-SE, Male)">Swedish (Sweden) - Male</option>
                                <option value="sv-SE-SofieNeural (sv-SE, Female)">Swedish (Sweden) - Female</option>
                                <option value="ta-IN-PallaviNeural (ta-IN, Female)">Tamil (India) - Female</option>
                                <option value="ta-IN-ValluvarNeural (ta-IN, Male)">Tamil (India) - Male</option>
                                <option value="ta-MY-KaniNeural (ta-MY, Female)">Tamil (Malaysia) - Female</option>
                                <option value="ta-MY-SuryaNeural (ta-MY, Male)">Tamil (Malaysia) - Male</option>
                                <option value="ta-SG-AnbuNeural (ta-SG, Male)">Tamil (Singapore) - Male</option>
                                <option value="ta-SG-VenbaNeural (ta-SG, Female)">Tamil (Singapore) - Female</option>
                                <option value="ta-LK-KumarNeural (ta-LK, Male)">Tamil (Sri Lanka) - Male</option>
                                <option value="ta-LK-SaranyaNeural (ta-LK, Female)">Tamil (Sri Lanka) - Female</option>
                                <option value="te-IN-MohanNeural (te-IN, Male)">Telugu (India) - Male</option>
                                <option value="te-IN-ShrutiNeural (te-IN, Female)">Telugu (India) - Female</option>
                                <option value="th-TH-NiwatNeural (th-TH, Male)">Thai (Thailand) - Male</option>
                                <option value="th-TH-PremwadeeNeural (th-TH, Female)">Thai (Thailand) - Female</option>
                                <option value="tr-TR-EmelNeural (tr-TR, Female)">Turkish (Turkey) - Female</option>
                                <option value="tr-TR-AhmetNeural (tr-TR, Male)">Turkish (Türkiye) - Male</option>
                                <option value="uk-UA-OstapNeural (uk-UA, Male)">Ukrainian (Ukraine) - Male</option>
                                <option value="uk-UA-PolinaNeural (uk-UA, Female)">Ukrainian (Ukraine) - Female</option>
                                <option value="ur-IN-GulNeural (ur-IN, Female)">Urdu (India) - Female</option>
                                <option value="ur-IN-SalmanNeural (ur-IN, Male)">Urdu (India) - Male</option>
                                <option value="ur-PK-AsadNeural (ur-PK, Male)">Urdu (Pakistan) - Male</option>
                                <option value="ur-PK-UzmaNeural (ur-PK, Female)">Urdu (Pakistan) - Female</option>
                                <option value="uz-UZ-MadinaNeural (uz-UZ, Female)">Uzbek (Uzbekistan) - Female</option>
                                <option value="uz-UZ-SardorNeural (uz-UZ, Male)">Uzbek (Uzbekistan) - Male</option>
                                <option value="vi-VN-HoaiMyNeural (vi-VN, Female)">Vietnamese (Vietnam) - Female</option>
                                <option value="vi-VN-NamMinhNeural (vi-VN, Male)">Vietnamese (Vietnam) - Male</option>
                                <option value="cy-GB-AledNeural (cy-GB, Male)">Welsh (United Kingdom) - Male</option>
                                <option value="cy-GB-NiaNeural (cy-GB, Female)">Welsh (United Kingdom) - Female</option>
                                <option value="zu-ZA-ThandoNeural (zu-ZA, Female)">Zulu (South Africa) - Female</option>
                                <option value="zu-ZA-ThembaNeural (zu-ZA, Male)">Zulu (South Africa) - Male</option>
                            </select>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <label className="block">
                                <span className="font-medium">Rate</span>
                                <input
                                    type="range"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    min={-50}
                                    max={50}
                                    step={1}
                                    className="mt-1 w-full"
                                />
                                <span className="block text-center">{rate}</span>
                            </label>

                            <label className="block">
                                <span className="font-medium">Pitch</span>
                                <input
                                    type="range"
                                    value={pitch}
                                    onChange={(e) => setPitch(Number(e.target.value))}
                                    min={-50}
                                    max={50}
                                    step={1}
                                    className="mt-1 w-full"
                                />
                                <span className="block text-center">{pitch}</span>
                            </label>

                            <label className="block">
                                <span className="font-medium">SRT Lines</span>
                                <input
                                    type="range"
                                    value={num_lines}
                                    onChange={(e) => setNumLines(Number(e.target.value))}
                                    min={1}
                                    max={5}
                                    step={1}
                                    className="mt-1 w-full"
                                />
                                <span className="block text-center">{num_lines}</span>
                            </label>

                        </div>

                        <div className="pt-0 text-center">
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
                        <div className="text-center">
                            <audio controls src={audioUrl} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}