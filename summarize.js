require('dotenv').config(); // Vergessen Sie nicht, dies hinzuzufügen, um die .env-Datei zu laden
const OpenAI = require('openai');

// const { language = 'de', gptModel = 'gpt-4-turbo-preview', text } = req.body;

async function generateSummary(gptModel, text) {
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
                    content: `Du bekommst mehrere E-Mails. Bitte fasse die E-Mails alle zusammen zu einem Report. Die E-Mails sind in folgendem Format:

                    [
                      {
                        "subject": "Ein Betreff",
                        "text": "Hier steht\n\nEin Text!"
                      },
                      {
                        "subject": "Ein anderer Betreff",
                        "text": "Hier steht\n\nEin anderer Text!"
                      },
                      ...
                    ]

es handelt sich dabei um E-Mails die verschiedene Admin-Infos enthalten. Es geht dabei um verschiedene Statusmeldungen, warnungen etc. Die Ausgabe machst du bitte als JSON im Format:
                    
{"subject": "Betreff der zur Zusammenfassung aller Meldungen Passt", "text": "Text der zusammengefassten IT-Lage und mit Hinweisen bei Handlungsbedarf"}

Schreibe den Text dabei so, dass er für eine HTML-Mail gut formatiert ist. Fasse alle Mails zu EINEM Text zusammen. Und es soll eine Management-Summary sein. Die Zusammenfassung des Gesamtstatus soll zu Beginn sein. Schön kurz. Beurteile die Lage. Mehr Detailierte weiter unten. Ich will auf den ersten Blick sehen können wie die Lage ist. Ich bin der System-Admin. Es soll sein als ob ein Mitarbeiter mir einfach Erstattet ob alles Ok ist. Ich Ich will später den Text in einer Mail versenden können. Danke!
                    `
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: gptModel,
        });
        // console.log('summary', summary.choices[0].message);
        return JSON.parse(summary.choices[0].message.content);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = generateSummary;
