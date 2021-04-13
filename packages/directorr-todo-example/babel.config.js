module.exports = {
  env: {
    development: {
      presets: [
        ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 } }],
        ['@babel/preset-react'],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        'react-refresh/babel',
      ],
    },
    production: {
      presets: ['@babel/preset-typescript', '@babel/preset-env', '@babel/preset-react'],
    },
  },
};
