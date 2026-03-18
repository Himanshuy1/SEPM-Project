const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found.");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro",
        "gemini-pro",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash-lite-preview-02-05"
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            console.log(`✅ Success with ${modelName}: ${response.text().substring(0, 20)}`);
            return; // Stop if we find one
        } catch (error) {
            console.log(`❌ Failed with ${modelName}: ${error.message}`);
        }
    }
    console.log("No working models found.");
}

testModels();
