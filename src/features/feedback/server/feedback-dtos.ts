import type { Feedback } from '@/generated/prisma/client';
import type { ServiceResult } from '@/shared/types';

export type MessageError = { message: string };

export type SubmitFeedbackResult = ServiceResult<Feedback, MessageError>;
