// Repository interface following Clean Architecture - defines the contract for repository operations
import { Repository } from '../entities/Repository.ts';

export interface RepositoryNotFoundError {
  type: 'RepositoryNotFoundError';
  message: string;
  projectPath: string;
}

export interface GitLabApiError {
  type: 'GitLabApiError';
  message: string;
  statusCode?: number;
}

export type RepositoryError = RepositoryNotFoundError | GitLabApiError;

export interface IGitLabRepository {
  // Check if a repository exists
  exists(projectPath: string): Promise<{ success: boolean; data?: boolean; error?: GitLabApiError }>;
  
  // Get the current default branch of a repository
  getDefaultBranch(projectPath: string): Promise<{ success: boolean; data?: string; error?: RepositoryError }>;
  
  // Update the default branch of a repository
  updateDefaultBranch(projectPath: string, branch: string): Promise<{ success: boolean; error?: GitLabApiError }>;
  
  // Get repository details
  getRepository(projectPath: string): Promise<{ success: boolean; data?: Repository; error?: RepositoryError }>;
}