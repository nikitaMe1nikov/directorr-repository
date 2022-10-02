const isDevIE = process.env.BROWSER_ENV === 'ie'

module.exports = {
  env: {
    development: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            useBuiltIns: 'usage',
            corejs: { version: 3, proposal: true },
            targets: `${isDevIE ? 'ie >= 11, ' : ''}last 4 Chrome versions`,
          },
        ],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: false }],
        ['@babel/plugin-proposal-private-methods', { loose: false }],
        'react-refresh/babel',
      ],
    },
    production: {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    },
  },
}
