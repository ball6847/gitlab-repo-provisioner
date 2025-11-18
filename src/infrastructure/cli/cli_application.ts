// Main CLI application using Cliffy
import { Command } from "@cliffy/command";
import { SyncRepositoriesUseCase } from "../../application/usecases/sync_repositories_usecase.ts";
import { ValidateConfigurationUseCase } from "../../application/usecases/validate_configuration_usecase.ts";
import { YamlConfigurationParser } from "../repositories/yaml_configuration_parser.ts";
import { GitLabApiRepository } from "../repositories/gitlab_api_repository.ts";
import { EnvironmentConfiguration } from "../config/environment_configuration.ts";
import { load } from "@std/dotenv";

export class CliApplication {
  private syncUseCase: SyncRepositoriesUseCase;
  private validateUseCase: ValidateConfigurationUseCase;
  private yamlParser: YamlConfigurationParser;

  constructor() {
    this.syncUseCase = new SyncRepositoriesUseCase(new GitLabApiRepository());
    this.validateUseCase = new ValidateConfigurationUseCase();
    this.yamlParser = new YamlConfigurationParser();
  }

  async run(): Promise<void> {
    await this.loadEnvironment();

    const program = new Command()
      .name("gitlab-repo-provisioner")
      .description(
        "GitLab Repository Provisioner - Sync repository configurations",
      )
      .version("1.0.0")
      .action(() => {
        console.log("GitLab Repository Provisioner");
        console.log("Use --help to see available commands");
      });

    // Sync command
    program
      .command("sync")
      .description("Synchronize repository configurations from YAML file")
      .option("-c, --config <path>", "Path to YAML configuration file")
      .option(
        "-d, --dry-run",
        "Show what would be changed without making changes",
      )
      .action(async (options: { config?: string; dryRun?: boolean }) => {
        try {
          const configPath = options.config ?? "repositories.yml";
          const dryRun = Boolean(options.dryRun);
          await this.handleSync(configPath, dryRun);
        } catch (error) {
          console.error(
            "Error:",
            error instanceof Error ? error.message : String(error),
          );
          Deno.exit(1);
        }
      });

    // Validate command
    program
      .command("validate")
      .description("Validate YAML configuration file")
      .option("-c, --config <path>", "Path to YAML configuration file")
      .action(async (options: { config?: string }) => {
        try {
          const configPath = options.config ?? "repositories.yml";
          await this.handleValidate(configPath);
        } catch (error) {
          console.error(
            "Error:",
            error instanceof Error ? error.message : String(error),
          );
          Deno.exit(1);
        }
      });

    await program.parse(Deno.args);
  }

  private async loadEnvironment(): Promise<void> {
    try {
      // Try to load from .env file
      await load({ export: true });
    } catch {
      // If .env file doesn't exist, continue with environment variables
    }

    // Initialize configuration (this will validate required variables)
    EnvironmentConfiguration.getInstance();
  }

  private async handleSync(configPath: string, dryRun: boolean): Promise<void> {
    console.log(`🔄 Syncing repository configurations from ${configPath}`);

    if (dryRun) {
      console.log("🔍 DRY RUN MODE - No changes will be made");
    }

    // Read configuration file
    const configContent = await Deno.readTextFile(configPath);
    const config = this.yamlParser.parse(configContent);

    // Validate configuration
    const validationResult = this.validateUseCase.execute(config);
    if (!validationResult.isValid) {
      console.error("❌ Configuration validation failed:");
      validationResult.errors.forEach((error) => {
        console.error(`  - ${error.field}: ${error.message}`);
      });
      Deno.exit(1);
    }

    console.log("✅ Configuration validated successfully");

    if (dryRun) {
      console.log("📋 Would process the following repositories:");
      config.repositories.forEach(
        (repo: { path: string; defaultBranch: string }) => {
          console.log(
            `  - ${repo.path} (default branch: ${repo.defaultBranch})`,
          );
        },
      );
      return;
    }

    // Execute sync
    console.log("🚀 Starting synchronization...");
    const result = await this.syncUseCase.execute(config);

    // Report results
    console.log("\n📊 Sync Results:");
    console.log(`  Total repositories: ${result.totalRepositories}`);
    console.log(`  Updated repositories: ${result.updatedRepositories}`);
    console.log(`  Skipped repositories: ${result.skippedRepositories}`);

    if (result.errors.length > 0) {
      console.error("\n❌ Errors:");
      result.errors.forEach((error: { path: string; error: string }) => {
        console.error(`  - ${error.path}: ${error.error}`);
      });
      Deno.exit(1);
    }

    console.log("\n✅ Synchronization completed successfully");
  }

  private async handleValidate(configPath: string): Promise<void> {
    console.log(`🔍 Validating configuration file: ${configPath}`);

    // Read configuration file
    const configContent = await Deno.readTextFile(configPath);
    const config = this.yamlParser.parse(configContent);

    // Validate configuration
    const result = this.validateUseCase.execute(config);

    if (result.isValid) {
      console.log("✅ Configuration is valid");
      console.log(`📊 Found ${config.repositories.length} repositories`);

      // Show summary of repositories
      const namespaces = new Set(
        config.repositories.map((repo: { path: string }) =>
          repo.path.split("/")[0]
        ),
      );
      console.log(`🏢 Found ${namespaces.size} unique namespaces`);
    } else {
      console.error("❌ Configuration validation failed:");
      result.errors.forEach((error: { field: string; message: string }) => {
        console.error(`  - ${error.field}: ${error.message}`);
      });
      Deno.exit(1);
    }
  }
}
