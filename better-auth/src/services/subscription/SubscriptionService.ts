import { auth, SUBSCRIPTION_PLAN } from '@/lib/auth';
import type { IServiceExecutor } from '../ServiceExecutor';
import type {
  GeneralSubscriptionResponse,
  ListActiveSubscriptionResponse,
  ListActiveSubscriptionsInput,
  SubscriptionPlan,
  UpgradeSubscriptionInput,
} from './subscription-dtos';

export class SubscriptionService {
  constructor(private readonly _serviceExecutor: IServiceExecutor) {}

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const plans = [
      {
        name: SUBSCRIPTION_PLAN.standard.name,
        title: 'Standard',
        subtitle: 'For small teams getting started',
        caption: '/month',
        features: [
          'Up to 10 members',
          'Basic organization roles',
          'Email support',
          'Core analytics',
        ],
      },
      {
        name: SUBSCRIPTION_PLAN.pro.name,
        title: 'Pro',
        subtitle: 'Best for growing product teams',
        caption: '/month',
        highlighted: true,
        features: [
          'Up to 50 members',
          'Advanced role controls',
          'Priority support',
          'Usage insights & reports',
          'Audit-ready activity logs',
        ],
      },
      {
        name: SUBSCRIPTION_PLAN.enterprise.name,
        title: 'Enterprise',
        subtitle: 'For large organizations with strict governance',
        caption: 'contact sales',
        features: [
          'Unlimited members',
          'Enterprise-grade permissions',
          'Dedicated success manager',
          'SLA & security review support',
          'Custom onboarding',
        ],
      },
    ] as const satisfies Omit<SubscriptionPlan, 'price'>[];

    return plans.map(plan => ({ ...plan, price: '$69' }));
  }

  upgradeSubscription(
    params: UpgradeSubscriptionInput
  ): Promise<UpgradeSubscriptionResponse> {
    return this._serviceExecutor.runSafely(async () =>
      auth.api.upgradeSubscription({
        body: params,
        headers: this.headers,
      })
    );
  }

  listActiveSubscription(
    params: ListActiveSubscriptionsInput
  ): Promise<ListActiveSubscriptionResponse> {
    return this._serviceExecutor.runSafely(() =>
      auth.api.listActiveSubscriptions({ query: params, headers: this.headers })
    );
  }

  public get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
