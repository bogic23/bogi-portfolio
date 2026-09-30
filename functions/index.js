/**
 * Contact-form backend: saves the message to Firestore AND sends a
 * confirmation email FROM the owner's Gmail TO the guest (SMTP app password).
 *
 * Credential model (all secrets live here, server-side):
 *   - Firestore access uses the Functions runtime service account via the
 *     Admin SDK — no key files, no client credentials. Admin SDK writes
 *     bypass security rules, so clients cannot write contact_messages
 *     directly at all (rules deny it).
 *   - Gmail address + app password are Firebase Function secrets — NEVER
 *     client env vars:
 *       firebase functions:secrets:set GMAIL_USER
 *       firebase functions:secrets:set GMAIL_APP_PASSWORD
 *     (Create the app password at Google Account → Security →
 *     2-Step Verification → App passwords.)
 *
 * NOTE: the Firebase *web* config (apiKey, projectId, …) in src/firebase.js
 * is intentionally still client-side: those are public identifiers, not
 * secrets, and Auth/Firestore client SDKs cannot work without them.
 *
 * Deploy: firebase deploy --only functions   (requires the Blaze plan:
 * Cloud Functions on Spark cannot reach Gmail's SMTP servers)
 */

const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const GMAIL_USER = defineSecret('GMAIL_USER');
const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');

// Best-effort in-memory throttle: max 5 submissions / 10 min per IP,
// per function instance.
const hits = new Map();
function isThrottled(ip) {
  const now = Date.now();
  const WINDOW_MS = 10 * 60 * 1000;
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function isValidEmail(value) {
  return (
    typeof value === 'string' &&
    value.length <= 100 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function isValidText(value, maxLen) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLen;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

exports.sendContactEmail = onRequest(
  {
    region: 'asia-southeast1',
    secrets: [GMAIL_USER, GMAIL_APP_PASSWORD],
    cors: true,
    maxInstances: 10,
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed.' });
    }

    const ip = String(req.ip || req.headers['x-forwarded-for'] || 'unknown');
    if (isThrottled(ip)) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }

    const { name, email, subject, message } = req.body ?? {};
    if (!isValidText(name, 60)) return res.status(400).json({ error: 'Invalid name.' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email.' });
    if (!isValidText(subject, 120)) return res.status(400).json({ error: 'Invalid subject.' });
    if (!isValidText(message, 2000)) return res.status(400).json({ error: 'Invalid message.' });

    const guest = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // 1. Persist via Admin SDK (bypasses rules — clients have zero write
    //    access to contact_messages).
    try {
      await db.collection('contact_messages').add({
        ...guest,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error('[sendContactEmail] Firestore save failed:', err);
      return res.status(500).json({ error: 'Could not save your message, please try again.' });
    }

    // 2. Confirmation email FROM the owner's Gmail TO the guest — a copy
    // stays in the account's Sent folder.
    const owner = GMAIL_USER.value();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: owner, pass: GMAIL_APP_PASSWORD.value() },
    });
    const safeMessage = escapeHtml(guest.message).replace(/\n/g, '<br />');
    try {
      await transporter.sendMail({
        from: `"Abednego Bogi Portfolio" <${owner}>`,
        to: guest.email,
        replyTo: owner,
        subject: `Thanks for reaching out, ${guest.name}!`,
        text:
          `Hi ${guest.name},\n\n` +
          `Thanks for your message about "${guest.subject}". ` +
          `I've received it and will get back to you at this email address shortly.\n\n` +
          `Your message:\n${guest.message}\n\n` +
          `— Abednego Bogi`,
        html:
          `<p>Hi ${escapeHtml(guest.name)},</p>` +
          `<p>Thanks for your message about "<strong>${escapeHtml(guest.subject)}</strong>". ` +
          `I've received it and will get back to you at this email address shortly.</p>` +
          `<blockquote style="border-left:3px solid #d4af37;padding-left:12px;color:#555;">${safeMessage}</blockquote>` +
          `<p>— Abednego Bogi</p>`,
      });
      return res.json({ ok: true, emailDelivered: true });
    } catch (err) {
      // Message is safely stored; only the email leg failed.
      console.error('[sendContactEmail] delivery failed:', err);
      return res.json({ ok: true, emailDelivered: false });
    }
  },
);
