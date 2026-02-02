'use server';

import { Resend, type CreateEmailOptions } from 'resend';
import { DeleteAccountTemplate } from './template/DeleteAccountTemplate';
import { EmailVerificationTemplate } from './template/EmailVerificationTemplate';
import {
  OrganizationInvitationTemplate,
  type OrganizationInvitationTemplateProps,
} from './template/OrganizationInvitationTemplate';
import { PasswordResetTemplate } from './template/PasswordResetTemplate';
import { WelcomeTemplate } from './WelcomeTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailSendingOptions = Readonly<{
  to: string;
  userName: string;
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

export async function sendWelcomeEmail(payload: EmailSendingOptions) {
  return sendEmail(
    [payload.to],
    'Welcome to Auth Demo',
    WelcomeTemplate(payload)
  );
}

export async function sendChangeEmailVerification(
  payload: EmailSendingOptions & { verificationUrl: string }
) {
  return sendEmail(
    [payload.to],
    'Change Email Verification',
    EmailVerificationTemplate(payload)
  );
}

export async function sendDeleteAccountVerification(
  payload: EmailSendingOptions & { verificationUrl: string }
) {
  return sendEmail(
    [payload.to],
    'Delete Account Verification',
    DeleteAccountTemplate(payload)
  );
}

export async function sendOrganizationInvitationEmail(
  payload: OrganizationInvitationTemplateProps
) {
  return sendEmail(
    [payload.recipientEmail],
    'Invitation to join ' + payload.organizationName,
    OrganizationInvitationTemplate(payload)
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
