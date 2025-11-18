// Unit tests for YamlConfigurationParser
import { assertEquals, assertThrows } from '@std/assert';
import { YamlConfigurationParser } from '../../src/infrastructure/repositories/YamlConfigurationParser.ts';



Deno.test('YamlConfigurationParser - parses JSON-like YAML', () => {
  const parser = new YamlConfigurationParser();
  
  const yamlContent = JSON.stringify({
    repositories: [
      {
        path: 'group/project1',
        defaultBranch: 'main',
      },
    ],
  });

  const result = parser.parse(yamlContent);

  assertEquals(result.repositories.length, 1);
  assertEquals(result.repositories[0].path, 'group/project1');
  assertEquals(result.repositories[0].defaultBranch, 'main');
});

Deno.test('YamlConfigurationParser - handles missing repositories', () => {
  const parser = new YamlConfigurationParser();
  
  const yamlContent = '{"other": "data"}';

  assertThrows(
    () => parser.parse(yamlContent),
    Error,
    'Failed to parse YAML configuration'
  );
});

Deno.test('YamlConfigurationParser - handles invalid repository format', () => {
  const parser = new YamlConfigurationParser();
  
  const yamlContent = JSON.stringify({
    repositories: [
      {
        // Missing required fields
      },
    ],
  });

  assertThrows(
    () => parser.parse(yamlContent),
    Error,
    'Invalid repository configuration'
  );
});

Deno.test('YamlConfigurationParser - handles empty content', () => {
  const parser = new YamlConfigurationParser();
  
  assertThrows(
    () => parser.parse(''),
    Error,
    'Failed to parse YAML configuration'
  );
});

Deno.test('YamlConfigurationParser - handles basic YAML parsing', () => {
  const parser = new YamlConfigurationParser();
  
  const yamlContent = `
# This is a comment
repositories:
  # Another comment
  - path: group/project1
    defaultBranch: main
    
  - path: group/project2
    defaultBranch: develop
`;

  const result = parser.parse(yamlContent);

  assertEquals(result.repositories.length, 2);
  assertEquals(result.repositories[0].path, 'group/project1');
  assertEquals(result.repositories[1].path, 'group/project2');
});