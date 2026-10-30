import type { IBaseExecutor } from '@/infrastructure/executors';
import { getErrorMessage } from '@/shared/utils';
import type { CreateFeedbackInput, IFeedbackRepository } from '../repo';
import type { MessageError, SubmitFeedbackResult } from './feedback-dtos';

export class FeedbackService {
  constructor(
    private readonly _repo: IFeedbackRepository,
    private readonly _executor: IBaseExecutor
  ) {}

  submitFeedback(input: CreateFeedbackInput): Promise<SubmitFeedbackResult> {
    return this._executor.runSafely(
      () => this._repo.create(input),
      this.handleError
    );
  }

  private handleError(error: unknown): MessageError {
    return { message: getErrorMessage(error) };
  }
}
