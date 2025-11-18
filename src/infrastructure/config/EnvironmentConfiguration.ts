// Environment configuration management
export interface EnvironmentConfig {
  gitlabToken: string;
  gitlabEndpoint: string;
}

export class EnvironmentConfiguration {
  private static instance: EnvironmentConfiguration;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): EnvironmentConfiguration {
    if (!EnvironmentConfiguration.instance) {
      EnvironmentConfiguration.instance = new EnvironmentConfiguration();
    }
    return EnvironmentConfiguration.instance;
  }

  private loadConfig(): EnvironmentConfig {
    const gitlabToken = Deno.env.get('GITLAB_TOKEN');
    const gitlabEndpoint = Deno.env.get('GITLAB_ENDPOINT') || 'https://gitlab.com';

    if (!gitlabToken) {
      throw new Error('GITLAB_TOKEN environment variable is required');
    }

    return {
      gitlabToken,
      gitlabEndpoint,
    };
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  getGitLabToken(): string {
    return this.config.gitlabToken;
  }

  getGitLabEndpoint(): string {
    return this.config.gitlabEndpoint;
  }
}