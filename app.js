
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const imageUploadRoutes = require("./routes/imageUploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const faqRoutes = require("./routes/faqRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/users", (req, res) => {
    res.json({
        message: "AI FAQ Assistant API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/image-upload", imageUploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/faqs", faqRoutes);
module.exports = app;