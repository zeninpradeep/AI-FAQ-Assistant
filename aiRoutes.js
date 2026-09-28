const express = require("express");

const { askAI } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/ask", askAI);

module.exports = router;