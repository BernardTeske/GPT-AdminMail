require('dotenv').config();
const nodemailer = require('nodemailer');

async function sentStatusMail(toEmail, summary) {
  // SMTP-Konfiguration
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true', // true für Port 465, false für andere Ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // E-Mail-Optionen
  let mailOptions = {
    from: process.env.SMTP_FROM, // Absenderadresse
    to: toEmail, // Empfängeradresse
    subject: 'GPT-ADMIN: ' + summary.subject, // Betreff der E-Mail
    text: summary.text, // Inhalt der E-Mail
    html: summary.text // Inhalt der E-Mail
    // html: '<b>' + summary.text + '</b>' // Optional: HTML-Inhalt
  };

  // E-Mail senden
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('E-Mail gesendet: %s', info.messageId);
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    throw error;
  }
}

module.exports = sentStatusMail;
