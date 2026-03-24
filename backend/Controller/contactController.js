import db from '../config/db.js';
import * as mail from '../utils/mailer.js';

const submitContactMessage = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const subject = String(req.body?.subject || '').trim();
    const message = String(req.body?.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const recipientEmail = String(process.env.EMAIL_USER || '').trim();
    if (!recipientEmail) {
      return res.status(500).json({ message: 'EMAIL_USER is not configured in .env' });
    }

    db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || null, message],
      async (insertErr, result) => {
        if (insertErr) {
          return res.status(500).json({ message: 'Failed to save contact message', error: insertErr.message });
        }

        const safeSubject = subject || 'General Inquiry';
        const textBody = `New contact message from Quickkart website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${safeSubject}\n\nMessage:\n${message}`;
        const htmlBody = `
          <div style="font-family: Arial, sans-serif; background: #f3f7f5; padding: 24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5ece8;">
              <tr>
                <td style="background: linear-gradient(135deg, #007E5D 0%, #00A57A 100%); color: #ffffff; padding: 20px 24px;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 700;">New Contact Message</h1>
                  <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.95;">Submitted from Quickkart Contact Us page.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; color: #1f2937;">
                  <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 0 0 14px;"><strong>Subject:</strong> ${safeSubject}</p>
                  <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
                  <div style="white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; color: #374151;">${message}</div>
                </td>
              </tr>
            </table>
          </div>
        `;

        const emailResult = await mail.SendEmail(
          recipientEmail,
          `Quickkart Contact: ${safeSubject}`,
          textBody,
          htmlBody
        );

        if (!emailResult.success) {
          return res.status(500).json({
            message: emailResult.message || 'Message saved but failed to send email',
            emailError: emailResult.error || null,
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Message sent successfully',
          id: result.insertId,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit contact message', error: err.message });
  }
};

export { submitContactMessage };
