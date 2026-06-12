require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const DEFAULT_PROMPT_PATH = path.join(__dirname, 'prompts', 'summary-prompt.txt');

function loadSummaryPrompt() {
    const promptPath = process.env.SUMMARY_PROMPT_PATH || DEFAULT_PROMPT_PATH;

    if (!fs.existsSync(promptPath)) {
        const message = `Summarization prompt file not found: ${promptPath}`;
        console.error(message);
        throw new Error(message);
    }

    const prompt = fs.readFileSync(promptPath, 'utf8');

    if (!prompt.trim()) {
        const message = `Summarization prompt file is empty: ${promptPath}`;
        console.error(message);
        throw new Error(message);
    }

    return prompt;
}

async function generateSummary(gptModel, text) {
    const systemPrompt = loadSummaryPrompt();

    const apiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        const summary = await openai.chat.completions.create({
            response_format: { "type": "json_object" },
            n: 1,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: gptModel,
        });
        return JSON.parse(summary.choices[0].message.content);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = generateSummary;
