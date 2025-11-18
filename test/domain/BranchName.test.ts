// Unit tests for BranchName value object
import { assertEquals, assertThrows } from '@std/assert';
import { BranchName } from '../../src/domain/valueObjects/BranchName.ts';
import { InvalidBranchNameError } from '../../src/domain/errors.ts';

Deno.test('BranchName.create() - valid branch names', () => {
  const validNames = [
    'main',
    'develop',
    'feature/new-feature',
    'bugfix/issue-123',
    'release/v1.0.0',
    'hotfix/critical-bug',
  ];

  validNames.forEach(name => {
    const branchName = BranchName.create(name);
    assertEquals(branchName.getValue(), name);
    assertEquals(branchName.toString(), name);
  });
});

Deno.test('BranchName.create() - invalid branch names', () => {
  const invalidNames = [
    '', // empty
    'feature..branch', // double dots
    'feature~branch', // tilde
    'feature^branch', // caret
    'feature:branch', // colon
    'feature?branch', // question mark
    'feature*branch', // asterisk
    'feature[branch]', // brackets
    'feature\\branch', // backslash
    'feature|branch', // pipe
    '/feature', // starts with slash
    'feature/', // ends with slash
    'feature.lock', // ends with .lock
    'feature@{branch}', // contains @{
  ];

  invalidNames.forEach(name => {
    assertThrows(
      () => BranchName.create(name),
      InvalidBranchNameError,
      `Invalid branch name: ${name}`
    );
  });
});

Deno.test('BranchName.equals() - equality comparison', () => {
  const name1 = BranchName.create('main');
  const name2 = BranchName.create('main');
  const name3 = BranchName.create('develop');

  assertEquals(name1.equals(name2), true);
  assertEquals(name1.equals(name3), false);
});

Deno.test('BranchName.create() - trims whitespace', () => {
  const branchName = BranchName.create('  main  ');
  assertEquals(branchName.getValue(), 'main');
});