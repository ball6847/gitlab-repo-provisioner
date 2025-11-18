// YAML configuration parser
import { RepositoryConfigurationDto } from '../../application/dto/RepositoryDto.ts';

export class YamlConfigurationParser {
  parse(content: string): RepositoryConfigurationDto {
    try {
      // Using Deno's built-in YAML parser
      const data = this.parseYaml(content);
      
      if (!this.isValidConfiguration(data)) {
        throw new Error('Invalid configuration format');
      }

      return this.transformToDto(data);
    } catch (error) {
      throw new Error(`Failed to parse YAML configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseYaml(content: string): unknown {
    // For now, using a simple JSON-like parsing approach
    // In a real implementation, we would use a proper YAML parser
    try {
      // Try to parse as JSON first (YAML is a superset of JSON)
      return JSON.parse(content);
    } catch {
      // If JSON parsing fails, try to convert basic YAML to JSON
      return this.convertYamlToJson(content);
    }
  }

  private convertYamlToJson(yaml: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const lines = yaml.split('\n');
    let inRepositories = false;
    const repositories: unknown[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed === 'repositories:') {
        inRepositories = true;
        continue;
      }

      if (inRepositories && trimmed.startsWith('- ')) {
        const repoData = this.parseRepositoryItem(trimmed, lines, lines.indexOf(line));
        repositories.push(repoData);
      }
    }

    if (repositories.length > 0) {
      result.repositories = repositories;
    }

    return result;
  }

  private parseRepositoryItem(startLine: string, allLines: string[], startIndex: number): Record<string, unknown> {
    const repo: Record<string, unknown> = {};
    
    // Parse the first line (starts with "- ")
    const firstLine = startLine.substring(2).trim();
    if (firstLine) {
      this.parseKeyValue(firstLine, repo);
    }

    // Parse subsequent indented lines
    for (let i = startIndex + 1; i < allLines.length; i++) {
      const line = allLines[i];
      const trimmed = line.trim();
      
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (!line.startsWith('  ') && !line.startsWith('\t')) break; // Not indented, end of this repository
      
      this.parseKeyValue(trimmed, repo);
    }

    return repo;
  }

  private parseKeyValue(line: string, target: Record<string, unknown>): void {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      target[key] = value.substring(1, value.length - 1);
    } else if (value === '') {
      target[key] = undefined;
    } else {
      target[key] = value;
    }
  }

  private isValidConfiguration(data: unknown): data is { repositories: unknown[] } {
    return (
      typeof data === 'object' &&
      data !== null &&
      'repositories' in data &&
      Array.isArray((data as { repositories: unknown[] }).repositories)
    );
  }

  private transformToDto(data: { repositories: unknown[] }): RepositoryConfigurationDto {
    const repositories = data.repositories.map((repo, index) => {
      if (!this.isValidRepositoryConfig(repo)) {
        throw new Error(`Invalid repository configuration at index ${index}`);
      }

      const visibility = repo.visibility as 'private' | 'internal' | 'public' | undefined;
      
      return {
        path: repo.path,
        defaultBranch: repo.defaultBranch,
        description: repo.description,
        visibility: visibility && ['private', 'internal', 'public'].includes(visibility) ? visibility : undefined,
      };
    });

    return { repositories };
  }

  private isValidRepositoryConfig(repo: unknown): repo is {
    path: string;
    defaultBranch: string;
    description?: string;
    visibility?: string;
  } {
    return (
      typeof repo === 'object' &&
      repo !== null &&
      'path' in repo &&
      'defaultBranch' in repo &&
      typeof (repo as { path: unknown }).path === 'string' &&
      typeof (repo as { defaultBranch: unknown }).defaultBranch === 'string'
    );
  }
}