# NovarelStudio - AI Content Automation Platform

## Overview

NovarelStudio is an AI-powered content automation platform designed for Twitch and Kick streamers. The application automatically converts livestreams into viral short-form clips and distributes them across multiple social media platforms (TikTok, Instagram Reels, YouTube Shorts). The platform handles the entire pipeline: stream detection, recording, AI-powered moment detection, clip generation, and multi-platform publishing.

The product targets "stream-first creators" who treat their channels like professional studios, emphasizing automation and minimal manual intervention. The design draws inspiration from OnlyFans (aesthetic), Twitch/Kick (gamification), and Opus.pro/Vizard.ai (dashboard functionality).

## Recent Changes (November 24, 2025)

- Added login and signup functionality:
  - Created /login page with email and password form
  - Created /signup page with channel name, email, and password form
  - Updated all "Sign In"/"Log in" buttons to navigate to /login
  - Updated all "Get Started"/"Start Free" buttons to navigate to /signup
  - Forms include client-side validation and are ready for backend integration
  - All interactive elements have data-testid attributes for testing
  - Uses Button asChild pattern with wouter Link for proper navigation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript as the primary frontend framework
- Vite as the build tool and development server
- Two client implementations present: `client` (current) and `client-v2` (alternate version)
- Wouter for client-side routing (lightweight alternative to React Router)

**Page Routes**
- `/` - Home page (landing with hero, features, platform integration, dashboard preview, CTA, footer)
- `/how-it-works` - How It Works page explaining the platform's process
- `/showcase` - Showcase page with examples and success stories
- `/pricing` - Pricing page with plan tiers
- `/login` - Login page with authentication form (UI complete, ready for backend)
- `/signup` - Signup page with registration form (UI complete, ready for backend)

**UI Component Strategy**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design system
- Component aliases configured via `@/components`, `@/lib`, `@/hooks` paths
- Custom font integration: "Porcine Bosk" for gaming-style headlines, Inter for body text

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management
- Custom query client configuration with credential-based authentication
- No global state library; component-local state with useState/useEffect

**Design System**
- Custom color palette defined in CSS variables (HSL format)
- Gaming/streaming aesthetic with purple primary (`--primary: 263.4 70% 50.4%`) and neon green secondary (`--secondary: 142.1 70.6% 45.3%`)
- Dark theme by default with gradient backgrounds and blur effects
- Gamification elements: progress bars, level badges, live indicators

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- ESM module system (type: "module" in package.json)
- Two server entry points: `server/index.ts` and `server/index-v2.ts` (mirrors client setup)

**Development & Production Setup**
- Development: Vite middleware integration for HMR
- Production: Static file serving from built `dist/public` directory
- Request logging middleware capturing API performance metrics
- Raw body preservation for webhook verification

**API Structure**
- Routes registered in `server/routes.ts`
- API endpoints prefixed with `/api`
- Credential-based sessions for authentication (configured in fetch requests)

**Storage Layer**
- Interface-based storage abstraction (`IStorage` interface)
- Current implementation: In-memory storage (`MemStorage` class)
- Designed for easy swapping to persistent storage (database)
- CRUD operations for users (getUser, getUserByUsername, createUser)

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL
- Neon Database serverless driver (`@neondatabase/serverless`)
- Database schema defined in `shared/schema.ts`
- Migrations output to `./migrations` directory

**Schema Design**
- Users table with UUID primary keys (PostgreSQL `gen_random_uuid()`)
- Username/password authentication model
- Zod schema validation integrated via `drizzle-zod`

**Current State vs. Intended State**
- Database configuration exists but not actively used
- In-memory storage serves as placeholder
- Migration path: swap `MemStorage` for Drizzle-backed implementation

### Authentication & Authorization

**Current Implementation**
- Session-based authentication (connect-pg-simple for PostgreSQL sessions)
- Credentials included in fetch requests (`credentials: "include"`)
- Query client configured to handle 401 responses (unauthorized behavior options)

**User Model**
- Username and password fields
- UUID-based user identification
- Schema validation with Zod

### External Dependencies

**Third-Party Services**
- **Database**: Neon PostgreSQL (serverless)
- **Fonts**: Google Fonts (Inter, Teko, Anton, Bebas Neue, Space Grotesk)
- **Build Tools**: Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)

**Platform Integrations (Planned)**
- TikTok API for video publishing
- Instagram Reels API
- YouTube Shorts API
- Twitch/Kick streaming platform APIs for live detection

**UI Component Libraries**
- Radix UI (comprehensive primitive components)
- Class Variance Authority for component variants
- Tailwind CSS with PostCSS and Autoprefixer
- Embla Carousel for content showcases

**Monitoring & Development**
- Custom logging with formatted timestamps
- Replit-specific development tooling when `REPL_ID` is present
- Error handling with process exit on Vite errors

### Key Architectural Patterns

**Monorepo Structure**
- Shared types and schemas in `shared/` directory
- Client and server code separation with path aliases
- Dual client setup (v1 and v2) suggesting A/B testing or migration

**Type Safety**
- Strict TypeScript configuration
- Zod for runtime validation and type inference
- Drizzle's `$inferSelect` for type-safe database models

**Development Workflow**
- Separate dev scripts for v1 and v2 (`dev` and `dev:v2`)
- Port 5000 (default) and 5001 (v2) for parallel development
- Database push command for schema updates without migrations

**Asset Management**
- Static assets in `attached_assets/` directory
- Generated images for UI mockups and examples
- Vite alias configuration for `@assets` path