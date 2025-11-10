'use server';

import { Resend, type CreateEmailOptions } from 'resend';
import { EmailVerificationTemplate } from './EmailVerificationTemplate';
import { PasswordResetTemplate } from './PasswordResetTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailSendingOptions = Readonly<{
  to: string;
  userName: string;
  expireIn: string;
}>;

export async function sendPasswordResetEmail(
  payload: EmailSendingOptions & { resetUrl: string }
) {
  return sendEmail(
    [payload.to],
    'Password Reset',
    PasswordResetTemplate(payload)
  );
}

export async function sendEmailVerification(
  payload: EmailSendingOptions & { verificationUrl: string }
) {
  return sendEmail(
    [payload.to],
    'Email Verification',
    EmailVerificationTemplate(payload)
  );
}

function sendEmail(
  to: string[],
  subject: string,
  content: CreateEmailOptions['react']
) {
  return resend.emails.send({
    from: `Trí Decent ${process.env.RESEND_FROM_EMAIL}`,
    to,
    subject,
    react: content,
  });
}
