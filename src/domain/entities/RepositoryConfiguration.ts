// Configuration aggregate for repository provisioning
import { Repository } from '../entities/Repository.ts';

export class RepositoryConfiguration {
  private readonly repositories: Repository[];
  private readonly timestamp: Date;

  constructor(repositories: Repository[]) {
    this.repositories = repositories;
    this.timestamp = new Date();
  }

  getRepositories(): Repository[] {
    return [...this.repositories];
  }

  getRepositoryByPath(path: string): Repository | undefined {
    return this.repositories.find(repo => repo.getFullPath() === path);
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getRepositoryCount(): number {
    return this.repositories.length;
  }

  // Business rule: Validate that all repositories have unique paths
  hasUniquePaths(): boolean {
    const paths = this.repositories.map(repo => repo.getFullPath());
    const uniquePaths = new Set(paths);
    return paths.length === uniquePaths.size;
  }

  // Get all unique namespaces
  getUniqueNamespaces(): string[] {
    const namespaces = this.repositories.map(repo => repo.getNamespace());
    return [...new Set(namespaces)];
  }
}