const path = require('path')
const fs = require('fs')

module.exports = {
  ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.css.d.ts'],
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript', 'plugin:@typescript-eslint/recommended', 'plugin:promise/recommended', 'plugin:prettier/recommended', 'plugin:optimize-regex/recommended', 'plugin:unicorn/recommended', 'plugin:sonarjs/recommended', 'plugin:css-modules/recommended', 'plugin:workspaces/recommended', 'plugin:storybook/recommended'],
  plugins: [
    'react',
    'react-hooks',
    'import',
    'promise',
    'prettier',
    'optimize-regex',
    'unicorn',
    'sonarjs',
    'css-modules',
    'jsx-a11y',
    '@typescript-eslint',
  ],
  settings: {
    react: {
      version: '17',
    },
    'css-modules': {
      basePath: './',
    },
    // 'import/external-module-folders': ['node_modules'],
    // 'import/internal-regex': '^packages/',
  },
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    createDefaultProgram: true,
  },
  // parserOptions: {
  //   ecmaVersion: 2018,
  //   sourceType: 'module',
  //   ecmaFeatures: {
  //     jsx: true,
  //   },
  // },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     singleQuote: true,
    //     trailingComma: 'es5',
    //     printWidth: 100,
    //     arrowParens: 'avoid',
    //     parser: 'typescript',
    //   },
    // ],
    // semi: [2, 'always'],
    // '@typescript-eslint/indent': 0,
    // '@typescript-eslint/no-unused-vars': ['error'],
    // '@typescript-eslint/explicit-function-return-type': 0,
    // '@typescript-eslint/camelcase': 0,
    // 'no-empty-function': 0,
    // 'react/prop-types': 0,
    // '@typescript-eslint/no-empty-function': 0,
    'jsx-a11y/no-autofocus': 0,
    // '@typescript-eslint/explicit-module-boundary-types': 0,
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        bracketSameLine: false,
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
        trailingComma: 'all',
        printWidth: 100,
        arrowParens: 'avoid',
        tabWidth: 2,
        parser: 'typescript',
        endOfLine: 'auto',
      },
    ],
    'no-undef': 'error',
    'no-console': 'off',
    'consistent-return': 'off',
    'prefer-destructuring': 'warn',
    'guard-for-in': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-restricted-properties': [
      'off',
      {
        object: 'Math',
        property: 'pow',
      },
    ],
    'no-continue': 'warn',
    radix: ['error', 'as-needed'],
    // TODO: set allowed operators
    // 'no-restricted-syntax': 'off',
    'no-param-reassign': 'warn',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'if',
      },
      {
        blankLine: 'always',
        prev: 'if',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'for',
      },
      {
        blankLine: 'always',
        prev: 'for',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'try',
      },
      {
        blankLine: 'always',
        prev: 'try',
        next: '*',
      },
    ],
    'no-nested-ternary': 'off',
    'prefer-promise-reject-errors': 'warn',
    'no-octal-escape': 'warn',
    'arrow-body-style': ['error', 'as-needed'],
    'no-await-in-loop': 'off',
    'no-unused-vars': 'off',
    'max-classes-per-file': 'off',
    'no-void': 'off',
    'no-alert': 'off',
    'require-await': 'off',
    'no-floating-promises': 'off',

    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-object-as-default-parameter': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prefer-spread': 'warn',
    'unicorn/consistent-function-scoping': 'warn',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-string-slice': 'warn',
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-set-has': 'off',
    'unicorn/prefer-node-protocol': 'warn',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
        ignore: ['next-env.d.ts$', 'create-profile.tsx'],
      },
    ],
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-static-only-class': 'off',
    'unicorn/no-array-callback-reference': 'off',

    'sonarjs/cognitive-complexity': ['warn', 15],
    'sonarjs/no-duplicate-string': 'warn',
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/no-duplicated-branches': 'warn',
    'sonarjs/no-nested-template-literals': 'off',

    'import/prefer-default-export': 'off',
    'import/no-cycle': [
      'error',
      {
        maxDepth: 1,
      },
    ],
    // 'import/no-relative-parent-imports': 'warn',
    'import/extensions': ['off'],
    // 'import/no-extraneous-dependencies': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: [
          __dirname,
          ...fs
            .readdirSync(path.join(__dirname, 'packages'), { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(__dirname, 'packages', dirent.name)),
          ,
        ],
      },
    ],

    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
    'promise/no-return-wrap': [
      'error',
      {
        allowReject: true,
      },
    ],
    'promise/no-nesting': 'off',

    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enum',
        format: ['UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: '_',
        argsIgnorePattern: '_',
        args: 'after-used',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],

    'jest/no-standalone-expect': 'off',
    'jest/expect-expect': 'off',
    'jest/no-mocks-import': 'off',

    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never', propElementValues: 'always' },
    ],
    'react-hooks/exhaustive-deps': 'warn',

    'css-modules/no-unused-class': 'off',
  },
  // overrides: [
  //   {
  //     files: ['*.js'],
  //     rules: {
  //       '@typescript-eslint/no-var-requires': 'off',
  //     },
  //   },
  // ],
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
    // {
    //   files: ['webpack.*.js'],
    //   rules: {
    //     'import/no-extraneous-dependencies': 'off',
    //   },
    // },
    // {
    //   files: ['next-i18next.config.js'],
    //   rules: {
    //     'unicorn/filename-case': 'off',
    //   },
    // },
  ],
}
