const { textToSpeech } = require('../../services/ttsService');

const synthesizeSpeech = async (req, res) => {
    try {
        const { text, vcn, speed, volume, pitch, aue, auf, bgs, tte } = req.body;

        const audioBuffer = await textToSpeech({ text, vcn, speed, volume, pitch, aue, auf, bgs, tte });

        // Set type audio và gửi lại dữ liệu
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioBuffer);
    } catch (error) {
        console.error('Error during text to speech:', error);
        res.status(500).send('Error processing text to speech');
    }
};

module.exports = { synthesizeSpeech };
