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

## Configuration

### Environment Setup

Create a `.env` file in the project root:
```
GITLAB_TOKEN=your_gitlab_access_token_here
```

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
```

## Architecture

This project follows Clean Architecture principles with:
- Domain layer for business logic
- Infrastructure layer for external services (GitLab API)
- Application layer for use cases
- Explicit error handling without try-catch

## How It Works

1. **Load Configuration**: Reads repository settings from YAML file
2. **Authenticate**: Uses `GITLAB_TOKEN` from environment
3. **Sync Repositories**: For each repository in config:
   - Verifies repository exists
   - Updates default branch to specified value
   - Reports success/failure for each operation

## Command Line Interface

```bash
# Main command - sync repositories
main.ts sync --config <path-to-yml>

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

## License

MIT