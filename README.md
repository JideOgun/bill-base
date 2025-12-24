# BillBase

## Overview

BillBase is a production-ready mobile invoicing application built with Expo, React Native, and TypeScript. It features a local-first architecture with SQLite for offline support and Supabase for cloud sync and backup.

## Tech Stack

- **Expo** (Managed Workflow)
- **React Native** with **TypeScript**
- **Expo Router** for file-based navigation
- **SQLite** (expo-sqlite) for local database
- **Supabase** for cloud sync and authentication
- **Zod** for schema validation
- **ESLint** & **Prettier** for code quality

## Project Structure

```
bill-base/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── invoice/       # Invoice management
│   │   ├── client/        # Client management
│   │   └── settings/      # App settings
│   └── _layout.tsx        # Root layout
├── src/
│   ├── db/                # Database layer
│   │   ├── schema/        # SQLite table schemas
│   │   └── migrations/    # Database migrations
│   ├── services/          # Business logic services
│   │   ├── auth/          # Authentication service
│   │   ├── supabase/      # Supabase client & storage
│   │   ├── pdf/           # PDF generation service
│   │   └── notifications/ # Push notifications
│   ├── sync/              # Cloud sync logic
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── assets/                # Images, fonts, etc.
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Run on iOS:**

   ```bash
   npm run ios
   ```

5. **Run on Android:**
   ```bash
   npm run android
   ```

## Database Schema

The app uses SQLite with the following tables:

- **business** - Business information
- **client** - Client/customer data
- **invoice** - Invoice records
- **line_item** - Invoice line items
- **payment** - Payment records
- **outbox** - Sync queue for offline changes

## Architecture Decisions

### Local-First Architecture

- **SQLite** is the source of truth for all data
- Changes are queued in the `outbox` table when offline
- **Supabase** syncs data bidirectionally when online
- Ensures app works seamlessly offline

### Type Safety

- **Strict TypeScript** enabled with no `any` types
- **Zod** schemas for runtime validation
- Comprehensive type definitions in `src/types/`

### Separation of Concerns

- **Database layer** (`src/db/`) - SQLite operations
- **Services** (`src/services/`) - Business logic
- **Sync layer** (`src/sync/`) - Cloud synchronization
- **UI layer** (`app/`) - React components and navigation

### Security

- **expo-secure-store** for secure credential storage
- Environment variables for sensitive configuration
- Supabase handles authentication and authorization

## Development

### Code Quality

- **ESLint** for linting: `npm run lint`
- **Prettier** for formatting: `npm run format`

### Type Checking

TypeScript strict mode is enabled. Run:

```bash
npx tsc --noEmit
```

## Environment Variables

Create a `.env` file in the root directory with:

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Bundle Identifiers

- **iOS**: `com.billbase.app`
- **Android**: `com.billbase.app`

## License

ISC
