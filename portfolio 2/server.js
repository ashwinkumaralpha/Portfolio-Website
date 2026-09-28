require('dotenv').config();
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Optional database: messages are saved only if MONGODB_URI is set
let Message = null;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(e => console.error('MongoDB error:', e.message));
  Message = mongoose.model('Message', new mongoose.Schema({
    name: String, email: String, message: String, createdAt: { type: Date, default: Date.now }
  }));
}

const transporter = process.env.SMTP_USER ? nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 465,
  secure: (+process.env.SMTP_PORT || 465) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
}) : null;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

app.post('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), async (req, res) => {
  const { name = '', email = '', message = '', website = '' } = req.body || {};
  if (website) return res.json({ ok: true }); // honeypot for bots
  if (name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.trim().length < 10)
    return res.status(400).json({ ok: false, error: 'Please enter your name, a valid email and a message of at least 10 characters.' });
  try {
    if (Message) await Message.create({ name, email, message });
    if (transporter) await transporter.sendMail({
      from: `"Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      html: `<p><b>${esc(name)}</b> (${esc(email)}) wrote:</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`
    });
    else console.log('Email not configured. Message:', { name, email, message });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Could not send your message. Please email me directly.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
