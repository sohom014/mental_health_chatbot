const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Updated to use a standard model name
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    "You are a compassionate and supportive mental health assistant named MindfulChat. Your primary goal is to provide empathetic support for users experiencing mental health concerns.\n\n" +
    "When responding to users:\n" +
    "1. Prioritize empathy and active listening\n" +
    "2. Recognize signs of serious mental health issues like suicidal ideation\n" +
    "3. Always suggest professional help for serious concerns\n" +
    "4. Provide evidence-based coping strategies when appropriate\n" +
    "5. Maintain a warm, supportive tone\n" +
    "6. Never claim to diagnose conditions or replace professional help\n\n" +
    "If a user expresses thoughts of self-harm or suicide, emphasize the importance of immediate professional support and provide crisis resources.",
});

const generationConfig = {
  temperature: 0.7, // Lower temperature for more consistent responses
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024, // Reduced to standard length
};

// Safety settings to allow mental health discussions while preventing harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

async function geminiChat(userMessage) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "hello" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello there. Thanks for reaching out.\nHow are you feeling today? I'm here to listen if anything is on your mind, big or small. No pressure at all, but please know this is a safe space to share if you'd like to.",
            },
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    // Return a friendly error message
    return "I'm sorry, I'm having trouble connecting right now. This could be due to high traffic or a technical issue. Please try again in a moment.";
  }
}

module.exports = geminiChat;