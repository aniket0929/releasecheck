import test from 'node:test';
import assert from 'node:assert';
import { computeStatus } from '../controllers/releasesController.js';

test('computeStatus with empty steps array', () => {
  assert.strictEqual(computeStatus([]), 'planned');
});

test('computeStatus with all steps uncompleted', () => {
  assert.strictEqual(computeStatus([false, false, false]), 'planned');
});

test('computeStatus with all steps completed', () => {
  assert.strictEqual(computeStatus([true, true, true, true]), 'done');
});

test('computeStatus with partial steps completed', () => {
  assert.strictEqual(computeStatus([true, false, true]), 'ongoing');
});

test('computeStatus with undefined steps array', () => {
  assert.strictEqual(computeStatus(null), 'planned');
});
