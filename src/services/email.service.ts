import nodemailer from 'nodemailer';
import { logger } from '@/config/logger';
import { env } from '@/config';
import { PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS, VERIFICATION_EMAIL } from '@/utils/emailTemplates';

const transport = nodemailer.createTransport(env.email.smtp);
if (env.mode !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
    );
}

const sendEmail = async (to: string, subject: string, html: string) => {
  const msg = { from: env.email.from, to, subject, html };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${env.frontend.url}/reset-password?token=${token}`;
  const html = PASSWORD_RESET_REQUEST(resetPasswordUrl);
  await sendEmail(to, subject, html);
};

const sendPasswordRestSuccessEmail = async (to: string) => {
  const subject = 'Password reset successful';
  const html = PASSWORD_RESET_SUCCESS;
  await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to: string, verifyEmailToken: string) => {
  const subject = 'Email Verification';
  const html = VERIFICATION_EMAIL(verifyEmailToken);
  await sendEmail(to, subject, html);
};

export default {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendPasswordRestSuccessEmail,
};
