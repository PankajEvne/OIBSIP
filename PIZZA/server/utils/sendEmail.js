import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Sending to:", to);

    const info = await transporter.sendMail({
      from: `"Pizza Delivery" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("✅ Email sent:", info.messageId);
    console.log("📨 Recipient:", info.accepted);
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
};


