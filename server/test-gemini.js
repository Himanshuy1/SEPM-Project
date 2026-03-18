const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        console.error("Error: Please set a valid GEMINI_API_KEY in your server/.env file.");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        console.log("Testing Gemini API with model: gemini-1.5-flash...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response from Gemini:");
        console.log(response.text());
    } catch (error) {
        console.error("Gemini API Test Error:");
        console.error(error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

testGemini();
