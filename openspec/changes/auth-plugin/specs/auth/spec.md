# Auth Plugin Specification

## ADDED Requirements

### Requirement: Plugin Structure

The auth plugin SHALL contain better-auth skill for authentication.

#### Scenario: Plugin installation

- **WHEN** user installs auth plugin
- **THEN** make available better-auth skill

### Requirement: Better-Auth Configuration

The better-auth skill SHALL generate better-auth configuration.

#### Scenario: Basic configuration

- **WHEN** setting up authentication
- **THEN** generate better-auth config:

  ```typescript
  import { betterAuth } from 'better-auth';
  import { drizzleAdapter } from 'better-auth/adapters/drizzle';

  export const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
    },
  });
  ```

### Requirement: Authentication Provider Setup

The better-auth skill SHALL configure authentication providers.

#### Scenario: Email/password provider

- **WHEN** enabling email authentication
- **THEN** configure:
  - Email validation
  - Password hashing
  - Password requirements

#### Scenario: OAuth provider setup

- **WHEN** adding OAuth provider (Google, GitHub, etc.)
- **THEN** include:
  - Provider configuration
  - Callback URL setup
  - Environment variable setup
  - Scope configuration

#### Scenario: Multiple providers

- **WHEN** configuring multiple providers
- **THEN** allow account linking
- **AND** handle provider conflicts

### Requirement: Drizzle Schema Generation

The better-auth skill SHALL generate Drizzle schemas for auth tables.

#### Scenario: Auth table generation

- **WHEN** setting up better-auth
- **THEN** generate schemas for:
  - users table (id, email, name, emailVerified, image, createdAt, updatedAt)
  - sessions table (id, userId, expiresAt, ipAddress, userAgent)
  - accounts table (id, userId, provider, providerAccountId, accessToken, refreshToken)
  - verificationTokens table (identifier, token, expires)

#### Scenario: Schema extension

- **WHEN** adding custom user fields
- **THEN** extend user table
- **AND** maintain better-auth compatibility

### Requirement: Hono Middleware Integration

The better-auth skill SHALL integrate auth with Hono.

#### Scenario: Auth middleware

- **WHEN** protecting routes
- **THEN** provide middleware:

  ```typescript
  import { getSession } from 'better-auth/hono';

  app.use('/api/protected/*', async (c, next) => {
    const session = await getSession(c);
    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    c.set('user', session.user);
    await next();
  });
  ```

### Requirement: Session Management

The better-auth skill SHALL handle session management.

#### Scenario: Session creation

- **WHEN** user logs in
- **THEN** create session with:
  - Secure session token
  - Expiration time
  - IP address tracking
  - User agent tracking

#### Scenario: Session validation

- **WHEN** validating session
- **THEN** check:
  - Token validity
  - Expiration
  - User exists
  - Session not revoked

#### Scenario: Session expiration

- **WHEN** session expires
- **THEN** require re-authentication
- **AND** clear session data

### Requirement: Protected Route Patterns

The better-auth skill SHALL provide protected route patterns.

#### Scenario: API route protection

- **WHEN** protecting API routes
- **THEN** provide middleware pattern
- **AND** type-safe user access in handler

#### Scenario: Frontend route protection

- **WHEN** protecting frontend routes (TanStack Router)
- **THEN** provide route guard pattern:

  ```typescript
  export const Route = createFileRoute('/dashboard')({
    beforeLoad: async ({ context }) => {
      const session = await context.auth.getSession();
      if (!session) {
        throw redirect({ to: '/login' });
      }
    },
  });
  ```

### Requirement: Frontend Auth Hooks

The better-auth skill SHALL provide React hooks for auth.

#### Scenario: useAuth hook

- **WHEN** accessing auth in components
- **THEN** provide hook:

  ```typescript
  const { user, session, signIn, signOut, signUp } = useAuth();
  ```

#### Scenario: useSession hook

- **WHEN** checking session status
- **THEN** provide hook with loading state

### Requirement: Type-Safe Auth Context

The better-auth skill SHALL provide type-safe auth context.

#### Scenario: Auth context typing

- **WHEN** using auth in application
- **THEN** export types:
  - User type
  - Session type
  - Auth client type

### Requirement: Password Management

The better-auth skill SHALL handle password operations.

#### Scenario: Password reset

- **WHEN** user requests password reset
- **THEN** provide pattern for:
  - Reset token generation
  - Email sending
  - Token validation
  - Password update

#### Scenario: Password requirements

- **WHEN** setting passwords
- **THEN** enforce:
  - Minimum length (8 characters)
  - Complexity requirements (optional)
  - No common passwords

### Requirement: Email Verification

The better-auth skill SHALL support email verification.

#### Scenario: Verification email

- **WHEN** user signs up
- **THEN** send verification email
- **AND** prevent login until verified (optional)

#### Scenario: Email verification flow

- **WHEN** user clicks verification link
- **THEN** validate token
- **AND** mark email as verified
- **AND** create session (optional)

### Requirement: Security Best Practices

The better-auth skill SHALL include security patterns.

#### Scenario: Rate limiting

- **WHEN** authentication endpoints exposed
- **THEN** suggest rate limiting patterns

#### Scenario: CSRF protection

- **WHEN** using session cookies
- **THEN** include CSRF token validation

#### Scenario: Secure cookie configuration

- **WHEN** setting session cookies
- **THEN** configure:
  - httpOnly: true
  - secure: true (production)
  - sameSite: 'lax' or 'strict'

### Requirement: Account Management

The better-auth skill SHALL provide account management patterns.

#### Scenario: Update profile

- **WHEN** user updates profile
- **THEN** provide pattern for:
  - Name update
  - Email update (with verification)
  - Avatar upload

#### Scenario: Delete account

- **WHEN** user deletes account
- **THEN** include:
  - Confirmation pattern
  - Data cleanup
  - Session revocation
