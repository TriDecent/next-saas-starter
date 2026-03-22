import { auth, SUBSCRIPTION_PLAN } from '@/lib/auth';
import { stripeClient } from '@/lib/stripe';
import type { IServiceExecutor } from '../ServiceExecutor';
import type {
  ListActiveSubscriptionResponse,
  ListActiveSubscriptionsInput,
  SubscriptionPlanDetails,
  UpgradeSubscriptionInput,
  UpgradeSubscriptionResponse,
} from './subscription-dtos';

export class SubscriptionService {
  private readonly _plans = [
    {
      name: SUBSCRIPTION_PLAN.standard.name,
      title: 'Standard',
      subtitle: 'For small teams getting started',
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
      features: [
        'Unlimited members',
        'Enterprise-grade permissions',
        'Dedicated success manager',
        'SLA & security review support',
        'Custom onboarding',
      ],
    },
  ] as const satisfies Omit<SubscriptionPlanDetails, 'prices'>[];

  constructor(private readonly _serviceExecutor: IServiceExecutor) {}

  async getSubscriptionPlans(): Promise<SubscriptionPlanDetails[]> {
    return Promise.all(
      this._plans.map(async plan => {
        const [monthlyPrice, annualPrice] = await Promise.all([
          stripeClient.prices.retrieve(SUBSCRIPTION_PLAN[plan.name].priceId),
          stripeClient.prices.retrieve(
            SUBSCRIPTION_PLAN[plan.name].annualDiscountPriceId
          ),
        ]);

        const monthlyAmount = parseAmount(monthlyPrice.unit_amount);
        const annualAmount = parseAmount(annualPrice.unit_amount);

        return {
          ...plan,
          prices: {
            monthly: {
              amount: monthlyAmount,
              currency: monthlyPrice.currency,
              interval: monthlyPrice.recurring!.interval,
            },
            annual: {
              amount: annualAmount,
              currency: annualPrice.currency,
              interval: annualPrice.recurring!.interval,
            },
          },
        };
      })
    );

    function parseAmount(amount: number | null) {
      return amount ? amount / 100 : 0;
    }
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
    params?: ListActiveSubscriptionsInput
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
