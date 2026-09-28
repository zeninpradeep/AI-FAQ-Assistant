import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // =========================
  // IMAGE PROMPT GENERATOR
  // =========================
  const [imageIdea, setImageIdea] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // =========================
  // IMAGE UPLOAD
  // =========================
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // =========================
  // ASK AI
  // =========================
  const askAI = async (voiceQuestion = null) => {
    const currentQuestion =
      typeof voiceQuestion === "string"
        ? voiceQuestion
        : question;

    if (!currentQuestion.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: currentQuestion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI service failed"
        );
      }

      setAnswer(data.answer);

      // Text to Speech
      if (data.answer) {
        const speech =
          new SpeechSynthesisUtterance(data.answer);

        speech.lang = "en-US";

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
      }

    } catch (error) {
      console.error("AI Error:", error);

      setAnswer(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VOICE INPUT
  // =========================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setQuestion(transcript);

      askAI(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.start();
  };

  // =========================
  // GENERATE IMAGE PROMPT
  // =========================
  const generateImagePrompt = async () => {
    if (!imageIdea.trim()) {
      alert("Please enter an image idea.");
      return;
    }

    setImageLoading(true);
    setImagePrompt("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/image/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: imageIdea,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Image prompt generation failed"
        );
      }

      setImagePrompt(data.prompt);

    } catch (error) {
      console.error(
        "Image Prompt Error:",
        error
      );

      setImagePrompt(
        "Unable to generate image prompt. Please try again."
      );

    } finally {
      setImageLoading(false);
    }
  };

  // =========================
  // COPY PROMPT
  // =========================
  const copyPrompt = () => {
    if (!imagePrompt) return;

    navigator.clipboard.writeText(imagePrompt);

    alert("Prompt copied!");
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const uploadImage = async () => {
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();

    // IMPORTANT:
    // Backend multer field name is "image"
    formData.append("image", selectedImage);

    setUploadLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/image-upload/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Image upload failed"
        );
      }

      setUploadedImage(data.imageUrl);

      setAnswer(
        "✅ Image uploaded successfully!"
      );

    } catch (error) {
      console.error(
        "Upload Error:",
        error
      );

      setAnswer(
        "❌ Image upload failed. Please try again."
      );

    } finally {
      setUploadLoading(false);
    }
  };

  // =========================
  // CLEAR
  // =========================
  const clearChat = () => {
    setQuestion("");
    setAnswer("");

    setImageIdea("");
    setImagePrompt("");

    setSelectedImage(null);
    setUploadedImage("");

    window.speechSynthesis.cancel();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="App">

      <div className="container">

        <h1>AI FAQ Assistant</h1>

        {/* =========================
            FAQ SECTION
        ========================= */}

        <div className="input-area">

          <input
            type="text"
            placeholder="Ask your question..."
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askAI();
              }
            }}
          />

          <button
            onClick={() => askAI()}
            disabled={loading}
          >
            {loading
              ? "Thinking..."
              : "Ask AI"}
          </button>

          <button
            onClick={startListening}
            disabled={loading}
          >
            {listening
              ? "🎤 Listening..."
              : "🎤 Speak"}
          </button>

          <button
            onClick={clearChat}
            disabled={loading}
          >
            Clear
          </button>

        </div>

        {/* =========================
            AI ANSWER
        ========================= */}

        <div className="answer-box">

          <h2>Answer:</h2>

          {loading ? (
            <p className="loading">
              AI is thinking...
            </p>
          ) : answer ? (
            <ReactMarkdown>
              {answer}
            </ReactMarkdown>
          ) : (
            <p className="placeholder">
              Your AI answer will appear here...
            </p>
          )}

        </div>

        {/* =========================
            IMAGE PROMPT GENERATOR
        ========================= */}

        <div className="image-generator">

          <h2>
            🎨 AI Image Prompt Generator
          </h2>

          <p>
            Enter your image idea and generate
            a professional AI image prompt.
          </p>

          <textarea
            placeholder="Example: A futuristic city at night..."
            value={imageIdea}
            onChange={(e) =>
              setImageIdea(e.target.value)
            }
          />

          <button
            onClick={generateImagePrompt}
            disabled={imageLoading}
          >
            {imageLoading
              ? "Generating..."
              : "✨ Generate Image Prompt"}
          </button>

          {imagePrompt && (
            <div className="generated-prompt">

              <h3>Generated Prompt</h3>

              <p>{imagePrompt}</p>

              <button onClick={copyPrompt}>
                📋 Copy Prompt
              </button>

            </div>
          )}

        </div>

        {/* =========================
            IMAGE UPLOAD
        ========================= */}

        <div className="image-upload">

          <h2>📤 Upload Image</h2>

          <p>
            Select an image and upload it
            to the AI FAQ Assistant.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setSelectedImage(
                e.target.files[0]
              );
            }}
          />

          {selectedImage && (
            <p>
              Selected:{" "}
              <strong>
                {selectedImage.name}
              </strong>
            </p>
          )}

          <button
            onClick={uploadImage}
            disabled={
              uploadLoading ||
              !selectedImage
            }
          >
            {uploadLoading
              ? "Uploading..."
              : "📤 Upload Image"}
          </button>

          {uploadedImage && (
            <div className="uploaded-image">

              <h3>Uploaded Image</h3>

              <img
                src={uploadedImage}
                alt="Uploaded"
              />

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default App;