module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:css-modules/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jsx-a11y', 'react', 'react-hooks', 'css-modules'],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
    'css-modules': {
      basePath: './',
    },
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
        arrowParens: 'avoid',
        parser: 'typescript',
      },
    ],
    semi: [2, 'always'],
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 0,
    'no-empty-function': 0,
    'react/prop-types': 0,
    '@typescript-eslint/no-empty-function': 0,
    'jsx-a11y/no-autofocus': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
