const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: "51a1f39a502545d8a5224323c316457e", // Using the key found in .env
    baseURL: "https://api.aimlapi.com/v1",
});

async function listAllAIMLModels() {
    try {
        console.log("Fetching AIML models...");
        const models = await openai.models.list();
        console.log("All Models:");
        models.data.forEach(m => {
            if (m.id.toLowerCase().includes("gemini")) {
                console.log(`- ${m.id}`);
            }
        });
        if (models.data.length > 0 && !models.data.some(m => m.id.toLowerCase().includes("gemini"))) {
            console.log("No Gemini models found in the first batch.");
            console.log("First 10 models:", models.data.slice(0, 10).map(m => m.id));
        }
    } catch (error) {
        console.error("AIML Error:", error.message);
    }
}

listAllAIMLModels();
