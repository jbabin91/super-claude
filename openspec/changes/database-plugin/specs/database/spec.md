# Database Plugin Specification

## ADDED Requirements

### Requirement: Plugin Structure

The database plugin SHALL contain Drizzle ORM skill for database development.

#### Scenario: Plugin installation

- **WHEN** user installs database plugin
- **THEN** make available drizzle-maestro skill

### Requirement: Schema Generation

The drizzle-maestro skill SHALL generate type-safe database schemas.

#### Scenario: Basic table schema

- **WHEN** user requests table schema
- **THEN** generate Drizzle schema:

  ```typescript
  import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });
  ```

#### Scenario: Schema with relations

- **WHEN** defining related tables
- **THEN** include relations:

  ```typescript
  export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
  }));
  ```

### Requirement: Migration Management

The drizzle-maestro skill SHALL provide migration generation and execution.

#### Scenario: Generate migration

- **WHEN** schema changes
- **THEN** generate migration file
- **AND** include SQL for changes
- **AND** provide rollback information

#### Scenario: Migration execution

- **WHEN** running migrations
- **THEN** provide patterns for:
  - Migration execution
  - Rollback procedures
  - Migration status tracking

### Requirement: Database Adapter Support

The drizzle-maestro skill SHALL support multiple database adapters.

#### Scenario: PostgreSQL setup

- **WHEN** using PostgreSQL
- **THEN** configure:

  ```typescript
  import { drizzle } from 'drizzle-orm/postgres-js';
  import postgres from 'postgres';

  const client = postgres(connectionString);
  const db = drizzle(client);
  ```

#### Scenario: SQLite setup

- **WHEN** using SQLite
- **THEN** configure with better-sqlite3 or libsql

#### Scenario: Turso setup

- **WHEN** using Turso
- **THEN** configure with @libsql/client

### Requirement: Type-Safe Queries

The drizzle-maestro skill SHALL generate type-safe query patterns.

#### Scenario: Select query

- **WHEN** querying data
- **THEN** use type-safe select:

  ```typescript
  const result = await db.select().from(users).where(eq(users.id, 1));
  // result is typed
  ```

#### Scenario: Insert query

- **WHEN** inserting data
- **THEN** use type-safe insert with validation

#### Scenario: Update query

- **WHEN** updating data
- **THEN** use type-safe update with partial types

### Requirement: Relational Queries

The drizzle-maestro skill SHALL support relational query patterns.

#### Scenario: Query with relations

- **WHEN** querying related data
- **THEN** use relational queries:

  ```typescript
  const result = await db.query.users.findMany({
    with: {
      posts: true,
    },
  });
  ```

#### Scenario: Nested relations

- **WHEN** querying nested relations
- **THEN** support deep nesting
- **AND** maintain type safety

### Requirement: Connection Pooling

The drizzle-maestro skill SHALL provide connection pooling patterns.

#### Scenario: PostgreSQL pooling

- **WHEN** setting up PostgreSQL
- **THEN** configure connection pool:
  - Min/max connections
  - Idle timeout
  - Connection timeout

#### Scenario: Connection management

- **WHEN** handling connections
- **THEN** include:
  - Graceful shutdown
  - Error handling
  - Connection retry logic

### Requirement: Better-Auth Integration

The drizzle-maestro skill SHALL integrate with better-auth schemas.

#### Scenario: Auth schema generation

- **WHEN** using better-auth
- **THEN** generate compatible Drizzle schemas:
  - User table
  - Session table
  - Account table (for OAuth)

#### Scenario: Auth schema extension

- **WHEN** extending auth user model
- **THEN** maintain better-auth compatibility
- **AND** include custom fields

### Requirement: Query Helpers

The drizzle-maestro skill SHALL provide common query helper patterns.

#### Scenario: Pagination helper

- **WHEN** implementing pagination
- **THEN** provide helper:

  ```typescript
  export async function paginate<T>(
    query: any,
    page: number,
    pageSize: number,
  ) {
    const offset = (page - 1) * pageSize;
    return query.limit(pageSize).offset(offset);
  }
  ```

#### Scenario: Search helper

- **WHEN** implementing search
- **THEN** provide search patterns with SQL operators

### Requirement: Transaction Support

The drizzle-maestro skill SHALL support database transactions.

#### Scenario: Transaction pattern

- **WHEN** operations need atomicity
- **THEN** use transaction:

  ```typescript
  await db.transaction(async (tx) => {
    await tx.insert(users).values({ name: 'John' });
    await tx.insert(posts).values({ userId: 1, title: 'Hello' });
  });
  ```

#### Scenario: Transaction rollback

- **WHEN** transaction fails
- **THEN** automatically rollback
- **AND** propagate error

### Requirement: Schema Organization

The drizzle-maestro skill SHALL organize schemas by domain.

#### Scenario: Schema file structure

- **WHEN** creating schemas
- **THEN** organize as:

  ```txt
  src/db/
  ├── schema/
  │   ├── users.ts
  │   ├── posts.ts
  │   └── auth.ts
  ├── migrations/
  ├── queries/
  └── index.ts
  ```
