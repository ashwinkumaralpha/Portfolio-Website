// Vercel serverless version of the contact endpoint (POST /api/contact)
const nodemailer = require('nodemailer');

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const { name = '', email = '', message = '', website = '' } = req.body || {};
  if (website) return res.json({ ok: true }); // honeypot for bots
  if (name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.trim().length < 10)
    return res.status(400).json({ ok: false, error: 'Please enter your name, a valid email and a message of at least 10 characters.' });
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
    return res.status(500).json({ ok: false, error: 'Email is not configured on the server yet.' });
  try {
    const port = +process.env.SMTP_PORT || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      html: `<p><b>${esc(name)}</b> (${esc(email)}) wrote:</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Could not send your message. Please email me directly.' });
  }
};
