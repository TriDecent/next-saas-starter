# Identity Hub

**[English](README.md) · [Tiếng Việt](README.vi.md)**

> Nền tảng SaaS về identity và access management được xây dựng với Next.js, Better Auth, Prisma, PostgreSQL và Stripe.

Identity Hub là một portfolio project tập trung vào việc xây dựng các thành phần hạ tầng thường xuất hiện trong một ứng dụng SaaS, bao gồm authentication, authorization, multi-tenancy, security và subscription billing.

Project không chỉ dừng ở authentication cơ bản mà kết hợp nhiều phương thức xác thực, kiểm soát quyền truy cập theo organization, authorization phía server, các security-sensitive workflows và subscription billing trong một kiến trúc ứng dụng có ranh giới rõ ràng.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square\&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-149ECA?style=flat-square\&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square\&logo=typescript)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.5.2-black?style=flat-square)](https://www.better-auth.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=flat-square\&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square\&logo=postgresql)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-20-635BFF?style=flat-square\&logo=stripe)](https://stripe.com/)
[![pnpm](https://img.shields.io/badge/pnpm-11.17.0-F69220?style=flat-square\&logo=pnpm)](https://pnpm.io/)

**[Live Demo](#demo)** · **[Architecture](#architecture)** · **[Getting Started](#getting-started)**

---

## Demo Accounts

| Account        | Email                     | Password           | Purpose                                                                          |
| ---------      | ------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| **Admin**      | `sandbox-admin@gmail.com` | `Admin123@`        | User management, role management, impersonation and administrative features      |
| **Moderator**  | `sandbox-user@gmail.com`  | `User123@`         | Standard user features, account security, organization and subscription workflows|

---

## Tổng quan

Identity Hub tập trung vào phần hạ tầng phía sau một ứng dụng SaaS thay vì một business domain cụ thể.

Project xoay quanh bốn nhóm chức năng có liên quan chặt chẽ:

```text
Authentication
      +
Authorization
      +
Multi-Tenancy
      +
Billing
```

Các thành phần này được tổ chức thành những application boundaries riêng nhưng vẫn hoạt động như một hệ thống thống nhất.

### Các chức năng chính

* Nhiều phương thức authentication, bao gồm OAuth, TOTP và passkeys
* Account security và các recovery workflows
* Multi-tenant organizations và invitation workflows
* Role và policy-based authorization với CASL
* Server-side protection cho các authenticated operations
* Stripe subscription lifecycle management
* Transactional email workflows
* Arcjet request protection và rate limiting
* Persistence thông qua repository và business logic thông qua service layer

---

## Features

### Authentication

* Email/password authentication
* GitHub OAuth
* Discord OAuth
* Account linking
* Email verification
* Password reset
* Email address change flow
* Session management
* Session revocation
* Account deletion
* Welcome và transactional emails

### Authentication Security

* TOTP-based two-factor authentication
* Backup codes
* WebAuthn passkeys
* Sensitive-action re-authentication thông qua sudo mode
* Time-limited sudo sessions với automatic expiration sau một khoảng thời gian không hoạt động
* Server-side authorization checks
* Arcjet rate limiting và bot protection

### Organizations & Multi-Tenancy

* Tạo và quản lý organizations
* Chuyển active organization
* Quản lý organization members
* Organization roles
* Thay đổi member role
* Xóa member khỏi organization
* Organization invitations
* Hủy invitation
* Chấp nhận và từ chối invitation
* Organization-level access control
* Organization-specific subscription authorization

### Administration

* User management
* Role management
* User banning
* Session revocation
* User impersonation
* Kiểm soát thời gian impersonation
* Permission-based administrative actions

### Subscriptions & Billing

* Stripe Billing integration
* Standard, Pro và Enterprise plans
* Monthly và yearly billing
* Free-trial support
* Subscription upgrades
* Subscription cancellation
* Stripe Customer Portal
* Subscription lifecycle handling
* Subscription-related transactional emails

---

## Architecture

Application sử dụng **feature-driven architecture với các ranh giới rõ ràng giữa application services, infrastructure và authorization**.

```text
src/
├── app/              # Next.js routes, layouts và API handlers
├── features/         # Feature-specific UI và actions
├── services/         # Application services và business logic
├── infrastructure/   # Repositories và external integrations
├── lib/              # Auth, authorization, security và configuration
├── shared/            # Reusable UI, schemas, hooks và utilities
└── store/             # Client-side application state
```

### Request Flow

Application flow được tổ chức quanh các boundary rõ ràng:

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
└─────────────┬──────────────┘
              ↓
       PostgreSQL / Stripe / Resend
```

### Architectural Decisions

#### Feature-driven organization

Business features được nhóm dưới `src/features` thay vì tổ chức toàn bộ application theo loại file kỹ thuật.

Ví dụ:

```text
features/
├── auth/
├── organizations/
├── invitations/
├── subscription/
├── admin/
└── settings/
```

Cách tổ chức này giữ UI và actions liên quan đến một feature ở gần nhau, đồng thời giúp các application area lớn dễ quản lý hơn.

#### Service layer

Các application workflows được xử lý thông qua các service riêng biệt:

```text
services/
├── auth/
├── user/
├── organization/
└── subscription/
```

Điều này giúp route handlers và UI components không trở thành nơi chứa business logic chính của application.

#### Repository layer

Database access được cô lập phía sau repositories:

```text
infrastructure/repositories/
├── user/
├── organization/
├── invitation/
└── subscription/
```

Nhờ đó, service không cần phụ thuộc trực tiếp vào chi tiết triển khai persistence.

#### Explicit authorization boundary

Application phân biệt rõ authentication và authorization.

Authentication xác định danh tính của user, trong khi CASL policies xác định user đó được phép thực hiện những hành động nào.

Authorization policies được định nghĩa riêng cho các domain như:

```text
User
Organization
Role
Invitation
Subscription
```

Authorization checks được thực hiện phía server. Client-side UI state không được xem là một security boundary.

---

## Authentication & Authorization

Better Auth cung cấp authentication foundation, trong khi authorization được xử lý riêng thông qua CASL.

### Authentication

Authentication system hỗ trợ:

* Password authentication
* OAuth providers
* Passkeys
* Two-factor authentication
* Sessions
* Organizations
* Administrative capabilities

### Authorization

CASL được sử dụng để định nghĩa permissions dựa trên contextual information như:

* User role
* Organization membership
* Organization role
* Resource ownership
* Subscription state

Application phân biệt:

```text
Authentication
"Who is this user?"

Authorization
"What can this user do?"
```

Authorization checks được thực hiện phía server để client-side state không thể được sử dụng như một security boundary.

---

## Security-Sensitive Operations

Một số operation yêu cầu mức xác thực cao hơn một authenticated session thông thường.

Identity Hub triển khai reusable **sudo-mode flow** cho các sensitive actions như:

```text
Change Password
Delete Account
Modify Security Settings
Manage Two-Factor Authentication
Manage Passkeys
Administrative Operations
```

Sudo authorization có thời hạn. Sau khi user re-authenticate thành công, elevated authorization chỉ tồn tại trong một khoảng thời gian giới hạn.

Nếu user không thực hiện tương tác cần thiết trong khoảng thời gian được cấu hình, sudo state sẽ tự động hết hạn. Khi đó user phải re-authenticate trước khi thực hiện sensitive operation tiếp theo.

Security model kết hợp nhiều lớp:

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

Mỗi lớp giải quyết một phần khác nhau của security model thay vì phụ thuộc vào một cơ chế duy nhất.

---

## Multi-Tenancy

Organizations được mô hình hóa như các tenant độc lập.

Organization subsystem cung cấp:

* Organization creation và management
* Active organization context
* Member management
* Role management
* Invitation workflows
* Invitation approval/rejection
* Organization metadata
* Organization-level authorization
* Organization-level subscription access

Authorization model có thể sử dụng tenant context khi đưa ra quyết định về quyền truy cập thay vì chỉ dựa trên global user roles.

---

## Subscription Architecture

Stripe được sử dụng làm external billing provider, trong khi application-specific subscription rules được quản lý bên trong application.

Các subscription tiers:

```text
Standard
Pro
Enterprise
```

Billing hỗ trợ:

```text
Monthly
Yearly
Free Trial
Upgrade
Cancellation
Customer Portal
```

Subscription operations được tổ chức thành một feature và service boundary riêng thay vì nhúng trực tiếp vào user hoặc organization logic.

Subscription lifecycle cũng được kết nối với transactional email workflows.

---

## Tech Stack

| Category               | Technologies                               |
| ---------------------- | ------------------------------------------ |
| **Framework**          | Next.js 16.3.5, React 19.2.4, TypeScript   |
| **Styling**            | Tailwind CSS 4                             |
| **UI**                 | Base UI, Radix UI, Framer Motion           |
| **Forms & Validation** | React Hook Form, Zod                       |
| **Authentication**     | Better Auth 1.5.2, Passkeys, TOTP          |
| **Authorization**      | CASL                                       |
| **Security**           | Arcjet, JOSE                               |
| **Database**           | PostgreSQL                                 |
| **ORM**                | Prisma 7.3.0 với PostgreSQL driver adapter |
| **Payments**           | Stripe 20                                  |
| **Email**              | Resend, React Email                        |
| **Tables**             | TanStack Table                             |
| **State Management**   | Redux Toolkit, Zustand                     |
| **UI Utilities**       | React Icons, Lucide React, Sonner          |
| **Package Manager**    | pnpm 11                                    |

---

## Project Structure

Các application boundaries quan trọng:

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

> <https://saas.tridecent.me/>

### Test Accounts

The project provides two sandbox accounts for reviewers to test different permission levels.

| Account        | Email                     | Password           | Purpose                                                                          |
| ---------      | ------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| **Admin**      | `sandbox-admin@gmail.com` | `Admin123@`        | User management, role management, impersonation và các administrative features   |
| **Moderator**  | `sandbox-user@gmail.com`  | `User123@`         | Standard user features, account security, organization và subscription workflows |

> **Note:** These accounts are provided exclusively for demonstration and testing purposes. They contain no sensitive personal data and must not be used for production purposes.

---

## Getting Started

### Prerequisites

* Node.js
* pnpm 11+
* PostgreSQL
* Stripe account
* Resend account
* Arcjet account
* GitHub và/hoặc Discord OAuth applications

### Installation

```bash
git clone https://github.com/your-username/identity-hub.git
cd identity-hub
pnpm install
```

### Environment Variables

Tạo file `.env` tại project root.

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

Generate Prisma Client:

```bash
pnpm generate
```

Apply database migrations:

```bash
pnpm migrate
```

### Run the Application

```bash
pnpm dev
```

Mặc định application chạy tại:

```text
http://localhost:3000
```

---

## Available Scripts

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `pnpm dev`      | Khởi chạy Next.js development server        |
| `pnpm build`    | Generate Prisma Client và build application |
| `pnpm start`    | Khởi chạy production server                 |
| `pnpm lint`     | Chạy ESLint                                 |
| `pnpm generate` | Generate Prisma Client                      |
| `pnpm migrate`  | Chạy Prisma database migrations             |

---

## What This Project Demonstrates

Identity Hub được xây dựng để khám phá các bài toán engineering xoay quanh identity trong một SaaS application.

Project thể hiện:

* Feature-oriented application organization
* Service-layer business logic
* Repository-based persistence
* Authentication với nhiều identity mechanisms
* Server-side authorization với CASL
* Multi-tenant organization modeling
* Invitation và membership workflows
* Security-sensitive re-authentication
* Time-limited elevated authorization
* Stripe subscription lifecycle integration
* Transactional email workflows
* Request protection và rate limiting
* Separation giữa framework, business logic, persistence và external integrations

Mục tiêu chính không chỉ là xây dựng các authentication screens, mà là thiết kế một application foundation trong đó identity, permissions, tenancy và billing có thể phát triển mà không bị coupling quá chặt với nhau.

---

## License

Distributed under the MIT License.
