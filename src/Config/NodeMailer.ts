import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({});

const config = () => {
  return {
    host: process.env.SMTP_HOST, // Corregido a SMTP_HOST
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER, // Corregido a SMTP_USER
      pass: process.env.SMTP_PASSWORD,
    },
  };
};

export const transporter = nodemailer.createTransport(config());
