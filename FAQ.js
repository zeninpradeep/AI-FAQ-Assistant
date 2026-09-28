const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },

        answer: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FAQ", faqSchema);