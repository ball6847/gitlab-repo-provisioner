# GitLab Repository Provisioner

A Deno-based tool that configures existing GitLab repositories with preferred settings. Reads repository configurations from YAML file and applies settings one-by-one.

## Features

- 🚀 Configures existing GitLab repositories
- 📋 YAML-based repository configuration
- 🎯 Sets default branch per repository configuration
- 🔐 Secure GitLab token handling via environment variables
- 🛡️ Type-safe error handling with `typescript-result`
- 🏗️ Clean Architecture with domain/business logic separation

## Prerequisites

- [Deno](https://deno.land/) runtime installed
- GitLab access token with repository permissions
- Existing GitLab repositories to configure
- Environment variables: `GITLAB_TOKEN` and `GITLAB_ENDPOINT` must be set

## Configuration

### Environment Setup

Create a `.env` file in the project root with required environment variables:

```
GITLAB_TOKEN=your_gitlab_access_token_here
GITLAB_ENDPOINT=https://gitlab.com/api/v4  # or your GitLab instance URL
```

**Required Environment Variables:**
- `GITLAB_TOKEN` - Your GitLab personal access token
- `GITLAB_ENDPOINT` - GitLab API endpoint (defaults to https://gitlab.com/api/v4 if not set)

### Repository Configuration

Create a `repositories.yml` file:
```yaml
repositories:
  - name: "my-project"
    default_branch: "develop"
  - name: "another-repo"
    default_branch: "main"
  - name: "legacy-app"
    default_branch: "master"
```

## Usage

```bash
# Sync repositories with configuration
deno run --allow-net --allow-env --allow-read main.ts sync --config repositories.yml

# Get help
deno run --allow-net --allow-env --allow-read main.ts --help
deno run --allow-net --allow-env --allow-read main.ts sync --help

# Development mode with auto-reload
deno task dev
```

## Development

```bash
# Run tests
deno test

# Run specific test file
deno test main_test.ts

# Type check and run
deno run --check main.ts

# Lint code
deno lint

# Format code
deno fmt

# Example usage
deno run --allow-net --allow-env --allow-read main.ts sync --config repositories.yml
```

## Architecture

This project follows Clean Architecture principles with:
- **Domain layer**: Business logic for repository configuration
- **Infrastructure layer**: GitLab API client and YAML configuration reader
- **Application layer**: Sync use case orchestration
- **CLI layer**: Command-line interface built with `@cliffy/command`
- **Configuration**: YAML-based repository settings
- **Environment**: Secure token management with `@std/dotenv`
- **Error Handling**: Functional error handling with `typescript-result`
- **Async Operations**: Enhanced with `@std/async` utilities

## How It Works

1. **Load Configuration**: Reads repository settings from YAML file
2. **Authenticate**: Uses `GITLAB_TOKEN` from environment
3. **Sync Repositories**: For each repository in config:
   - Verifies repository exists
   - Updates default branch to specified value
   - Reports success/failure for each operation

## Command Line Interface

Built with `@cliffy/command` for robust CLI experience:

```bash
# Main command - sync repositories
main.ts sync --config <path-to-yml>

# Get help
main.ts --help
main.ts sync --help

# Required permissions:
# --allow-net     : GitLab API access
# --allow-env     : Environment variable access
# --allow-read    : YAML file reading
```

## Error Handling

Uses `npm:typescript-result` for functional error handling:
- `Result.ok()` for successful operations
- `Result.error()` for failures
- `Result.wrap()` for safe execution

## Dependencies

Key dependencies added via `deno add`:
- `@cliffy/command` - Command-line interface framework
- `@std/dotenv` - Environment variable management
- `@std/async` - Async utilities
- `typescript-result` - Functional error handling
- `npm:gitlab` - GitLab API client

## Requirements (Temporary PRD)

- ✅ Read repository configurations from YAML file
- ✅ Accept config file path via command line argument (`--config`)
- ✅ Load `GITLAB_TOKEN` from environment (dotenv support)
- ✅ Expose single `sync` command
- ✅ Set default branch for existing repositories only
- ✅ Process repositories one-by-one from YAML list
- ✅ Report success/failure for each repository
- ✅ Do not create repositories - only configure existing ones

## Example Workflow

1. Create `.env` with your GitLab token
2. Create `repositories.yml` with your repo configurations
3. Run: `deno run --allow-net --allow-env --allow-read main.ts sync --config repositories.yml`
4. Tool will update default branches for all listed repositories

## License

MIT