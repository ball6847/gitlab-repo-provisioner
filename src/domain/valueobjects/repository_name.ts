// Value Object for repository names with validation
import { DomainError } from "../errors.ts";

export class RepositoryName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): RepositoryName {
    if (!value || value.trim().length === 0) {
      throw new DomainError("Repository name cannot be empty");
    }

    // GitLab repository name validation
    if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
      throw new DomainError(`Invalid repository name format: ${value}`);
    }

    return new RepositoryName(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RepositoryName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
