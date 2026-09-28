const express = require("express");

const {
    generateImagePrompt
} = require("../controllers/imageController");

const router = express.Router();

router.post("/generate", generateImagePrompt);

module.exports = router;