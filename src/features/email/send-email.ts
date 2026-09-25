'use server';

import { ENV } from '@/lib/env';
import { Resend, type CreateEmailOptions } from 'resend';
import { DeleteAccountTemplate } from './template/DeleteAccountTemplate';
import { EmailVerificationTemplate } from './template/EmailVerificationTemplate';
import {
  OrganizationInvitationTemplate,
  type OrganizationInvitationTemplateProps,
} from './template/OrganizationInvitationTemplate';
import { PasswordResetTemplate } from './template/PasswordResetTemplate';
import {
  SubscriptionCanceledTemplate,
  type SubscriptionCanceledTemplateProps,
} from './template/SubscriptionCanceledTemplate';
import {
  SubscriptionCompleteTemplate,
  type SubscriptionCompleteTemplateProps,
} from './template/SubscriptionCompleteTemplate';
import {
  TrialEndTemplate,
  type TrialEndTemplateProps,
} from './template/TrialEndTemplate';
import {
  TrialExpireTemplate,
  type TrialExpireTemplateProps,
} from './template/TrialExpireTemplate';
import {
  TrialStartTemplate,
  type TrialStartTemplateProps,
} from './template/TrialStartTemplate';
import { WelcomeTemplate } from './WelcomeTemplate';

const resend = new Resend(ENV.RESEND_API_KEY);

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
    'Welcome to Identity Hub',
    WelcomeTemplate({ ...payload, getStartedUrl: ENV.NEXT_PUBLIC_BASE_URL })
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

type SubscriptionEmailSendingOptions = Readonly<{
  to: string;
  userName?: string;
}>;

export async function sendSubscriptionCompleteEmail(
  payload: SubscriptionEmailSendingOptions &
    Omit<SubscriptionCompleteTemplateProps, 'userName'>
) {
  const planName = payload.subscription.plan;

  return sendEmail(
    [payload.to],
    `Subscription completed: ${planName}`,
    SubscriptionCompleteTemplate(payload)
  );
}

export async function sendTrialStartEmail(
  payload: SubscriptionEmailSendingOptions &
    Omit<TrialStartTemplateProps, 'userName'>
) {
  return sendEmail(
    [payload.to],
    `Trial started: ${payload.subscription.plan}`,
    TrialStartTemplate(payload)
  );
}

export async function sendTrialEndEmail(
  payload: SubscriptionEmailSendingOptions &
    Omit<TrialEndTemplateProps, 'userName'>
) {
  return sendEmail(
    [payload.to],
    `Trial ending soon: ${payload.subscription.plan}`,
    TrialEndTemplate(payload)
  );
}

export async function sendTrialExpireEmail(
  payload: SubscriptionEmailSendingOptions &
    Omit<TrialExpireTemplateProps, 'userName'>
) {
  return sendEmail(
    [payload.to],
    `Trial expired: ${payload.subscription.plan}`,
    TrialExpireTemplate(payload)
  );
}

export async function sendSubscriptionCanceledEmail(
  payload: SubscriptionEmailSendingOptions &
    Omit<SubscriptionCanceledTemplateProps, 'userName'>
) {
  return sendEmail(
    [payload.to],
    `Subscription canceled: ${payload.data.subscription.plan}`,
    SubscriptionCanceledTemplate(payload)
  );
}

function sendEmail(
  to: string[],
  subject: string,
  content: CreateEmailOptions['react']
) {
  return resend.emails.send({
    from: ENV.RESEND_FROM_EMAIL,
    to,
    subject,
    react: content,
  });
}
