# GitLab Repository Provisioner

A high-quality, open-source CLI tool for synchronizing GitLab repository configurations. Built with TypeScript and Deno, following Clean Architecture principles.

## 🚀 Features

- **Clean Architecture**: Well-structured codebase with clear separation of concerns
- **YAML Configuration**: Define repository configurations in human-readable YAML
- **Repository Validation**: Validate repository paths, branch names, and visibility settings
- **Safe Operations**: Dry-run mode to preview changes before applying them
- **Comprehensive Error Handling**: Detailed error messages and validation feedback
- **GitLab API Integration**: Full integration with GitLab API for repository management
- **Environment Configuration**: Support for `.env` files and environment variables
- **TypeScript**: Fully typed with strict TypeScript configuration

## 📋 Prerequisites

- [Deno](https://deno.land/) runtime (latest stable version)
- GitLab account with API access
- GitLab personal access token with appropriate permissions

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gitlab-repo-provisioner.git
cd gitlab-repo-provisioner
```

2. Create a `.env` file with your GitLab credentials:
```bash
GITLAB_TOKEN=your_gitlab_personal_access_token
GITLAB_ENDPOINT=https://gitlab.com  # Optional, defaults to gitlab.com
```

3. Run the application:
```bash
deno task start --help
```

## 📝 Usage

### Create Configuration File

Create a `repositories.yml` file with your repository configurations:

```yaml
repositories:
  - path: mygroup/project1
    defaultBranch: develop
    description: "Main project repository"
    visibility: private

  - path: mygroup/project2
    defaultBranch: main
    description: "Secondary project repository"
    visibility: internal
```

### Commands

#### Validate Configuration
```bash
deno task start validate --config repositories.yml
```

#### Sync Repositories (Dry Run)
```bash
deno task start sync --config repositories.yml --dry-run
```

#### Sync Repositories
```bash
deno task start sync --config repositories.yml
```

## 🏗️ Architecture

The project follows Clean Architecture principles with the following layers:

### Domain Layer (`src/domain/`)
- **Entities**: Core business objects (`Repository`, `RepositoryConfiguration`)
- **Value Objects**: Immutable value objects (`RepositoryName`, `BranchName`, `ProjectPath`)
- **Repositories**: Interfaces for external dependencies (`IGitLabRepository`)
- **Errors**: Domain-specific error types

### Application Layer (`src/application/`)
- **Use Cases**: Application business logic (`SyncRepositoriesUseCase`, `ValidateConfigurationUseCase`)
- **DTOs**: Data transfer objects for input/output

### Infrastructure Layer (`src/infrastructure/`)
- **Repositories**: External API implementations (`GitLabApiRepository`)
- **Config**: Environment and configuration management
- **CLI**: Command-line interface implementation
- **Parsers**: YAML and other data format parsers

### Shared Layer (`src/shared/`)
- **Result Types**: Functional error handling utilities
- **Common Utilities**: Shared utilities and helpers

## 🧪 Development

### Running Tests
```bash
deno task test
```

### Linting
```bash
deno task lint
```

### Formatting
```bash
deno task fmt
```

### Type Checking
```bash
deno check main.ts
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITLAB_TOKEN` | ✅ | GitLab personal access token |
| `GITLAB_ENDPOINT` | ❌ | GitLab instance URL (defaults to https://gitlab.com) |

### Repository Configuration Format

```yaml
repositories:
  - path: namespace/project-name  # Required: GitLab project path
    defaultBranch: branch-name    # Required: Default branch name
    description: "Project description"  # Optional: Repository description
    visibility: private           # Optional: private|internal|public (default: private)
```

## 🛡️ Error Handling

The application implements comprehensive error handling:

- **Validation Errors**: Detailed validation feedback for configuration files
- **API Errors**: Graceful handling of GitLab API errors with retry logic
- **Network Errors**: Connection issues and timeout handling
- **Authentication Errors**: Clear authentication failure messages

## 🔒 Security

- **Token Security**: GitLab tokens are never logged or exposed
- **Input Validation**: All user inputs are validated and sanitized
- **Error Messages**: Sensitive information is never exposed in error messages
- **HTTPS Only**: All API communications use secure HTTPS connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Clean Architecture principles
- Write comprehensive tests for new features
- Use TypeScript strict mode
- Follow early-return/early-continue patterns
- Use functional error handling with Result types
- Document all public APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Deno](https://deno.land/) and TypeScript
- Uses [Cliffy](https://cliffy.io/) for CLI framework
- Integrates with [GitLab API](https://docs.gitlab.com/ee/api/)
- Follows [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) principles

## 📞 Support

For issues and questions:
1. Check the [documentation](README.md)
2. Search [existing issues](https://github.com/yourusername/gitlab-repo-provisioner/issues)
3. Create a [new issue](https://github.com/yourusername/gitlab-repo-provisioner/issues/new)

---

**Made with ❤️ by the open source community**