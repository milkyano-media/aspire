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
- **TutorBird** widget integration for consultation form bookings
- **Calendly** integration for scheduling consultations
- Custom smooth scrolling implementation

**Current Focus:** Marketing landing page with sections for courses, testimonials, locations, and consultation booking.

## Key Integrations

### TutorBird Widget
- Consultation form is handled by TutorBird's embedded widget
- Located in `components/aspire/ConsultationForm/ConsultationForm.tsx`
- Uses client-side script injection with ref-based container mounting
- Prevents duplicate rendering with `isInitialized` ref guard

### Calendly
- Script loaded globally in `app/layout.tsx`
- Used for scheduling free consultations after form submission
- Widget CSS loaded in layout head

### Smooth Scrolling
- Custom `SmoothScrollLink` component in `components/ui/smooth-scroll-link.tsx`
- Handles hash navigation (`/#form`) with smooth scroll behavior
- Works across page navigations (e.g., from `/about` to `/#form`)
- Used throughout the site for "Book Free Trial" CTAs
- Fallback CSS `scroll-smooth` class on `<html>` element

## Development Commands

```bash
# Development
npm run dev                 # Start dev server with Turbopack

# Database
npm run db:setup           # Interactive setup to create .env file
npm run db:generate        # Generate migrations from schema changes
npm run db:migrate         # Run migrations
npm run db:seed            # Seed database with test user (test@test.com / admin123)
npm run db:studio          # Open Drizzle Studio GUI

# Build & Production
npm run build              # Build for production
npm run start              # Start production server

# Stripe (local development)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Architecture

### Route Structure

The app uses Next.js route groups for organization:

- **`(login)/`** - Unauthenticated routes (sign-in, sign-up)
- **`(dashboard)/`** - Authenticated routes
  - `/` - Marketing landing page with Terminal component
  - `/pricing` - Pricing page with Stripe Checkout
  - `/dashboard` - Main dashboard with nested routes:
    - `/dashboard/general` - Team settings
    - `/dashboard/security` - Password management
    - `/dashboard/activity` - Activity logs

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

**Key Patterns:**
- All queries for current user data go through `getUser()` which validates JWT and checks `deletedAt`
- `getTeamForUser()` returns team with all members in a single query using Drizzle relations
- Activity logging uses enum `ActivityType` for type-safe action names

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

### Data Fetching Patterns

This template uses Server Components for data fetching:
- `getUser()` reads session from cookies (server-side only)
- `getTeamForUser()` uses Drizzle relational queries for nested data
- No client-side SWR/React Query - use Server Components and revalidation

### Server Actions Pattern

Server Actions follow a consistent pattern:
1. Define Zod schema for validation
2. Wrap with `validatedActionWithUser()` or `validatedAction()`
3. Return `ActionState` object with `{ error?: string, success?: string }`
4. Use `useActionState` hook in components for optimistic updates

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

Required for development (use `npm run db:setup` for interactive setup):
```
POSTGRES_URL=           # Postgres connection string
AUTH_SECRET=            # JWT signing secret (use: openssl rand -base64 32)
BASE_URL=               # Application URL (http://localhost:3000 for dev)
STRIPE_SECRET_KEY=      # Stripe secret key
STRIPE_WEBHOOK_SECRET=  # Stripe webhook signing secret (from stripe CLI)
```

## Common Patterns

**Adding a new authenticated route:**
1. Create under `app/(dashboard)/` to inherit auth layout
2. Use `getUser()` to access current user
3. Use `getTeamForUser()` for team data with members

**Adding a Server Action:**
1. Create in appropriate `actions.ts` file
2. Use `validatedActionWithUser()` for user-specific actions
3. Log important actions to `activityLogs` table
4. Return `ActionState` for client-side handling

**Database migrations:**
1. Modify `lib/db/schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply
4. Update seed data in `lib/db/seed.ts` if needed

**Adding activity logging:**
1. Add new action to `ActivityType` enum in `lib/db/schema.ts`
2. Insert to `activityLogs` table in Server Action
3. Logs automatically appear in `/dashboard/activity`

## Tech Stack Notes

- **Next.js 15** enables Partial Prerendering and client segment caching
- **Drizzle ORM** - Type-safe SQL with relational queries
- **server-only** package prevents accidental client-side imports of server code
- **jose** library for JWT signing/verification
- **bcryptjs** for password hashing (10 rounds)
