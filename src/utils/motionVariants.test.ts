import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pageStaggerContainer,
  gridStaggerContainer,
  fadeUpItem,
  scaleUpItem,
  fadeInItem,
  headlineMaskContainer,
  headlineMaskLine,
  getMotionVariants,
  MOTION_EASINGS,
  MOTION_DURATIONS,
  MOTION_STAGGERS,
} from './motionVariants';

test('design tokens adhere to cinematic scale and timing budgets', () => {
  assert.ok(Array.isArray(MOTION_EASINGS.cinematic));
  assert.equal(MOTION_EASINGS.cinematic.length, 4);
  assert.ok(MOTION_DURATIONS.base <= 0.5);
  assert.ok(MOTION_DURATIONS.fast < MOTION_DURATIONS.base);
  assert.ok(MOTION_STAGGERS.cards <= 0.08);
});

test('pageStaggerContainer specifies sequential child staggering and beforeChildren coordination', () => {
  assert.equal(typeof pageStaggerContainer, 'object');
  assert.ok(pageStaggerContainer.visible);
  const visible = pageStaggerContainer.visible as Record<string, unknown>;
  const transition = visible.transition as Record<string, unknown>;
  assert.equal(transition.when, 'beforeChildren');
  assert.ok(typeof transition.staggerChildren === 'number' && (transition.staggerChildren as number) > 0);
  assert.ok(typeof transition.delayChildren === 'number');
});

test('gridStaggerContainer defines faster stagger timing for cards and list items', () => {
  const visible = gridStaggerContainer.visible as Record<string, unknown>;
  const transition = visible.transition as Record<string, unknown>;
  assert.ok(typeof transition.staggerChildren === 'number');
  assert.ok((transition.staggerChildren as number) <= 0.08);
});

test('fadeUpItem starts with hidden vertical displacement and animates to y=0', () => {
  const hidden = fadeUpItem.hidden as Record<string, unknown>;
  const visible = fadeUpItem.visible as Record<string, unknown>;
  assert.equal(hidden.opacity, 0);
  assert.ok(typeof hidden.y === 'number' && (hidden.y as number) > 0);
  assert.equal(visible.opacity, 1);
  assert.equal(visible.y, 0);
});

test('scaleUpItem starts below 1 scale and expands to full scale', () => {
  const hidden = scaleUpItem.hidden as Record<string, unknown>;
  const visible = scaleUpItem.visible as Record<string, unknown>;
  assert.equal(hidden.opacity, 0);
  assert.ok((hidden.scale as number) < 1.0);
  assert.equal(visible.scale, 1);
});

test('fadeInItem handles pure opacity transitions', () => {
  const hidden = fadeInItem.hidden as Record<string, unknown>;
  const visible = fadeInItem.visible as Record<string, unknown>;
  assert.equal(hidden.opacity, 0);
  assert.equal(visible.opacity, 1);
});

test('headlineMaskLine starts with masked upward displacement and arrives at 0%', () => {
  const hidden = headlineMaskLine.hidden as Record<string, unknown>;
  const visible = headlineMaskLine.visible as Record<string, unknown>;
  assert.equal(hidden.y, '105%');
  assert.equal(visible.y, '0%');
});

test('getMotionVariants(true) eliminates vertical and scale transforms for reduced motion', () => {
  const reduced = getMotionVariants(true);

  // Hidden states should not displace y or scale
  const pageHidden = reduced.pageContainer.hidden as Record<string, unknown>;
  assert.equal(pageHidden.y, 0);

  const fadeUpHidden = reduced.fadeUp.hidden as Record<string, unknown>;
  assert.equal(fadeUpHidden.y, 0);

  const scaleUpHidden = reduced.scaleUp.hidden as Record<string, unknown>;
  assert.equal(scaleUpHidden.y, 0);
  assert.equal(scaleUpHidden.scale, 1);

  const headlineHidden = reduced.headlineMaskLine.hidden as Record<string, unknown>;
  assert.equal(headlineHidden.y, 0);

  // Hover animations must be empty to avoid motion sickness
  assert.deepEqual(reduced.cardHover, {});
});
