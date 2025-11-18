// Domain errors following Clean Architecture principles
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class InvalidRepositoryNameError extends DomainError {
  constructor(name: string) {
    super(`Invalid repository name: ${name}`);
    this.name = "InvalidRepositoryNameError";
  }
}

export class InvalidBranchNameError extends DomainError {
  constructor(branch: string) {
    super(`Invalid branch name: ${branch}`);
    this.name = "InvalidBranchNameError";
  }
}

export class RepositoryNotFoundError extends DomainError {
  constructor(projectPath: string) {
    super(`Repository not found: ${projectPath}`);
    this.name = "RepositoryNotFoundError";
  }
}
