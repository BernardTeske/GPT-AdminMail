require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const DEFAULT_SUMMARY_PROMPT_PATH = path.join(__dirname, 'prompts', 'summary-prompt.txt');

function loadSummaryPrompt() {
    const promptPath = process.env.SUMMARY_PROMPT_PATH || DEFAULT_SUMMARY_PROMPT_PATH;

    if (!fs.existsSync(promptPath)) {
        const message = `Summary prompt file not found: ${promptPath}. Set SUMMARY_PROMPT_PATH or create the file.`;
        console.error(message);
        throw new Error(message);
    }

    const content = fs.readFileSync(promptPath, 'utf8');
    if (!content.trim()) {
        const message = `Summary prompt file is empty: ${promptPath}`;
        console.error(message);
        throw new Error(message);
    }

    return content;
}

async function generateSummary(gptModel, text) {
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({
        apiKey: apiKey,
    });

    const systemPrompt = loadSummaryPrompt();

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
