module.exports = {
  env: {
    development: {
      presets: [
        '@babel/preset-typescript',
        // '@babel/preset-env',
        ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      plugins: [
        // Experimental
        '@babel/plugin-proposal-export-default-from',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
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
