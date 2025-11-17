# Memory Reconstruction Assistant

## Overview

Memory Reconstruction Assistant is a compassionate web application designed for dementia caregivers. The platform enables caregivers to create personalized memory sessions, build comprehensive patient profiles, and maintain therapeutic routines that bring comfort and connection to patients with dementia. The application emphasizes emotional warmth, therapeutic simplicity, and accessibility through a touch-first mobile interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for global state (AuthContext, PatientContext, SessionContext)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom therapeutic design system
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

**Design System**:
- Soft, warm color palette with pastel tones optimized for therapeutic use
- Touch-first design with minimum 48px touch targets
- Inter font family for readability
- Generous spacing using Tailwind's 4px-based scale
- Card-based layouts with rounded corners (rounded-xl, rounded-2xl)
- Bottom navigation pattern for mobile-first access

**Key Pages**:
- Onboarding flow (Splash, Welcome, Login, Signup, Patient Setup)
- Dashboard (Home) with patient overview and quick actions
- Memory Builder with categorized memory management
- Session Generator for creating therapeutic audio sessions
- Schedule management for session planning
- Emergency calm session access
- Settings and profile management

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Build Tool**: esbuild for server bundling, Vite for client bundling
- **Development**: tsx for TypeScript execution in development

**API Design**:
- RESTful API structure with `/api/*` endpoints
- JSON-based request/response communication
- Route organization through centralized `registerRoutes` function
- Request logging middleware for debugging
- Session-based authentication (localStorage on client)

**Data Storage Strategy**:
- In-memory storage implementation via `IStorage` interface
- UUID-based primary keys using `crypto.randomUUID()`
- Designed for easy migration to PostgreSQL with Drizzle ORM
- Schema defined in shared directory for type safety across client/server

**Database Schema (Prepared for PostgreSQL)**:
- **users**: Authentication and caregiver profiles
- **patients**: Dementia patient profiles with stage tracking
- **memories**: Categorized memory entries with media support
- **people**: Significant people in patient's life
- **places**: Important locations with memories
- **sessions**: Generated therapeutic audio sessions
- **schedules**: Recurring session scheduling
- **feedback**: Session effectiveness tracking

### External Dependencies

**Third-Party UI Libraries**:
- Radix UI: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Lucide React: Icon system
- Embla Carousel: Touch-friendly carousels
- date-fns: Date formatting and manipulation
- cmdk: Command palette functionality

**Database & ORM**:
- Drizzle ORM: Type-safe SQL query builder
- Drizzle Zod: Schema validation integration
- @neondatabase/serverless: Neon PostgreSQL driver (configured but not actively used)
- connect-pg-simple: PostgreSQL session store

**Development Tools**:
- Vite: Frontend build tool and dev server
- Replit plugins: Runtime error overlay, cartographer, dev banner
- PostCSS with Autoprefixer: CSS processing
- TypeScript: Type safety across full stack

**State & Data Management**:
- TanStack Query: Server state synchronization with caching
- React Hook Form: Form state management
- Zod: Runtime schema validation
- @hookform/resolvers: Form validation integration

**Styling**:
- Tailwind CSS: Utility-first styling
- class-variance-authority: Component variant management
- tailwind-merge & clsx: Conditional class name handling

**Key Architectural Decisions**:

1. **Shared Schema Pattern**: Type definitions and validation schemas are shared between client and server in `/shared` directory, ensuring type safety and reducing duplication.

2. **Storage Abstraction**: `IStorage` interface allows swapping between in-memory and PostgreSQL implementations without changing application logic.

3. **Context-Based Global State**: Instead of Redux or similar, React Context API manages authentication, current patient, and active session state for simplicity.

4. **Mobile-First Design**: Fixed bottom navigation, large touch targets, and simplified screens prioritize mobile/tablet usage for caregivers.

5. **Therapeutic Design Constraints**: Soft colors, generous spacing, single-action screens, and emotional warmth guide all UI decisions to reduce caregiver stress.

6. **Monorepo Structure**: Client and server code coexist with shared types, enabling full-stack type safety and simplified deployment.