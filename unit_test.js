const randomizerCLI = require('./index.js');

describe('rom',() => {
  it('should load', () => {
    expect(randomizerCLI.Rom).not.toBeUndefined();
  });
})
