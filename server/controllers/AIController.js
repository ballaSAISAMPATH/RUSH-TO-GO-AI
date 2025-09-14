const { ChatGroq } = require("@langchain/groq");
const { HumanMessage } = require("@langchain/core/messages");
const dotenv = require("dotenv");
dotenv.config();
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

const AIController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Pass the actual user message
    const response = await model.invoke([new HumanMessage(message)]);

    return res.status(200).json({
      success: true,
      message: response.content,
    });
  } catch (error) {
    console.error("AIController Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process the message. Please try again.",
    });
  }
};

module.exports = { AIController };
