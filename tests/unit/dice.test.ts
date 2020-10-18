import { Roll } from '@app/dice';

describe('Dice', () => {
  test('rolling a D6', () => {
    expect(Roll.d6()).toBeLessThan(7);
  });
});
