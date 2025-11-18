# Agent Instructions

## Build/Test Commands
- `deno test` - Run all tests
- `deno test main_test.ts` - Run single test file
- `deno run --check main.ts` - Type check and run
- `deno lint` - Lint code
- `deno fmt` - Format code

## Code Style Guidelines
- **Language**: TypeScript with Deno runtime
- **Architecture**: Clean Architecture with domain/business logic separation
- **CLI Framework**: Use `@cliffy/command` for command-line interface
- **Error Handling**: Use `typescript-result` (Result.ok(), Result.wrap(), Result.error()) - try-catch forbidden
- **Environment**: Use `@std/dotenv` for environment variable management
- **Required Environment Variables**: `GITLAB_TOKEN` and `GITLAB_ENDPOINT` must be set via env
- **Control Flow**: Early-return/early-continue pattern preferred
- **Imports**: Use explicit imports with .ts extension
- **Naming**: camelCase for functions/variables, PascalCase for types/classes, snake_case for files/directories
- **Types**: Strict TypeScript with explicit return types
- **GitLab API**: Use `npm:gitlab` package for repository provisioning
- **Default Branch**: Set to 'develop' when available during repository setup
- **Async Operations**: Use `@std/async` for async utilities