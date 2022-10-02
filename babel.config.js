module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  // plugins: [
  //   ['@babel/plugin-proposal-decorators', { legacy: true }],
  //   ['@babel/plugin-proposal-class-properties'],
  // ],
}
