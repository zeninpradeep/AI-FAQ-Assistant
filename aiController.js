const { GoogleGenAI } = require("@google/genai");
const FAQ = require("../models/FAQ");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const askAI = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        // Search FAQ database
        const faq = await FAQ.findOne({
            question: {
                $regex: question,
                $options: "i"
            }
        });

        // If FAQ found
        if (faq) {
            return res.json({
                question,
                answer: faq.answer,
                source: "FAQ Database"
            });
        }

        // If FAQ not found, ask Gemini
        const response = await ai.models.generateContent({
           model: "gemini-3.5-flash-lite",
            contents: question
        });

        res.json({
            question,
            answer: response.text,
            source: "Google Gemini AI"
        });

    } catch (error) {
        console.error("AI Error:", error.message);

        res.status(500).json({
            message: "AI response failed",
            error: error.message
        });
    }
};

module.exports = {
    askAI
};