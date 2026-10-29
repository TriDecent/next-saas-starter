import { BaseExecutor } from '@/infrastructure/executors';
import { cache } from 'react';
import { PrismaFeedbackRepository } from '../repo';
import { FeedbackService } from './FeedbackService';

export const getFeedbackService = cache(
  () => new FeedbackService(new PrismaFeedbackRepository(), new BaseExecutor())
);
