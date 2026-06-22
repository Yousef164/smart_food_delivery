import nodemailer from "nodemailer";

import { emailApp, passwordApp, urlApp, nodeEnv } from "../config/env.js";

let transporter;
if (nodeEnv !== "test") {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailApp,
      pass: passwordApp,
    },
  });
}

async function sendVerificationEmail(name, email, token) {
  if (nodeEnv === "test") {
    return Promise.resolve();
  }

  const link = `${urlApp}/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: emailApp,
    to: email,
    subject: "Verify your email",
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Welcome, ${name} 👋</h2>
      <p>Click the button below to verify your email address:</p>
      <a href="${link}" 
        style="background-color: #4CAF50; color: white; padding: 10px 20px; 
          text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${link}">${link}</a></p>
    </div>`,
  };
  try {
    console.log(link);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send verification email");
  }
}

export default sendVerificationEmail;
