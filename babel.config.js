module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true, // ✅ this must go inside the preset array
        },
      ],
    ],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          allowlist: [
            'EXPO_PUBLIC_API_BASE',
            'EXPO_PUBLIC_API_ORIGIN', 
            'EXPO_PUBLIC_API_USER_AGENT',
            'EXPO_PUBLIC_API_AUTHORIZATION'
          ],
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
