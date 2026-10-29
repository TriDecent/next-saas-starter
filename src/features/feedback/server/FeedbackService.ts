import type { IBaseExecutor } from '@/infrastructure/executors';
import type { CreateFeedbackInput, IFeedbackRepository } from '../repo';

export class FeedbackService {
  constructor(
    private readonly _repo: IFeedbackRepository,
    private readonly _executor: IBaseExecutor
  ) {}

  submitFeedback(input: CreateFeedbackInput) {
    return this._executor.runSafely(
      () => this._repo.create(input),
      error => ({ message: error })
    );
  }
}
