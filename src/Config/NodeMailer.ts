import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({})

const config = () => {
  return {
    host: process.env.STMP_HOST,
    port: +process.env.STMP_PORT,
    auth: {
      user: process.env.STMP_USER,
      pass: process.env.STMP_PASSWORD
    }
  }
}

export const transporter = nodemailer.createTransport(config());
