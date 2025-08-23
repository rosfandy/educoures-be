console.log("📦 Loading mail.service.ts");

import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const createTransporter = () => {
  console.log("smtp host: ", process.env.SMTP_HOST);
  console.log("smtp port: ", process.env.SMTP_PORT);
  console.log("smtp user: ", process.env.SMTP_USER);
  console.log("smtp pass: ", process.env.SMTP_PASS);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const generateVerificationToken = (): string => {
  return uuidv4();
};

export const sendVerificationEmail = async (
  email: string,
  fullname: string,
  token: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const verificationLink = `${
      process.env.VERIFY_EMAIL_URL || "http://localhost:3000"
    }/verify-email?token=${token}`;

    const mailOptions = {
      from: {
        name: process.env.APP_NAME || "EduCourse App",
        address: process.env.SMTP_USER || "noreply@educourse.com",
      },
      to: email,
      subject: "Email Verification - EduCourse App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${fullname}!</h2>
          <p>Thank you for registering with EduCourse App. Please verify your email address by clicking the link below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>Or copy this link: <br>
          <span style="word-break: break-all;">${verificationLink}</span></p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
      text: `
        Hi ${fullname}!
        
        Thank you for registering with EduCourse App.
        Please verify your email by visiting: ${verificationLink}
        
        This link will expire in 24 hours.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent to: ${email}`);
    console.log(`✅ Message ID: ${info.messageId}`);

    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    return false;
  }
};

console.log("✅ mail.service.ts loaded");
