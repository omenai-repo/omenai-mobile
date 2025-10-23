# omenai-app

## Setup

### 1. Environment Variables
Create `.env` file in project root before running:

```bash
EXPO_PUBLIC_API_BASE=your_api_base_url
EXPO_PUBLIC_API_ORIGIN=your_api_origin
EXPO_PUBLIC_API_USER_AGENT=your_api_user_agent
EXPO_PUBLIC_API_AUTHORIZATION=your_api_key_here
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

**Note**: App will fail if environment variables are missing.
