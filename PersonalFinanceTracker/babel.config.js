module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '@/core': './src/core',
          '@/data': './src/data',
          '@/features': './src/features',
          '@/ui': './src/ui',
          '@/screens': './src/screens',
          '@/navigation': './src/navigation',
          '@/hooks': './src/hooks',
          '@/utils': './src/utils',
          '@/types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
