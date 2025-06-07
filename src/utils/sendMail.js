import nodemailer from 'nodemailer';
import { getEnvVar } from '../utils/getEnvVar.js';

export const sendEmail = async (mail) => {
  const transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: getEnvVar('SMTP_PORT'),
    secure: false,
    auth: {
      user: getEnvVar('SMTP_USER'),
      pass: getEnvVar('SMTP_PASSWORD'),
    },
  });

  return await transporter.sendMail(mail);
};
