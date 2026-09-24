# Identity Hub

> A SaaS identity and access foundation built with Next.js, Better Auth, Prisma, PostgreSQL, and Stripe.

Identity Hub is a portfolio project focused on building the authentication, authorization, multi tenancy, security, and subscription infrastructure commonly required by a SaaS application.

The project goes beyond basic authentication by combining multiple authentication methods, organization level access control, server side authorization, security sensitive workflows, and subscription billing within a modular application architecture.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-149ECA?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.5.2-black?style=flat-square)](https://www.better-auth.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-20-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)
[![pnpm](https://img.shields.io/badge/pnpm-11.17.0-F69220?style=flat-square&logo=pnpm)](https://pnpm.io/)

**[Live Demo](#demo)** · **[Architecture](#architecture)** · **[Getting Started](#getting-started)**

---

## Overview

Identity Hub focuses on the infrastructure behind a SaaS application rather than a specific business domain.

The project covers four closely related areas:

```text
Authentication
      +
Authorization
      +
Multi-Tenancy
      +
Billing
```

These concerns are implemented as separate application boundaries while still working together as a single system.

### Core Capabilities

- Multiple authentication methods including OAuth, TOTP, and passkeys
- User account security and recovery workflows
- Multi-tenant organizations and invitations
- Role and policy based authorization with CASL
- Server side protection for authenticated operations
- Stripe subscription lifecycle management
- Transactional email workflows
- Arcjet request protection and rate limiting
- Repository-based persistence and service layer business logic

---

## Features

### Authentication

- Email/password authentication
- GitHub OAuth
- Discord OAuth
- Account linking
- Email verification
- Password reset
- Email address change flow
- Session management
- Session revocation
- Account deletion
- Welcome and transactional emails

### Authentication Security

- TOTP-based two-factor authentication
- Backup codes
- WebAuthn passkeys
- Sensitive-action re-authentication through sudo mode
- Time-limited sudo sessions with automatic expiration after inactivity
- Server side authorization checks
- Arcjet rate limiting and bot protection

### Organizations & Multi-Tenancy

- Create and manage organizations
- Active organization switching
- Organization members
- Organization roles
- Member role management
- Member removal
- Organization invitations
- Invitation cancellation
- Invitation approval and rejection
- Organization-level access control
- Organization-specific subscription authorization

### Administration

- User management
- Role management
- User banning
- Session revocation
- User impersonation
- Controlled impersonation duration
- Permission-based administrative actions

### Subscriptions & Billing

- Stripe Billing integration
- Standard, Pro, and Enterprise plans
- Monthly and yearly billing
- Free-trial support
- Subscription upgrades
- Subscription cancellation
- Stripe Customer Portal
- Subscription lifecycle handling
- Subscription-related transactional emails

---

## Architecture

The application uses a **feature-driven architecture with explicit service, infrastructure, and authorization boundaries**.

```text
src/
├── app/              # Next.js routes, layouts, and API handlers
├── features/         # Feature-specific UI and actions
├── services/         # Application services and business logic
├── infrastructure/   # Repositories and external integrations
├── lib/              # Auth, authorization, security, and configuration
├── shared/           # Reusable UI, schemas, hooks, and utilities
└── store/            # Client-side application state
```

### Request Flow

The main application flow is structured around explicit boundaries:

```text
┌────────────────────────────┐
│ Next.js Route / Server     │
│ Action                     │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Feature                    │
│ UI / Feature Action        │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Authenticated Executor     │
│ Authorization Boundary     │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Service                    │
│ Business Logic             │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Repository                 │
│                            │
└─────────────┬──────────────┘
              ↓
      PostgreSQL / Stripe / Resend
```

### Architectural Decisions

#### Feature-driven organization

Business features are grouped under `src/features` instead of organizing the entire application around technical file types.

For example:

```text
features/
├── auth/
├── organizations/
├── invitations/
├── subscription/
├── admin/
└── settings/
```

This keeps feature-specific UI and actions close together and makes large application areas easier to navigate.

#### Service layer

Application workflows are implemented through dedicated services:

```text
services/
├── auth/
├── user/
├── organization/
└── subscription/
```

This prevents route handlers and UI components from becoming the primary location for business rules.

#### Repository layer

Database access is isolated behind repositories:

```text
infrastructure/repositories/
├── user/
├── organization/
├── invitation/
└── subscription/
```

Services therefore do not need to know how persistence is implemented internally.

#### Explicit authorization boundary

The application does not treat authentication as authorization.

Authentication establishes identity, while CASL policies determine what the authenticated user is allowed to do.

Authorization policies are defined separately for domains such as:

```text
User
Organization
Role
Invitation
Subscription
```

This makes permission rules explicit and reusable across server side operations.

---

## Authentication & Authorization

Better Auth provides the authentication foundation, while authorization is handled separately through CASL.

### Authentication

The authentication system supports:

- Password authentication
- OAuth providers
- Passkeys
- Two-factor authentication
- Sessions
- Organizations
- Administrative capabilities

### Authorization

CASL is used to define application permissions based on contextual information such as:

- User role
- Organization membership
- Organization role
- Resource ownership
- Subscription state

The application distinguishes between:

```text
Authentication
"Who is this user?"

Authorization
"What can this user do?"
```

Authorization checks are performed on the server so that client-side UI state is not treated as a security boundary.

---

## Security-Sensitive Operations

Some operations require stronger verification than an existing authenticated session.

Identity Hub implements a reusable sudo-mode flow for sensitive actions such as:

```text
Change Password
Delete Account
Modify Security Settings
Manage Two-Factor Authentication
Manage Passkeys
Administrative Operations
```

Sudo authorization is time-limited. After successful re-authentication, the elevated authorization remains valid only for a limited period of user activity. If the user remains inactive beyond the configured timeout, the sudo state expires and the user must re-authenticate before performing another sensitive operation.

The security model combines multiple layers:

```text
Better Auth
    +
TOTP / Passkeys
    +
Sudo Re-authentication
    +
CASL Authorization
    +
Arcjet Request Protection
```

Each layer addresses a different part of the security model rather than relying on a single mechanism.

---

## Multi-Tenancy

Organizations are modeled as first-class tenants.

The organization subsystem provides:

- Organization creation and management
- Active organization context
- Member management
- Role management
- Invitation workflows
- Invitation approval/rejection
- Organization metadata
- Organization-level authorization
- Organization-level subscription access

The authorization model can therefore take tenant context into account instead of treating authorization as purely global user roles.

---

## Subscription Architecture

Stripe is used as the external billing provider while application-specific subscription rules remain within the application.

Supported subscription tiers include:

```text
Standard
Pro
Enterprise
```

Billing supports:

```text
Monthly
Yearly
Free Trial
Upgrade
Cancellation
Customer Portal
```

Subscription operations are represented as a dedicated feature and service boundary rather than being embedded into unrelated user or organization logic.

Subscription lifecycle events are also connected to transactional email templates.

---

## Tech Stack

| Category | Technologies |
| --- | --- |
| **Framework** | Next.js 16.3.5, React 19.2.4, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **UI** | Base UI, Radix UI, Framer Motion |
| **Forms & Validation** | React Hook Form, Zod |
| **Authentication** | Better Auth 1.5.2, Passkeys, TOTP |
| **Authorization** | CASL |
| **Security** | Arcjet, JOSE |
| **Database** | PostgreSQL |
| **ORM** | Prisma 7.3.0 with PostgreSQL driver adapter |
| **Payments** | Stripe 20 |
| **Email** | Resend, React Email |
| **Tables** | TanStack Table |
| **State Management** | Redux Toolkit, Zustand |
| **UI Utilities** | React Icons, Lucide React, Sonner |
| **Package Manager** | pnpm 11 |

---

## Project Structure

The most important application boundaries are:

```text
src/
├── app/
│   └── Next.js application layer
│
├── features/
│   ├── auth/
│   ├── authorization/
│   ├── admin/
│   ├── organizations/
│   ├── invitations/
│   ├── subscription/
│   ├── settings/
│   └── email/
│
├── services/
│   ├── auth/
│   ├── user/
│   ├── organization/
│   ├── subscription/
│   └── executor/
│
├── infrastructure/
│   └── repositories/
│       ├── user/
│       ├── organization/
│       ├── invitation/
│       └── subscription/
│
├── lib/
│   ├── auth/
│   ├── casl/
│   ├── arcjet/
│   ├── stripe/
│   └── env/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── schema/
│   ├── context/
│   └── utils/
│
└── store/
```

---

## Demo

### Live Demo

> Add the deployed application URL here.

### Test Accounts

Dedicated demo accounts can be provided for reviewers to explore different permission levels.

| Account | Purpose |
| --- | --- |
| **Admin** | User management and administrative features |
| **Organization Owner** | Organization, members, invitations, and billing |
| **Organization Member** | Standard organization-level access |

> Never commit real production credentials to the repository. Use dedicated demo accounts with non-sensitive data.

---

## Getting Started

### Prerequisites

- Node.js
- pnpm 11+
- PostgreSQL
- Stripe account
- Resend account
- Arcjet account
- GitHub and/or Discord OAuth applications

### Installation

```bash
git clone https://github.com/your-username/identity-hub.git
cd identity-hub
pnpm install
```

### Environment Variables

Create a `.env` file in the project root.

<details>
<summary>View environment variables</summary>

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

ARCJET_KEY=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

STRIPE_STANDARD_SUBSCRIPTION_MONTHLY_PRICE_ID=
STRIPE_STANDARD_SUBSCRIPTION_YEARLY_PRICE_ID=

STRIPE_PRO_SUBSCRIPTION_MONTHLY_PRICE_ID=
STRIPE_PRO_SUBSCRIPTION_YEARLY_PRICE_ID=

STRIPE_ENTERPRISE_SUBSCRIPTION_MONTHLY_PRICE_ID=
STRIPE_ENTERPRISE_SUBSCRIPTION_YEARLY_PRICE_ID=

PASSKEY_RP_ID=
PASSKEY_RP_NAME=
PASSKEY_ORIGIN=
```

</details>

### Database Setup

Generate the Prisma client:

```bash
pnpm generate
```

Apply migrations:

```bash
pnpm migrate
```

### Run the Application

```bash
pnpm dev
```

Open `http://localhost:3000`.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Generate Prisma Client and build the application |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm generate` | Generate Prisma Client |
| `pnpm migrate` | Run Prisma database migrations |

---

## What This Project Demonstrates

Identity Hub was built to explore the engineering problems surrounding identity in a SaaS application.

The project demonstrates:

- Feature-oriented application organization
- Service-layer business logic
- Repository-based persistence
- Authentication with multiple identity mechanisms
- Server side authorization with CASL
- Multi-tenant organization modeling
- Invitation and membership workflows
- Security-sensitive re-authentication
- Stripe subscription lifecycle integration
- Transactional email workflows
- Request protection and rate limiting
- Separation of framework, business, persistence, and integration concerns

The primary goal is not simply to implement authentication screens, but to design an application foundation where identity, permissions, tenancy, and billing can evolve without becoming tightly coupled.

---

## License

Distributed under the MIT License.
