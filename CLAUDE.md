# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aspire Academics** - A tutoring service landing page and website for VCE and high school students in Melbourne, Victoria, Australia.

This project is based on a Next.js 15 SaaS starter template and has been customized as a marketing and informational website for Aspire Academics. The underlying infrastructure includes:
- **Next.js 15** with App Router, React Server Components, and Partial Prerendering (PPR)
- **Postgres** database with **Drizzle ORM**
- **Stripe** for subscription management (may be used for course/subscription payments)
- **JWT-based authentication** stored in cookies
- **shadcn/ui** components built on Radix UI
- **WiseLMS API** integration for course enrollment and student management
- **Calendly** integration for scheduling consultations
- Custom smooth scrolling implementation

**Current Focus:** Marketing landing page with sections for courses, testimonials, locations, consultation booking, and student registration forms.

## Development Commands

```bash
# Development
pnpm dev                   # Start dev server with Turbopack

# Database
pnpm db:setup             # Interactive setup to create .env file
pnpm db:generate          # Generate migrations from schema changes
pnpm db:migrate           # Run migrations
pnpm db:seed              # Seed database with test user (test@test.com / admin123)
pnpm db:studio            # Open Drizzle Studio GUI

# Build & Production
pnpm build                # Build for production
pnpm start                # Start production server

# Stripe (local development)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Architecture

### Route Structure

The app uses Next.js route groups for organization:

- **`(login)/`** - Unauthenticated routes (sign-in, sign-up)
- **`(dashboard)/`** - Public and authenticated routes
  - `/` - Marketing landing page
  - `/about` - About page
  - `/courses` - Courses listing
  - `/contact` - Contact page
  - `/registration` - Student registration form (integrates with WiseLMS)
  - `/sign-up` - User sign-up
  - `/dashboard` - Main dashboard with nested routes:
    - `/dashboard/general` - Team settings
    - `/dashboard/security` - Password management
    - `/dashboard/activity` - Activity logs
- **`admin/`** - Admin routes for managing courses

### Authentication Flow

Authentication is handled at two levels:

1. **Global Middleware** (`middleware.ts`): Protects all `/dashboard/*` routes, redirects to `/sign-in` if unauthenticated, and automatically refreshes JWT tokens on GET requests.

2. **Local Middleware** (`lib/auth/middleware.ts`): Provides higher-order functions for Server Actions:
   - `validatedAction()` - Validates Zod schemas
   - `validatedActionWithUser()` - Validates schemas + requires authenticated user
   - `withTeam()` - Requires authenticated user with team membership

Session data is stored as JWT in httpOnly cookies with 24-hour expiration.

### Database Schema & Relations

**Core Tables:**
- `users` - User accounts with soft deletes (`deletedAt`)
- `teams` - Team/workspace with Stripe integration fields
- `teamMembers` - Junction table linking users to teams with roles
- `activityLogs` - Audit log for user actions
- `invitations` - Team member invitations
- `courses` - Course catalog with WiseLMS integration (`wiseCourseId`)

**Key Patterns:**
- All queries for current user data go through `getUser()` which validates JWT and checks `deletedAt`
- `getTeamForUser()` returns team with all members in a single query using Drizzle relations
- Activity logging uses enum `ActivityType` for type-safe action names
- Course `includes` field is semicolon-separated string, parsed to array in queries

### WiseLMS Integration

**Purpose:** Third-party learning management system for course enrollment and student management.

**Key Components:**
- **API Client** (`lib/wiselms/api.ts`): Functions for enrolling students, fetching courses, managing classrooms
- **Webhook Handler** (`app/api/wiselms/webhook/route.ts`): Auto-enrolls/unenrolls students in Activities courses based on regular course enrollment
- **Configuration** (`lib/wiselms/config.ts`): Server-side only credentials (API key, namespace, institute ID)

**Integration Flow:**
1. Student fills out registration form on `/registration`
2. Form submits to Server Action which calls WiseLMS API to create student and enroll in course
3. WiseLMS webhook events trigger automatic enrollment in related Activities courses

**Environment Variables Required:**
```
WISELMS_API_HOST=api.wiseapp.live
WISELMS_NAMESPACE=aspireacademics
WISELMS_API_KEY=***
WISELMS_USER_ID=***
WISELMS_INSTITUTE_ID=***
WISELMS_USER_AGENT=VendorIntegrations/aspireacademics
WISELMS_WEBHOOK_SECRET=*** (optional)
```

### Stripe Integration

**Subscription Flow:**
1. User selects plan on `/pricing`
2. `createCheckoutSession()` creates Stripe Checkout with 14-day trial
3. Webhook at `/api/stripe/webhook` handles `customer.subscription.*` events
4. `handleSubscriptionChange()` updates team subscription status in database
5. Customer Portal accessible from dashboard for plan management

**Key Implementation Details:**
- Team stores `stripeCustomerId`, `stripeSubscriptionId`, `stripeProductId`
- Portal configuration is created on-demand if not exists
- Subscription statuses: `active`, `trialing`, `canceled`, `unpaid`

### Form Integrations

**Consultation Form** (`components/aspire/ConsultationForm/ConsultationForm.tsx`):
- Multi-step form with validation using react-hook-form + Zod
- Submits to three destinations in parallel: Pabbly (critical), External API (silent fail), Confirmation Email (silent fail)
- Opens Calendly popup on success
- GTM tracking on submission

**Smooth Scrolling** (`components/ui/smooth-scroll-link.tsx`):
- Custom component handling hash navigation (e.g., `/#form`)
- Works across page navigations (e.g., from `/about` to `/#form`)
- Used throughout site for "Book Free Trial" CTAs
- Fallback CSS `scroll-smooth` class on `<html>` element

**Calendly Integration:**
- Script loaded globally in `app/layout.tsx`
- Used for scheduling free consultations after form submission
- Prefills user data (name, email, custom answers)

### Data Fetching Patterns

This template uses Server Components for data fetching:
- `getUser()` reads session from cookies (server-side only)
- `getTeamForUser()` uses Drizzle relational queries for nested data
- `getCourses()` fetches all courses and parses semicolon-separated `includes` field
- No client-side SWR/React Query except for SWRConfig fallback in root layout

### Server Actions Pattern

Server Actions follow a consistent pattern:
1. Define Zod schema for validation
2. Wrap with `validatedActionWithUser()` or `validatedAction()`
3. Return `ActionState` object with `{ error?: string, success?: string }`
4. Use `useActionState` or `useForm` hook in components

Example:
```typescript
const schema = z.object({ name: z.string() });

export const updateName = validatedActionWithUser(
  schema,
  async (data, formData, user) => {
    // Implementation
    return { success: 'Name updated' };
  }
);
```

### Path Aliases

All imports use `@/` alias which maps to root directory:
```typescript
import { getUser } from '@/lib/db/queries';
import { Button } from '@/components/ui/button';
```

## Environment Variables

Required for development (use `pnpm db:setup` for interactive setup):
```
POSTGRES_URL=              # Postgres connection string
AUTH_SECRET=               # JWT signing secret (use: openssl rand -base64 32)
BASE_URL=                  # Application URL (http://localhost:3000 for dev)
STRIPE_SECRET_KEY=         # Stripe secret key
STRIPE_WEBHOOK_SECRET=     # Stripe webhook signing secret (from stripe CLI)
ADMIN_SECRET_KEY=          # Admin panel authentication key

# WiseLMS (required for registration forms)
WISELMS_API_HOST=          # WiseLMS API host
WISELMS_NAMESPACE=         # Your WiseLMS namespace
WISELMS_API_KEY=           # WiseLMS API key
WISELMS_USER_ID=           # WiseLMS user ID
WISELMS_INSTITUTE_ID=      # WiseLMS institute ID
WISELMS_USER_AGENT=        # User agent string
WISELMS_WEBHOOK_SECRET=    # Optional webhook authentication key

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=                 # Gmail address
SMTP_PASSWORD=             # Gmail app password (16-char)
SMTP_FROM_NAME=            # Sender name
SMTP_FROM_EMAIL=           # Sender email

# Optional
NEXT_PUBLIC_GTM_ID=        # Google Tag Manager ID (GTM-XXXXXXX)
NEXT_PUBLIC_CALENDLY_URL=  # Calendly booking URL
```

**Important Notes:**
- WiseLMS env vars are server-side only (no `NEXT_PUBLIC_` prefix)
- Email env vars are server-side only (no `NEXT_PUBLIC_` prefix)
- Gmail requires app-specific password (enable 2FA first)

## Common Patterns

**Adding a new authenticated route:**
1. Create under `app/(dashboard)/` to inherit auth layout
2. Use `getUser()` to access current user
3. Use `getTeamForUser()` for team data with members

**Adding a Server Action:**
1. Create in appropriate `actions.ts` file (e.g., `app/(dashboard)/actions/`)
2. Use `validatedActionWithUser()` for user-specific actions
3. Log important actions to `activityLogs` table
4. Return `ActionState` for client-side handling

**Database migrations:**
1. Modify `lib/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:migrate` to apply
4. Update seed data in `lib/db/seed.ts` if needed

**Adding activity logging:**
1. Add new action to `ActivityType` enum in `lib/db/schema.ts`
2. Insert to `activityLogs` table in Server Action
3. Logs automatically appear in `/dashboard/activity`

**WiseLMS API calls:**
1. Import functions from `lib/wiselms/api.ts`
2. All functions are async and return typed responses
3. Error handling is built-in with detailed error messages
4. Use in Server Actions only (requires server-side env vars)

## Tech Stack Notes

- **Next.js 15** enables Partial Prerendering and client segment caching
- **Drizzle ORM** - Type-safe SQL with relational queries
- **server-only** package prevents accidental client-side imports of server code
- **jose** library for JWT signing/verification
- **bcryptjs** for password hashing (10 rounds)
- **react-hook-form** with Zod for form validation
- **Leaflet** for interactive maps (location sections)
- **Framer Motion** for animations
- **Tailwind CSS 4** with custom configuration
