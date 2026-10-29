import { FeedbackType } from '@/generated/prisma/browser';
import z from 'zod';

export const MAX_FEEDBACK_LENGTH = 2000;

export const SubmitFeedbackSchema = z.object({
  type: z.enum(Object.values(FeedbackType)),
  message: z.string().min(10).max(MAX_FEEDBACK_LENGTH),
  pageUrl: z.url(),
});

export type SubmitFeedback = z.infer<typeof SubmitFeedbackSchema>;
