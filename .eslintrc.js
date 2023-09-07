module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb', 'airbnb-typescript'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    'no-console': 'off',
    'no-param-reassign': ['error', { props: false }],
    'max-len': ['error', { code: 150 }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['test/**'] }],
  },
};
