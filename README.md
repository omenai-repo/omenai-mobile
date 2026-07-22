# Omenai Mobile App

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
