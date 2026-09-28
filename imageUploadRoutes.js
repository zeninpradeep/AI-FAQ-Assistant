const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadPath = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

console.log("Upload folder:", uploadPath);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);

        const filename =
            Date.now() + "-" +
            Math.round(Math.random() * 1000000) +
            extension;

        cb(null, filename);
    }
});

const upload = multer({
    storage: storage
});

router.post(
    "/upload",
    upload.single("image"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image"
            });
        }

        res.status(200).json({
            message: "Image uploaded successfully",
            filename: req.file.filename,
            originalName: req.file.originalname,
            imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
        });
    }
);

module.exports = router;