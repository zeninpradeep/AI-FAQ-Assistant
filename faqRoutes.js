const express = require("express");

const {
    createFAQ,
    getFAQs
} = require("../controllers/faqController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create FAQ
router.post("/", authMiddleware, createFAQ);

// Get all FAQs
router.get("/", getFAQs);

module.exports = router;