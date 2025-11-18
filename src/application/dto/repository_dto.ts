// DTO for repository configuration input
export interface RepositoryConfigDto {
  path: string;
  defaultBranch: string;
  description?: string;
  visibility?: "private" | "internal" | "public";
}

export interface RepositoryConfigurationDto {
  repositories: RepositoryConfigDto[];
}
