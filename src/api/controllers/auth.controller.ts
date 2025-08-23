console.log("📦 Loading auth.controller.ts");

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as mailService from "../services/mail.service";
import { User } from "../../models";

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
      return;
    }

    const user = await User.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid Verification Token",
      });
      return;
    }

    if (user.email_verified_at) {
      res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
      return;
    }

    await user.update({
      email_verified_at: new Date(),
      verification_token: null,
    });

    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
      data: {
        user: {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          email_verified_at: user.email_verified_at,
        },
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      const field = existingUser.username === username ? "username" : "email";
      res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`,
      });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationToken = mailService.generateVerificationToken();

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      email_verified_at: null,
      verification_token: verificationToken,
    });

    const emailSent = await mailService.sendVerificationEmail(
      newUser.email,
      newUser.fullname,
      verificationToken
    );

    if (!emailSent) {
      console.warn("Failed to send verification email, but user was created");
    }

    const authToken = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: emailSent
        ? "User registered successfully. Please check your email to verify your account."
        : "User registered successfully, but verification email could not be sent.",
      data: {
        token: authToken,
        user: {
          id: newUser.id,
          fullname: newUser.fullname,
          username: newUser.username,
          email: newUser.email,
          email_verified_at: newUser.email_verified_at,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.email_verified_at) {
      res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
      return;
    }

    const verificationToken = mailService.generateVerificationToken();

    await user.update({ verification_token: verificationToken });

    const emailSent = await mailService.sendVerificationEmail(
      user.email,
      user.fullname,
      verificationToken
    );

    if (!emailSent) {
      res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

console.log("✅ auth.controller.ts loaded");
