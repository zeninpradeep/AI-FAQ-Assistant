const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateImagePrompt = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                message: "Prompt is required"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: `
Convert the following idea into a detailed professional AI image-generation prompt.

User idea:
${prompt}

Include:
- Subject
- Environment
- Lighting
- Camera angle
- Composition
- Colors
- Visual style
- Quality details

Return only the final image prompt.
`
        });

        res.json({
            message: "Image prompt generated successfully",
            prompt: response.text
        });

    } catch (error) {
        console.error("Image Prompt Error:", error.message);

        res.status(500).json({
            message: "Image prompt generation failed",
            error: error.message
        });
    }
};

module.exports = {
    generateImagePrompt
};