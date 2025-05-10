const { generateScript } = require ('../../services/scriptService');

const synthesizeScript = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Thiếu tiêu đề (prompt).' });
  }

  try {
    const result = await generateScript(prompt);
    res.json(result);
  } catch (error) {
    console.error('Lỗi controller:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo kịch bản.' });
  }
};

module.exports = { synthesizeScript };
