# BillBase Architecture

## Overview

BillBase follows a **local-first architecture** pattern, ensuring the app works seamlessly offline while providing cloud sync capabilities when online.

## Key Architectural Decisions

### 1. Local-First with SQLite

**Decision**: Use SQLite as the primary data store with Supabase for cloud sync.

**Rationale**:
- Ensures app works completely offline
- Fast local queries without network latency
- Better user experience with instant data access
- Reduces cloud costs and API rate limits

**Implementation**:
- All CRUD operations write to SQLite first
- Changes are queued in the `outbox` table for sync
- Cloud sync happens in the background

### 2. Outbox Pattern for Sync

**Decision**: Use an outbox table to queue local changes for cloud sync.

**Rationale**:
- Reliable sync even if app crashes during sync
- Handles offline scenarios gracefully
- Ensures no data loss
- Supports conflict resolution

**Flow**:
1. User creates/updates/deletes a record
2. Change is written to SQLite
3. Change is queued in `outbox` table
4. Background sync process picks up outbox items
5. Once synced, `syncedAt` timestamp is set

### 3. Type Safety First

**Decision**: Strict TypeScript with no `any` types and Zod for runtime validation.

**Rationale**:
- Catch errors at compile time
- Better IDE autocomplete and refactoring
- Runtime validation ensures data integrity
- Self-documenting code through types

### 4. Separation of Concerns

**Decision**: Clear separation between database, services, sync, and UI layers.

**Rationale**:
- Easier to test individual layers
- Better code organization and maintainability
- Allows for incremental feature development
- Clear boundaries for future refactoring

**Layers**:
- **Database Layer** (`src/db/`): SQLite schema and queries
- **Service Layer** (`src/services/`): Business logic (auth, PDF, notifications)
- **Sync Layer** (`src/sync/`): Cloud synchronization logic
- **UI Layer** (`app/`): React components and navigation

### 5. Expo Router for Navigation

**Decision**: Use Expo Router's file-based routing.

**Rationale**:
- Type-safe navigation with typed routes
- File-based routing is intuitive
- Built-in deep linking support
- Matches web development patterns

### 6. Secure Storage for Credentials

**Decision**: Use expo-secure-store for Supabase auth tokens.

**Rationale**:
- Tokens are encrypted at rest
- Follows security best practices
- Required for production apps
- Supabase SDK supports custom storage adapters

## Database Schema

### Tables

1. **business** - Stores business information
   - Primary key: `id`
   - Tracks sync status with `syncedAt`

2. **client** - Client/customer records
   - Foreign key: `businessId`
   - Tracks sync status

3. **invoice** - Invoice records
   - Foreign keys: `businessId`, `clientId`
   - Status enum: draft, sent, paid, overdue, cancelled

4. **line_item** - Invoice line items
   - Foreign key: `invoiceId` (CASCADE delete)
   - Calculated totals

5. **payment** - Payment records
   - Foreign key: `invoiceId`
   - Payment method enum

6. **outbox** - Sync queue
   - Operations: create, update, delete
   - JSON data payload
   - Tracks sync status

## Sync Strategy

### Bidirectional Sync

**To Cloud** (`syncToCloud`):
1. Query `outbox` for unsynced records
2. Process each record based on operation type
3. Update Supabase tables
4. Mark as synced in outbox

**From Cloud** (`syncFromCloud`):
1. Get authenticated user
2. Query Supabase for records updated since last sync
3. Upsert records into SQLite
4. Update `syncedAt` timestamps

### Conflict Resolution

Current strategy: **Last write wins**
- Cloud data overwrites local on sync
- Future: Implement conflict resolution UI

## Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **Secure Storage**: Auth tokens stored in expo-secure-store
3. **Supabase RLS**: Row-level security policies on Supabase tables
4. **Type Safety**: Prevents injection attacks through typed queries

## Future Enhancements

1. **Conflict Resolution**: UI for resolving sync conflicts
2. **Incremental Sync**: Only sync changed fields
3. **Background Sync**: Automatic periodic sync
4. **Offline Queue UI**: Show pending sync items
5. **Data Export**: Export to CSV/PDF
6. **Multi-tenant**: Support multiple businesses per user

