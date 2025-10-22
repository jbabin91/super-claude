# TanStack Plugin Specification

## ADDED Requirements

### Requirement: Plugin Structure

The tanstack plugin SHALL contain five skills for TanStack ecosystem development.

#### Scenario: Plugin installation

- **WHEN** user installs tanstack plugin
- **THEN** make available:
  - start-wizard skill
  - query-helper skill
  - router-helper skill
  - form-helper skill
  - table-helper skill

### Requirement: TanStack Start Project Initialization

The start-wizard skill SHALL set up TanStack Start projects with best practices.

#### Scenario: New project setup

- **WHEN** user requests TanStack Start project
- **THEN** initialize with:
  - File-based routing structure
  - Server function templates
  - Query client configuration
  - Router configuration
  - Form integration patterns

#### Scenario: Existing project integration

- **WHEN** adding TanStack Start to existing project
- **THEN** detect existing structure
- **AND** suggest migration path
- **AND** avoid overwriting existing files

### Requirement: File-Based Routing Patterns

The start-wizard skill SHALL generate file-based routing structure.

#### Scenario: Route directory structure

- **WHEN** setting up routing
- **THEN** create:
  - `app/routes/` directory
  - `__root.tsx` layout
  - `index.tsx` home route
  - Example nested routes

### Requirement: Server Functions and RPC

The start-wizard skill SHALL set up server functions and RPC patterns.

#### Scenario: Server function template

- **WHEN** generating server functions
- **THEN** create:
  - Type-safe server function exports
  - RPC client configuration
  - Error handling patterns
  - Input validation with Zod

### Requirement: Query Key Organization

The query-helper skill SHALL provide query key organization patterns.

#### Scenario: Query key factory

- **WHEN** setting up queries
- **THEN** generate query key factory:

  ```typescript
  export const queryKeys = {
    users: {
      all: ['users'] as const,
      lists: () => [...queryKeys.users.all, 'list'] as const,
      list: (filters: string) => [...queryKeys.users.lists(), filters] as const,
      details: () => [...queryKeys.users.all, 'detail'] as const,
      detail: (id: number) => [...queryKeys.users.details(), id] as const,
    },
  };
  ```

### Requirement: Cache Invalidation Strategies

The query-helper skill SHALL provide cache invalidation patterns.

#### Scenario: Mutation with invalidation

- **WHEN** creating mutation
- **THEN** include invalidation:

  ```typescript
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
  ```

### Requirement: Optimistic Updates

The query-helper skill SHALL provide optimistic update patterns.

#### Scenario: Optimistic mutation

- **WHEN** creating mutation requiring optimistic updates
- **THEN** include:
  - onMutate for optimistic update
  - onError for rollback
  - onSettled for refetch

### Requirement: Route File Generation

The router-helper skill SHALL generate route files with loaders and actions.

#### Scenario: Basic route generation

- **WHEN** user requests new route
- **THEN** create route file with:
  - Route component
  - Loader function (if data needed)
  - Meta tags
  - Error boundaries

#### Scenario: Dynamic route generation

- **WHEN** generating dynamic route
- **THEN** include:
  - Route parameter types
  - Loader with parameter access
  - Type-safe parameter usage

### Requirement: Route Parameters and Search Params

The router-helper skill SHALL handle route and search parameters type-safely.

#### Scenario: Route parameters

- **WHEN** generating dynamic route
- **THEN** define parameter schema with Zod
- **AND** provide type-safe access

#### Scenario: Search parameters

- **WHEN** route needs search params
- **THEN** define search schema with Zod
- **AND** provide type-safe access

### Requirement: Form Generation with Zod

The form-helper skill SHALL generate forms with Zod validation.

#### Scenario: Form with validation

- **WHEN** user requests form
- **THEN** generate:
  - Zod schema for validation
  - TanStack Form setup
  - Field components
  - Error display
  - Submit handler

### Requirement: Field-Level Validation

The form-helper skill SHALL provide field-level validation patterns.

#### Scenario: Async field validation

- **WHEN** field requires async validation
- **THEN** include debounced validation
- **AND** loading states
- **AND** error messages

### Requirement: Server Action Integration

The form-helper skill SHALL integrate forms with server actions.

#### Scenario: Form with server action

- **WHEN** form submits to server
- **THEN** include:
  - Server action definition
  - Client-side optimistic update
  - Error handling
  - Success feedback

### Requirement: Table Configuration

The table-helper skill SHALL generate table configurations.

#### Scenario: Basic table setup

- **WHEN** user requests data table
- **THEN** generate:
  - Column definitions
  - Table instance setup
  - Filtering configuration
  - Sorting configuration
  - Pagination setup

### Requirement: Server-Side Data Integration

The table-helper skill SHALL integrate tables with server-side data.

#### Scenario: Server-side table

- **WHEN** table data comes from server
- **THEN** integrate with TanStack Query
- **AND** include:
  - Query with table state
  - Server-side filtering
  - Server-side sorting
  - Server-side pagination

### Requirement: Column Definitions

The table-helper skill SHALL generate type-safe column definitions.

#### Scenario: Column generation

- **WHEN** defining table columns
- **THEN** generate typed columns with:
  - Accessor functions
  - Header renderers
  - Cell renderers
  - Sorting configuration
  - Filtering configuration
