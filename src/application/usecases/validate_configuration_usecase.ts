// Use case for validating repository configuration
import { RepositoryConfigurationDto } from "../dto/repository_dto.ts";
import { BranchName } from "../../domain/valueobjects/branch_name.ts";
import { ProjectPath } from "../../domain/valueobjects/project_path.ts";

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ValidateConfigurationUseCase {
  execute(config: RepositoryConfigurationDto): ValidationResult {
    const errors: ValidationError[] = [];

    if (!config.repositories || !Array.isArray(config.repositories)) {
      errors.push({
        field: "repositories",
        message: "Repositories must be an array",
      });
      return { isValid: false, errors };
    }

    if (config.repositories.length === 0) {
      errors.push({
        field: "repositories",
        message: "At least one repository must be specified",
      });
    }

    // Track paths to detect duplicates
    const paths = new Set<string>();

    config.repositories.forEach((repo, index) => {
      // Validate path
      if (!repo.path) {
        errors.push({
          field: `repositories[${index}].path`,
          message: "Path is required",
        });
      } else {
        try {
          ProjectPath.create(repo.path);

          // Check for duplicates
          if (paths.has(repo.path)) {
            errors.push({
              field: `repositories[${index}].path`,
              message: `Duplicate path: ${repo.path}`,
              value: repo.path,
            });
          }
          paths.add(repo.path);
        } catch (error) {
          errors.push({
            field: `repositories[${index}].path`,
            message: error instanceof Error
              ? error.message
              : "Invalid path format",
            value: repo.path,
          });
        }
      }

      // Validate default branch
      if (!repo.defaultBranch) {
        errors.push({
          field: `repositories[${index}].defaultBranch`,
          message: "Default branch is required",
        });
      } else {
        try {
          BranchName.create(repo.defaultBranch);
        } catch (error) {
          errors.push({
            field: `repositories[${index}].defaultBranch`,
            message: error instanceof Error
              ? error.message
              : "Invalid branch name",
            value: repo.defaultBranch,
          });
        }
      }

      // Validate visibility if provided
      if (
        repo.visibility &&
        !["private", "internal", "public"].includes(repo.visibility)
      ) {
        errors.push({
          field: `repositories[${index}].visibility`,
          message: "Visibility must be one of: private, internal, public",
          value: repo.visibility,
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
