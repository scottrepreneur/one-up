module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'prettier',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        // TODO turn some of these back on?
        'no-console': 'off',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],
        'jsx-quotes': ['error', 'prefer-single'],
        'no-use-before-define': 'off',
        'no-param-reassign': [2, { props: false }],
        'max-len': 'warn',
        'global-require': 0,
        'import/no-dynamic-require': 'off',
        'import/no-unresolved': 'off',

        // REACT
        'react/jsx-filename-extension': [
          2,
          { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        ],
        'react/require-default-props': 0,
        'react/no-unused-prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',

        // TS
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  ],
  rules: {
    'no-use-before-define': 'off',
    'no-param-reassign': [2, { props: false }],
    'no-nested-ternary': 'off',
    'max-len': 'warn',
    'global-require': 0,
    'prettier/prettier': 'error',
    'comma-dangle': 'off',
    'import/no-dynamic-require': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  env: { jest: true, browser: true, node: true },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {
        path: ['src'],
        alwaysTryTypes: true,
      },
    },
  },
};
