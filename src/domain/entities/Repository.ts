// Domain entity representing a GitLab repository configuration
import { BranchName } from "../valueobjects/branch_name.ts";
import { ProjectPath } from "../valueobjects/project_path.ts";

export interface RepositoryConfigProps {
  path: ProjectPath;
  defaultBranch: BranchName;
  description?: string;
  visibility?: "private" | "internal" | "public";
}

export class Repository {
  private readonly path: ProjectPath;
  private readonly defaultBranch: BranchName;
  private readonly description?: string;
  private readonly visibility: "private" | "internal" | "public";

  constructor(props: RepositoryConfigProps) {
    this.path = props.path;
    this.defaultBranch = props.defaultBranch;
    this.description = props.description;
    this.visibility = props.visibility || "private";
  }

  getPath(): ProjectPath {
    return this.path;
  }

  getDefaultBranch(): BranchName {
    return this.defaultBranch;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getVisibility(): "private" | "internal" | "public" {
    return this.visibility;
  }

  // Business logic: Check if this repository needs to be updated
  needsUpdate(currentDefaultBranch: string): boolean {
    return this.defaultBranch.getValue() !== currentDefaultBranch;
  }

  // Get the full project path for GitLab API
  getFullPath(): string {
    return this.path.getValue();
  }

  // Get namespace for GitLab API
  getNamespace(): string {
    return this.path.getNamespace();
  }

  // Get project name for GitLab API
  getProjectName(): string {
    return this.path.getProjectName();
  }
}
