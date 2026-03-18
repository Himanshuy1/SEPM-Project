const OpenAI = require("openai");
require("dotenv").config();

async function testGroq() {
    console.log("Testing Groq API integration...");

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
        console.error("❌ GROK_API_KEY not found in .env");
        return;
    }

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.groq.com/openai/v1",
    });

    const modelName = "llama-3.1-8b-instant";

    try {
        console.log(`Using model: ${modelName}`);
        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: "Say 'Groq integration working!'" }],
            model: modelName,
        });

        console.log("✅ Success! Response from Groq:");
        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ Groq API Test Error:");
        console.error(error.message);
    }
}

testGroq();
