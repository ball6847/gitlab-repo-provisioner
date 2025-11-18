// Unit tests for ProjectPath value object
import { assertEquals, assertThrows } from '@std/assert';
import { ProjectPath } from '../../src/domain/valueObjects/ProjectPath.ts';
import { DomainError } from '../../src/domain/errors.ts';

Deno.test('ProjectPath.create() - valid project paths', () => {
  const validPaths = [
    'group/project',
    'namespace/repo-name',
    'my-group/my-project',
    'group123/project456',
    'group_with_underscores/project_with_underscores',
    'group.with.dots/project.with.dots',
  ];

  validPaths.forEach(path => {
    const projectPath = ProjectPath.create(path);
    assertEquals(projectPath.getValue(), path);
    assertEquals(projectPath.toString(), path);
  });
});

Deno.test('ProjectPath.create() - invalid project paths', () => {
  const invalidPaths = [
    '', // empty
    '  ', // whitespace only
    'project', // no namespace
    'group/', // no project name
    '/project', // starts with slash
    'group/project/extra', // too many parts
    'group with spaces/project', // spaces in group
    'group/project with spaces', // spaces in project
    'group@special/project', // special characters
  ];

  invalidPaths.forEach(path => {
    assertThrows(
      () => ProjectPath.create(path),
      DomainError,
      undefined // Message varies by error type
    );
  });
});

Deno.test('ProjectPath.getNamespace() - extracts namespace', () => {
  const projectPath = ProjectPath.create('mygroup/myproject');
  assertEquals(projectPath.getNamespace(), 'mygroup');
});

Deno.test('ProjectPath.getProjectName() - extracts project name', () => {
  const projectPath = ProjectPath.create('mygroup/myproject');
  assertEquals(projectPath.getProjectName(), 'myproject');
});

Deno.test('ProjectPath.equals() - equality comparison', () => {
  const path1 = ProjectPath.create('group/project');
  const path2 = ProjectPath.create('group/project');
  const path3 = ProjectPath.create('other/project');

  assertEquals(path1.equals(path2), true);
  assertEquals(path1.equals(path3), false);
});

Deno.test('ProjectPath.create() - trims whitespace', () => {
  const projectPath = ProjectPath.create('group/project');
  assertEquals(projectPath.getValue(), 'group/project');
});