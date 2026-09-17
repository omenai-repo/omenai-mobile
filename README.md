# Omenai Mobile App

## Project Structure

Omenai uses a layered architecture organized by artwork-marketplace domains.

```text
screens/       Route-level UI and navigation orchestration
screens/discovery/
                Home, catalog, search, collections, saved artworks, and editorials
screens/commerce/  Orders, checkout, purchases, payments, subscriptions, and payouts
screens/marketplace/
                Artist, gallery, event, roster, and marketplace organization flows
screens/account/  Profile, notifications, support, and account settings
components/    Shared UI used across screens or representing a shared concept
services/      HTTP, Appwrite, Stripe, Flutterwave, and other external IO
store/         Zustand state grouped by domain
hooks/         Reusable React behavior
features/      Cross-cutting feature logic without route components
lib/           Pure helpers, validation, storage, and domain logic
types/         Shared TypeScript contracts and global declarations
config/        Runtime clients and application configuration
constants/     Static registries and application constants
navigation/    Navigators, route configuration, and navigation UI
```

Use the matching `#` alias for cross-folder imports. Relative imports are only
for closely related files within the same folder. Shared modules must not import
from `screens/`, and screen-private UI stays under
`screens/<domain>/components/` until it becomes genuinely reusable.

Naming conventions:

- React screens and components use PascalCase.
- Hooks use camelCase beginning with `use`.
- Services, stores, utilities, and helpers use camelCase.
- Domain folders use camelCase and the same domain name across all layers.
- Raster and Lottie assets are accessed through their constants registries.

Run `yarn check:all` before submitting changes. The structure check prevents new
dependency-direction violations, deep parent-relative imports, legacy filename
patterns, service `.tsx` files without a UI purpose, and growth in files already
above the 300-line migration threshold.

The generated country/state dataset and legacy global declaration file are
excluded from the line-count rule because they are data and declaration
artifacts rather than maintainable application modules.

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Setup environment files
npm run setup:env

# Edit the generated files with your actual values
# .env.local - Development
# .env.staging - Staging  
# .env.production - Production
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Run Project
```bash
# Development
yarn start

# iOS
yarn ios

# Android
yarn android
```

## 🏗️ Build Commands

```bash
# Development build
npm run build:dev

# Staging build  
npm run build:staging

# Production build
npm run build:prod
```

## 🔐 Security

- All sensitive data is stored in environment files
- Environment files are gitignored and never committed
- Different configurations for each environment
- Easy secret rotation without code changes

**Note**: App will fail if environment variables are missing.
