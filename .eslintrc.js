module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    semi: 0,
    'max-len': ['error', {code: 80}],
    'no-console': 1,
    'react-hooks/exhaustive-deps': 1,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': ['warn'],
        'prettier/prettier': 'warn',
        'no-shadow': 'off',
        'no-undef': 'off',
      },
      extends: ['prettier'],
    },
  ],
}
