# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Development**: `pnpm dev` (uses Turbopack for fast development)
- **Build**: `pnpm build`
- **Start**: `pnpm start`
- **Linting**: `pnpm lint`
- **Testing**: `pnpm test` (uses Node.js built-in test runner)

## Project Architecture

This is a **medical calculator tools collection** built with modern TypeScript/React stack:

### Tech Stack
- Next.js 15 (App Router not used - uses Pages Router)
- React 19 with TypeScript
- Tailwind CSS 4 with shadcn/ui components
- Zod for validation + React Hook Form
- pnpm as package manager

### Key Directory Structure
- `pages/` - Next.js pages (Pages Router, not App Router)
  - `pages/api/calculators/` - API endpoints for calculations
  - `pages/calculators/` - Calculator UI pages
- `components/ui/` - Reusable shadcn/ui components
- `commons/` - Shared components (PrintButton, PrintModal)
- `lib/` - Utilities and validation schemas
- `types/` - TypeScript type definitions
- `resources/` - String constants and resources

### Key Patterns

**Calculator Implementation Pattern:**
1. Frontend page in `pages/calculators/[name].tsx`
2. API endpoint in `pages/api/calculators/[name].ts`
3. Types in `types/calculator.ts`
4. Validation schemas in `lib/schemas.ts`

**Form Handling:**
- Uses React Hook Form + Zod resolver
- All forms validate on client and server side
- API responses include detailed error messages

**UI Components:**
- All components are TypeScript (.tsx)
- Uses shadcn/ui with Tailwind CSS
- Follows consistent card-based layout pattern
- Print functionality available via `PrintButton` component

### Path Aliases
- `@/*` maps to project root
- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/resources/*` → `./resources/*`
- `@/types/*` → `./types/*`

### Current Features
- **BMI Calculator** with multiple formula support (Traditional, Trefethen, Prime, Reciprocal, Geometric)
- **BSA Calculator** with 5 medical formulas (Du Bois, Mosteller, Haycock, Boyd, Gehan-George)
- **Creatinine Clearance Calculator** with eGFR formulas (CKD-EPI 2021/2009, MDRD, Cockcroft-Gault) and CKD staging
- Print functionality for all calculators
- Responsive design with Tailwind CSS

### Development Notes
- Uses pnpm workspaces and strict TypeScript
- All strings externalized to `resources/strings.ts` (except new calculator strings)
- Consistent error handling across API endpoints
- Form validation both client-side and server-side
- Medical calculators follow consistent patterns with comprehensive validation
- All formulas implement peer-reviewed medical standards
- Include appropriate medical disclaimers and clinical context
- do not run pnpm build by default. only when reqested to not break the dev server