import { auth, SUBSCRIPTION_PLAN, type SubscriptionPlan } from '@/lib/auth';
import { AppPolicy } from '@/lib/casl';
import { stripeClient } from '@/lib/stripe';
import type { IAuthenticatedExecutor } from '../executor';
import type {
  CreateBillingPortalInput,
  GetSubscriptionOverviewResponse,
  ListActiveSubscriptionResponse,
  ListActiveSubscriptionsInput,
  SubscriptionPlanDetails,
  UpgradeSubscriptionInput,
  UpgradeSubscriptionResponse,
} from './subscription-dtos';

interface ISubscriptionOwnerContext {
  getAuthorizedUserIds(referenceId: string): Promise<string[]>;
}

export class SubscriptionService {
  private readonly _subscriptionPolicy = AppPolicy.getSubscriptionPolicyFor(
    this.actor
  );
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

  constructor(
    private readonly _serviceExecutor: IAuthenticatedExecutor,
    private readonly _ownerContextFetcher: ISubscriptionOwnerContext
  ) {}

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
    return this._serviceExecutor.runSafely(
      async () =>
        auth.api.upgradeSubscription({
          body: params,
          headers: this.headers,
        }),
      error => ({ message: error })
    );
  }

  listActiveSubscription(
    params?: ListActiveSubscriptionsInput
  ): Promise<ListActiveSubscriptionResponse> {
    return this._serviceExecutor.runSafely(
      () =>
        auth.api.listActiveSubscriptions({
          query: params,
          headers: this.headers,
        }),
      error => ({ message: error })
    );
  }

  createBillingPortal(params: CreateBillingPortalInput) {
    return this._serviceExecutor.runSafely(
      () =>
        auth.api.createBillingPortal({ body: params, headers: this.headers }),
      error => ({ message: error })
    );
  }

  getSubscriptionOverview(
    activeSubscriptionQuery?: Parameters<
      SubscriptionService['listActiveSubscription']
    >[number]
  ): Promise<GetSubscriptionOverviewResponse> {
    return this._serviceExecutor.runSafely(
      async () => {
        const [plans, activeSubscriptionsResponse] = await Promise.all([
          this.getSubscriptionPlans(),
          this.listActiveSubscription(activeSubscriptionQuery),
        ]);

        if (activeSubscriptionsResponse.type === 'error')
          throw new Error(activeSubscriptionsResponse.payload.message);

        const activeSubscriptions = activeSubscriptionsResponse.payload;
        const planName = activeSubscriptions.at(0)?.plan as SubscriptionPlan;
        const billingInterval = activeSubscriptions.at(0)?.billingInterval;

        return {
          activeSubscriptions,
          plans,
          currentPlan:
            planName && billingInterval
              ? { name: planName, billingInterval }
              : undefined,
        };
      },
      error => ({ message: error })
    );
  }

  public get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
