#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

const envTemplate = `# Environment Configuration
EXPO_PUBLIC_ENV=development

# API URLs
EXPO_PUBLIC_URL_DEVELOPMENT=http://localhost:3000
EXPO_PUBLIC_URL_PRODUCTION=https://omenai-web.vercel.app

# API Configuration
EXPO_PUBLIC_API_BASE=your_api_base_url
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
`;

const environments = ['local', 'staging', 'production'];

environments.forEach(env => {
  const filename = `.env.${env}`;
  const filepath = path.join(process.cwd(), filename);
  
  if (!fs.existsSync(filepath)) {
    const content = envTemplate.replace('EXPO_PUBLIC_ENV=development', `EXPO_PUBLIC_ENV=${env === 'local' ? 'development' : env}`);
    fs.writeFileSync(filepath, content);
    console.log(`✅ Created ${filename}`);
  } else {
    console.log(`⚠️  ${filename} already exists, skipping...`);
  }
});

console.log('\n🎉 Environment setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Edit .env.local with your development values');
console.log('2. Edit .env.staging with your staging values');
console.log('3. Edit .env.production with your production values');
console.log('4. Pleaseeeeeeeee!!!!!! Never commit these files to version control!');
