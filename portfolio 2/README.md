# Personal Professional Portfolio

Full-stack portfolio: semantic HTML/CSS/JS frontend + Node.js/Express backend with a contact form that sends email notifications (Nodemailer) and optionally stores messages in MongoDB.

## Run locally
```bash
npm install
cp .env.example .env   # fill in SMTP details (and MONGODB_URI if you want storage)
npm start              # http://localhost:3000
```

## Customize
- Content (projects, resume, skills): top of `public/script.js`
- Name, links, SEO tags, YOUR-LIVE-URL: `public/index.html`, `robots.txt`, `sitemap.xml`
- Add your `resume.pdf` to `public/`

## Deploy (live link)
Push to GitHub, then create a Web Service on Render or Railway: build `npm install`, start `npm start`, and add the `.env` values as environment variables.

## Features
Interactive projects filter and resume tabs, validated contact form (rate-limited, honeypot spam trap), email notifications, SEO (meta, Open Graph, JSON-LD, sitemap), responsive, dark mode, accessible.
