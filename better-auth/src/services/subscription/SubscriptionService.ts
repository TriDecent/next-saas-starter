import { auth, SUBSCRIPTION_PLAN, type SubscriptionPlan } from '@/lib/auth';
import { AppPolicy } from '@/lib/casl';
import { stripeClient } from '@/lib/stripe';
import type { IServiceExecutor } from '../ServiceExecutor';
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
    private readonly _serviceExecutor: IServiceExecutor,
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

  createBillingPortal(params: CreateBillingPortalInput) {
    return this._serviceExecutor.runSafely(() =>
      auth.api.createBillingPortal({ body: params, headers: this.headers })
    );
  }

  async getSubscriptionOverview(
    activeSubscriptionQuery?: Parameters<
      SubscriptionService['listActiveSubscription']
    >[number]
  ): Promise<GetSubscriptionOverviewResponse> {
    const [plans, activeSubscriptionsResponse] = await Promise.all([
      this.getSubscriptionPlans(),
      this.listActiveSubscription(activeSubscriptionQuery),
    ]);

    if (activeSubscriptionsResponse.type === 'error')
      return activeSubscriptionsResponse;

    const activeSubscriptions = activeSubscriptionsResponse.payload;
    const planName = activeSubscriptions.at(0)?.plan as SubscriptionPlan;
    const billingInterval = activeSubscriptions.at(0)?.billingInterval;

    const subscriptionQueryResult =
      await this._serviceExecutor.executeProtectedAction({
        requiredRbac: { subscription: ['get'] },
        rbacError: 'You do not have permission to view subscription details.',
        loadResource: async () => {
          if (!activeSubscriptionQuery?.referenceId)
            return { type: 'success', payload: null };

          const authorizedUserIds =
            await this._ownerContextFetcher.getAuthorizedUserIds(
              activeSubscriptionQuery.referenceId
            );

          return { type: 'success', payload: authorizedUserIds };
        },
        notFoundMessage: 'Subscription not found.',
        abacCheck: target => {
          for (const subscription of activeSubscriptions) {
            if (
              !this._subscriptionPolicy.canRead({
                ...subscription,
                owners: target,
              })
            )
              return false;
          }
          return true;
        },
        abacError: 'You do not have access to view this subscription.',
        action: () => Promise.resolve(undefined),
      });

    if (subscriptionQueryResult.type === 'error')
      return subscriptionQueryResult;

    return {
      type: 'success',
      payload: {
        activeSubscriptions,
        plans,
        currentPlan:
          planName && billingInterval
            ? { name: planName, billingInterval }
            : undefined,
      },
    };
  }

  public get actor() {
    return this._serviceExecutor.actor;
  }
  private get headers() {
    return this._serviceExecutor.headers;
  }
}
