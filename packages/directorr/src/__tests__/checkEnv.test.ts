describe('checkEnv', () => {
  afterEach(jest.resetModules);

  it('normal env', () => {
    expect(() => require('../checkEnv')).not.toThrow();
  });
});
