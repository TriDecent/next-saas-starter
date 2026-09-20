-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "status" TEXT DEFAULT 'incomplete',
    "period_start" TIMESTAMP(3),
    "period_end" TIMESTAMP(3),
    "trial_start" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN DEFAULT false,
    "cancel_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "seats" INTEGER,
    "billing_interval" TEXT,
    "stripe_schedule_id" TEXT,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
