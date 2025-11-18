// Use case for synchronizing repository configurations
import { Repository } from "../../domain/entities/repository.ts";
import { RepositoryConfiguration } from "../../domain/entities/repository_configuration.ts";
import { IGitLabRepository } from "../../domain/repositories/gitlab_repository.ts";
import { BranchName } from "../../domain/valueobjects/branch_name.ts";
import { ProjectPath } from "../../domain/valueobjects/project_path.ts";
import { RepositoryConfigurationDto } from "../dto/repository_dto.ts";

export interface SyncResult {
  totalRepositories: number;
  updatedRepositories: number;
  skippedRepositories: number;
  errors: Array<{
    path: string;
    error: string;
  }>;
}

export class SyncRepositoriesUseCase {
  constructor(private readonly gitlabRepository: IGitLabRepository) {}

  async execute(config: RepositoryConfigurationDto): Promise<SyncResult> {
    const repositories = this.createDomainEntities(config);
    const configuration = new RepositoryConfiguration(repositories);

    // Validate configuration
    if (!configuration.hasUniquePaths()) {
      throw new Error("Configuration contains duplicate repository paths");
    }

    const result: SyncResult = {
      totalRepositories: configuration.getRepositoryCount(),
      updatedRepositories: 0,
      skippedRepositories: 0,
      errors: [],
    };

    // Process each repository
    for (const repository of configuration.getRepositories()) {
      try {
        const processed = await this.processRepository(repository);
        if (processed.updated) {
          result.updatedRepositories++;
        } else {
          result.skippedRepositories++;
        }
      } catch (error) {
        result.errors.push({
          path: repository.getFullPath(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return result;
  }

  private createDomainEntities(
    config: RepositoryConfigurationDto,
  ): Repository[] {
    return config.repositories.map((repoConfig) => {
      const path = ProjectPath.create(repoConfig.path);
      const defaultBranch = BranchName.create(repoConfig.defaultBranch);

      return new Repository({
        path,
        defaultBranch,
        description: repoConfig.description,
        visibility: repoConfig.visibility,
      });
    });
  }

  private async processRepository(
    repository: Repository,
  ): Promise<{ updated: boolean }> {
    const projectPath = repository.getFullPath();

    // Check if repository exists
    const existsResult = await this.gitlabRepository.exists(projectPath);
    if (!existsResult.success) {
      throw new Error(
        `Failed to check repository existence: ${existsResult.error?.message}`,
      );
    }

    if (!existsResult.data) {
      throw new Error(`Repository does not exist: ${projectPath}`);
    }

    // Get current default branch
    const branchResult = await this.gitlabRepository.getDefaultBranch(
      projectPath,
    );
    if (!branchResult.success || !branchResult.data) {
      throw new Error(
        `Failed to get default branch: ${branchResult.error?.message}`,
      );
    }

    const currentBranch = branchResult.data;
    const desiredBranch = repository.getDefaultBranch().getValue();

    // Check if update is needed
    if (!repository.needsUpdate(currentBranch)) {
      return { updated: false };
    }

    // Update default branch
    const updateResult = await this.gitlabRepository.updateDefaultBranch(
      projectPath,
      desiredBranch,
    );
    if (!updateResult.success) {
      throw new Error(
        `Failed to update default branch: ${updateResult.error?.message}`,
      );
    }

    return { updated: true };
  }
}
