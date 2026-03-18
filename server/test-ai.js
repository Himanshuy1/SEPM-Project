const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.AIML_API_KEY,
    baseURL: "https://api.aimlapi.com",
});

async function test() {
    try {
        console.log("Listing models...");
        const models = await openai.models.list();
        console.log("Available models (first 10):");
        console.log(models.data.slice(0, 10).map(m => m.id));

        console.log("\nTesting with baseURL: https://api.aimlapi.com and model: gemma-2-9b-it");
        const response = await openai.chat.completions.create({
            model: "gemma-2-9b-it",
            messages: [
                { role: "user", content: "Hello" },
            ],
            max_tokens: 5,
        });
        console.log("Success!");
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error("Error with https://api.aimlapi.com:");
        console.error(error.message);
        console.error(error.response?.data || error.stack);

        console.log("\nTrying with baseURL: https://api.aimlapi.com/v1");
        const openaiV1 = new OpenAI({
            apiKey: process.env.AIML_API_KEY,
            baseURL: "https://api.aimlapi.com/v1",
        });
        try {
            const responseV1 = await openaiV1.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "user", content: "Hello" },
                ],
                max_tokens: 5,
            });
            console.log("Success with /v1!");
            console.log(JSON.stringify(responseV1, null, 2));
        } catch (errorV1) {
            console.error("Error with https://api.aimlapi.com/v1:");
            console.error(errorV1.message);
        }
    }
}

test();
