const FAQ = require("../models/FAQ");

// Create FAQ
const createFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        const faq = await FAQ.create({
            question,
            answer,
            category,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "FAQ created successfully",
            faq
        });
    } catch (error) {
        res.status(500).json({
            message: "FAQ creation failed",
            error: error.message
        });
    }
};

// Get all FAQs
const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().populate(
            "createdBy",
            "name email role"
        );

        res.json({
            count: faqs.length,
            faqs
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch FAQs",
            error: error.message
        });
    }
};

module.exports = {
    createFAQ,
    getFAQs
};