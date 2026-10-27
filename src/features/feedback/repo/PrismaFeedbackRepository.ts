import type { Feedback } from '@/generated/prisma/client';
import { prisma } from '@/lib';
import type {
  CreateFeedbackInput,
  IFeedbackRepository,
} from './IFeedbackRepository';

export class PrismaFeedbackRepository implements IFeedbackRepository {
  private readonly _delegate = prisma.feedback;

  create(input: CreateFeedbackInput): Promise<Feedback> {
    return this._delegate.create({ data: input });
  }
}
