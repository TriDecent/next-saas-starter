import type { Feedback } from '@/generated/prisma/client';

export interface IFeedbackRepository {
  create(input: CreateFeedbackInput): Promise<Feedback>;
}

export type CreateFeedbackInput = Pick<
  Feedback,
  'type' | 'message' | 'pageUrl'
>;
