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

## 🔧 Environment Configuration

The app uses environment variables for secure configuration. All sensitive data is stored in environment files and never committed to version control.

### Required Environment Variables

```bash
# Environment
EXPO_PUBLIC_ENV=development

# API URLs
EXPO_PUBLIC_URL_DEVELOPMENT=http://localhost:3000
EXPO_PUBLIC_URL_PRODUCTION=https://omenai-web.vercel.app

# API Configuration
EXPO_PUBLIC_API_BASE=your_api_base_url
EXPO_PUBLIC_API_STAGING_BASE=your_staging_api_base_url
EXPO_PUBLIC_API_ORIGIN=your_api_origin
EXPO_PUBLIC_API_USER_AGENT=your_api_user_agent
EXPO_PUBLIC_API_AUTHORIZATION=your_api_authorization

# Authentication
EXPO_PUBLIC_AUTH_SECRET=your_auth_secret_here

# Database
EXPO_PUBLIC_MONGODB_PASSWORD=your_mongodb_password_here

# Redis
EXPO_PUBLIC_UPSTASH_REDIS_REST_URL=your_redis_url_here
EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# Appwrite Configuration
EXPO_PUBLIC_APPWRITE_CLIENT_ID=your_appwrite_client_id
EXPO_PUBLIC_APPWRITE_BUCKET_ID=your_appwrite_bucket_id
EXPO_PUBLIC_APPWRITE_EDITORIAL_BUCKET_ID=your_editorial_bucket_id
EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID=your_editorial_database_id
EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID=your_editorial_collection_id
EXPO_PUBLIC_APPWRITE_PROMOTIONAL_BUCKET_ID=your_promotional_bucket_id
EXPO_PUBLIC_APPWRITE_LOGO_BUCKET_ID=your_logo_bucket_id
EXPO_PUBLIC_APPWRITE_DOCUMENTATION_BUCKET_ID=your_documentation_bucket_id
EXPO_PUBLIC_APPWRITE_UPLOAD_KEY=your_upload_key_here

# Email Configuration
EXPO_PUBLIC_GMAIL_ADDRESS=your_gmail_address
EXPO_PUBLIC_GMAIL_APP_PASS=your_gmail_app_password
EXPO_PUBLIC_RESEND_API_KEY=your_resend_api_key

# Payment Configuration (Flutterwave)
EXPO_PUBLIC_FLW_TEST_PUBLIC_KEY=your_flutterwave_test_public_key
EXPO_PUBLIC_FLW_TEST_SECRET_KEY=your_flutterwave_test_secret_key
EXPO_PUBLIC_FLW_TEST_ENCRYPTION_KEY=your_flutterwave_test_encryption_key
EXPO_PUBLIC_FLW_PAYMENT_PLAN_ID=your_payment_plan_id
EXPO_PUBLIC_FLW_SECRET_HASH=your_secret_hash

# Payment Configuration (Stripe)
EXPO_PUBLIC_STRIPE_SK=your_stripe_secret_key
EXPO_PUBLIC_STRIPE_PK=your_stripe_public_key

# Deep Links
EXPO_PUBLIC_DEEPLINK_DEVELOPMENT=exp://172.20.10.2:8081
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
