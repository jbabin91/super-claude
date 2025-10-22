# API Plugin Specification

## ADDED Requirements

### Requirement: Plugin Structure

The api plugin SHALL contain skills for backend API development with Hono and Elysia.

#### Scenario: Plugin installation

- **WHEN** user installs api plugin
- **THEN** make available:
  - hono-api-builder skill (Tier 1)
  - elysia-api-builder skill (Tier 4, exploration)

### Requirement: Hono Endpoint Generation

The hono-api-builder skill SHALL generate type-safe API endpoints.

#### Scenario: Basic endpoint generation

- **WHEN** user requests API endpoint
- **THEN** generate:
  - Route handler with Hono context
  - Zod input validation schema
  - Type-safe response
  - Error handling
  - OpenAPI documentation comments

#### Scenario: CRUD endpoint generation

- **WHEN** user requests CRUD endpoints
- **THEN** generate all operations:
  - GET (list and detail)
  - POST (create)
  - PUT/PATCH (update)
  - DELETE (delete)
- **AND** include consistent error handling

### Requirement: OpenAPI Schema Generation

The hono-api-builder skill SHALL generate OpenAPI documentation.

#### Scenario: OpenAPI route documentation

- **WHEN** generating endpoint
- **THEN** include OpenAPI comments:

  ```typescript
  /**
   * @openapi
   * /api/users:
   *   get:
   *     summary: List users
   *     responses:
   *       200:
   *         description: Success
   */
  ```

#### Scenario: OpenAPI schema export

- **WHEN** project has multiple endpoints
- **THEN** provide pattern for OpenAPI schema aggregation
- **AND** schema export endpoint

### Requirement: RPC Pattern Support

The hono-api-builder skill SHALL support RPC patterns with Hono RPC.

#### Scenario: RPC route generation

- **WHEN** generating RPC endpoint
- **THEN** create:
  - Type-safe RPC route
  - Client type exports
  - Input/output validation
  - Error handling

#### Scenario: RPC client generation

- **WHEN** RPC routes exist
- **THEN** provide client setup:

  ```typescript
  import { hc } from 'hono/client';
  import type { AppType } from './server';

  const client = hc<AppType>('/api');
  ```

### Requirement: Zod Validation Middleware

The hono-api-builder skill SHALL integrate Zod validation.

#### Scenario: Input validation

- **WHEN** endpoint receives input
- **THEN** validate with Zod:

  ```typescript
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  });

  app.post('/users', zValidator('json', schema), async (c) => {
    const data = c.req.valid('json');
    // data is typed
  });
  ```

#### Scenario: Validation errors

- **WHEN** validation fails
- **THEN** return 400 with structured errors
- **AND** include field-level error messages

### Requirement: Error Handling Middleware

The hono-api-builder skill SHALL provide consistent error handling.

#### Scenario: Global error handler

- **WHEN** setting up Hono app
- **THEN** include error handling middleware:

  ```typescript
  app.onError((err, c) => {
    if (err instanceof ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: 'Internal Server Error' }, 500);
  });
  ```

#### Scenario: Custom error types

- **WHEN** application needs custom errors
- **THEN** provide error class templates
- **AND** appropriate HTTP status codes

### Requirement: CORS Configuration

The hono-api-builder skill SHALL configure CORS appropriately.

#### Scenario: CORS setup

- **WHEN** API serves frontend
- **THEN** include CORS middleware:

  ```typescript
  import { cors } from 'hono/cors';

  app.use(
    '/*',
    cors({
      origin: ['http://localhost:3000'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    }),
  );
  ```

### Requirement: Security Headers

The hono-api-builder skill SHALL include security headers.

#### Scenario: Security middleware

- **WHEN** setting up Hono app
- **THEN** include security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy
  - Strict-Transport-Security (for HTTPS)

### Requirement: Route Organization

The hono-api-builder skill SHALL organize routes by resource.

#### Scenario: Route file structure

- **WHEN** creating multiple endpoints
- **THEN** organize as:

  ```txt
  src/api/
  ├── routes/
  │   ├── users.ts
  │   ├── posts.ts
  │   └── auth.ts
  ├── middleware/
  │   ├── auth.ts
  │   └── validation.ts
  └── index.ts
  ```

### Requirement: Node.js Compatibility

The hono-api-builder skill SHALL ensure Node.js compatibility.

#### Scenario: Runtime detection

- **WHEN** generating Hono app
- **THEN** use Node.js-compatible adapters
- **AND** avoid Bun-specific features

### Requirement: Elysia Endpoint Generation

The elysia-api-builder skill SHALL generate Elysia endpoints.

#### Scenario: Basic Elysia endpoint

- **WHEN** user requests Elysia endpoint
- **THEN** generate:
  - Elysia route with type safety
  - Input validation
  - Response types
  - Error handling

#### Scenario: Bun optimizations

- **WHEN** using Elysia
- **THEN** leverage Bun-specific features:
  - Native fetch
  - Fast JSON parsing
  - Bun.file() for static assets

### Requirement: Pattern Parity

The elysia-api-builder skill SHALL maintain pattern parity with Hono.

#### Scenario: Similar patterns

- **WHEN** generating Elysia code
- **THEN** use similar patterns to Hono:
  - Route organization
  - Validation approach
  - Error handling
  - OpenAPI documentation
- **AND** note differences where applicable
