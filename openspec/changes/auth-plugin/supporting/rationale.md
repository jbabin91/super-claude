# Auth Plugin Rationale

**Date:** 2025-10-22 (original brainstorm)
**Priority:** 🔴 Tier 1 - Build First

## Why Authentication Tools

Authentication is required for most applications and is complex to set up correctly. better-auth provides a modern, type-safe solution that integrates well with our stack.

### Tech Stack Context

**Auth:**

- Library: better-auth
- Database: Drizzle ORM (user/session tables)
- API: Hono/Elysia middleware
- Frontend: React hooks and components
- Validation: Zod

## Skills Breakdown

### better-auth-integrator

better-auth setup and integration.

**Features:**

- **Provider Setup:**
  - Email/password authentication
  - OAuth (Google, GitHub, etc.)
  - Multi-provider configuration
- **Integration:**
  - Hono/Elysia middleware
  - Protected route patterns
  - Session management
- **Database:**
  - Drizzle schema generation
  - User table setup
  - Session storage
- **Frontend:**
  - Auth hooks for React
  - Login/signup components
  - Protected route wrapper

**Example Usage:**

```txt
"Setup better-auth with Google OAuth"

1. Install better-auth
2. Configure Google provider
3. Generate Drizzle schema (users, sessions)
4. Create auth middleware
5. Add login/logout routes
6. Generate React hooks
```

**Integration Points:**

- better-auth
- Drizzle ORM
- Hono/Elysia
- React (auth context)

## Authentication Patterns

### Email/Password

- Secure password hashing
- Email verification
- Password reset flow
- Rate limiting

### OAuth Providers

- Google, GitHub, Discord, etc.
- Multiple providers per user
- Provider account linking
- Profile data sync

### Session Management

- Server-side sessions (Drizzle)
- Cookie-based auth
- Token refresh
- Session expiration

### Protected Routes

- Middleware-based auth check
- Role-based access control
- API route protection
- Frontend route guards

## Integration Patterns

### better-auth + Drizzle

- User table integration
- Session storage
- Automatic schema generation

### better-auth + Hono/Elysia

- Auth middleware
- Protected endpoints
- Session context in handlers

### better-auth + React

- Auth context provider
- Login/signup components
- Protected route wrappers
- useSession, useUser hooks

## Estimated Impact

**Time Saved:** 5-10 hours per project
**Why:** Auth setup is complex, required for most apps, easy to get wrong

## Related Tools

- **drizzle-maestro** - Database schema for auth tables
- **hono-api-builder** / **elysia-api-builder** - Auth middleware
- **component-generator** - Login/signup UI components

## Security Considerations

### Password Security

- bcrypt/argon2 hashing
- Salt generation
- Password strength requirements
- Rate limiting on auth endpoints

### Session Security

- HTTP-only cookies
- CSRF protection
- Session rotation
- Secure cookie flags

### OAuth Security

- PKCE flow
- State parameter validation
- Token storage
- Provider verification

## Provider Configuration

### Google OAuth

- Client ID/secret
- Redirect URIs
- Scopes (email, profile)
- Refresh tokens

### GitHub OAuth

- App registration
- Organization access
- Email privacy
- SSH keys (optional)

### Email/Password

- SMTP configuration
- Email templates
- Verification flow
- Password reset

## Environment Variables

```env
# better-auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (if using email/password)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Common Use Cases

1. **SaaS Application**
   - Email/password + Google OAuth
   - Role-based access (admin, user)
   - Team/organization support

2. **Developer Tool**
   - GitHub OAuth (primary)
   - CLI token generation
   - API key management

3. **Content Platform**
   - Social logins (Google, GitHub, Discord)
   - Profile customization
   - Activity tracking
