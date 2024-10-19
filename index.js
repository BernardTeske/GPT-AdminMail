require('dotenv').config();
const imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const OpenAI = require('openai');
const generateSummary = require('./summarize');
const sentStatusMail = require('./sentStatusMail');


const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    tls: process.env.EMAIL_TLS === 'true',
    authTimeout: 3000
  }
};

imap.connect(config).then(async (connection) => {
  await connection.openBox('INBOX');

  const searchCriteria = ['UNSEEN'];
  const fetchOptions = {
    bodies: [''],
    markSeen: true
  };

  const messages = await connection.search(searchCriteria, fetchOptions);
  const emails = [];

  for (let message of messages) {
    const all = message.parts.find(part => part.which === '');
    const id = message.attributes.uid;
    const idHeader = 'Imap-Id: ' + id + '\r\n';

    const mail = await simpleParser(idHeader + all.body);

    emails.push({
      subject: mail.subject,
      text: mail.text
    });
  }

  

  try {
    try {
      summary = await generateSummary('gpt-4o', JSON.stringify(emails));
    } catch (error) {
      console.log('ERROR', error);
    }

    sentStatusMail(process.env.MAILTO, summary);

  } catch (error) {
    console.log('ERROR', error);
  }

  console.log('E-Mails wurden zusammengefasst undd gesendet.');

  connection.end();
}).catch(err => {
  console.error(err);
});
