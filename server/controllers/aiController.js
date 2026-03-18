const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const officeParser = require("officeparser");

// Initialize Groq client (OpenAI compatible)
const client = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const MODEL_NAME = "llama-3.1-8b-instant";

/**
 * @desc    Summarize text using Google Gemini AI
 * @route   POST /api/ai/summarize
 * @access  Private
 */
const summarizeText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Please provide text to summarize" });
    }

    try {
        const prompt = `Please provide a concise and clear summary of the following educational text, highlighting the key concepts and important points. Make it easy for a student to understand:\n\n${text}`;

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL_NAME,
        });

        const summary = completion.choices[0].message.content;

        res.status(200).json({ summary });
    } catch (error) {
        console.error("Groq API Summarize Error:", error);

        res.status(500).json({
            message: "Error generating summary. Please try again later.",
            error: error.message
        });
    }
};

/**
 * @desc    Extract text from file and summarize using Groq API
 * @route   POST /api/ai/summarize-file
 * @access  Private
 */
const summarizeFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a file to summarize" });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    try {
        let extractedText = "";

        if (fileExtension === ".pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            // pdf-parse might export the function directly or under a property
            const pdfParser = typeof pdf === "function" ? pdf : (pdf.default || pdf);

            if (typeof pdfParser !== "function") {
                console.error("PDF Parser is not a function:", typeof pdfParser);
                throw new Error("PDF parser initialization failed");
            }

            const data = await pdfParser(dataBuffer);
            extractedText = data.text;
        } else if (fileExtension === ".pptx" || fileExtension === ".ppt") {
            // Use promise-based parse if available, otherwise callback
            if (typeof officeParser.parseOfficeAsync === "function") {
                extractedText = await officeParser.parseOfficeAsync(filePath);
            } else {
                extractedText = await new Promise((resolve, reject) => {
                    officeParser.parseOffice(filePath, (data, err) => {
                        if (err) return reject(err);
                        resolve(data);
                    });
                });
            }
        } else {
            // Clean up file if unsupported
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.status(400).json({ message: "Unsupported file type. Please upload a PDF or PPT/PPTX file." });
        }

        // Ensure extractedText is a string
        if (typeof extractedText !== "string") {
            console.log("Extracted text is not a string, converting type:", typeof extractedText);
            extractedText = String(extractedText || "");
        }

        if (!extractedText || extractedText.trim().length === 0) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.status(400).json({ message: "Could not extract text from the file. It might be empty or scanned as an image." });
        }

        // Limit text length to avoid token limits (arbitrary limit for llama-3.1-8b)
        const truncatedText = extractedText.slice(0, 30000);

        const prompt = `Please provide a concise and clear summary of the following educational content extracted from a ${fileExtension.toUpperCase()} file, highlighting the key concepts and important points. Make it easy for a student to understand:\n\n${truncatedText}`;

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODEL_NAME,
        });

        const summary = completion.choices[0].message.content;

        // Clean up uploaded file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.status(200).json({ summary });
    } catch (error) {
        console.error("File Summarize Error:", error);
        // Clean up file on error
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.status(500).json({
            message: "Error processing file for summary. Please try again later.",
            error: error.message
        });
    }
};

/**
 * @desc    Chat with AI for student assistance
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatWithAI = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Please provide conversation history" });
    }

    try {
        const systemMessage = messages.find(msg => msg.role === "system");
        const systemInstruction = systemMessage ? systemMessage.content : "You are a friendly and knowledgeable student assistant chatbot. Answer academic questions, help with study tips, and provide guidance on student life. Keep your responses encouraging and concise.";

        // Filter out existing system messages and construct conversation history
        const filteredMessages = messages.filter(msg => msg.role !== "system");

        const completion = await client.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                ...filteredMessages
            ],
            model: MODEL_NAME,
            max_tokens: 1000,
        });

        const reply = completion.choices[0].message.content;

        res.status(200).json({ reply });
    } catch (error) {
        console.error("Groq API Chat Error:", error);
        res.status(500).json({
            message: "Error communicating with AI. Please try again later.",
            error: error.message
        });
    }
};

module.exports = {
    summarizeText,
    chatWithAI,
    summarizeFile,
};
