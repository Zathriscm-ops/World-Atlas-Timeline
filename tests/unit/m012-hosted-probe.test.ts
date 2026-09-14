import { expect, test } from 'vitest';

test('intentional hosted CI gate probe', () => {
  expect('blocked').toBe('passing');
});
