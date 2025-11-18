// Value Object for GitLab project paths (namespace/project)
import { DomainError } from '../errors.ts';

export class ProjectPath {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ProjectPath {
    if (!value || value.trim().length === 0) {
      throw new DomainError('Project path cannot be empty');
    }

    // GitLab project path validation: namespace/project
    const parts = value.split('/');
    if (parts.length !== 2) {
      throw new DomainError(`Invalid project path format: ${value}. Expected format: namespace/project`);
    }

    const [namespace, project] = parts;
    
    if (!namespace || !project) {
      throw new DomainError(`Invalid project path: ${value}`);
    }

    // Validate namespace and project names
    const namePattern = /^[a-zA-Z0-9_.-]+$/;
    if (!namePattern.test(namespace) || !namePattern.test(project)) {
      throw new DomainError(`Invalid characters in project path: ${value}`);
    }

    return new ProjectPath(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  getNamespace(): string {
    return this.value.split('/')[0];
  }

  getProjectName(): string {
    return this.value.split('/')[1];
  }

  equals(other: ProjectPath): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}