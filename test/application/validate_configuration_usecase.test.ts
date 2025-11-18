// Unit tests for ValidateConfigurationUseCase
import { assertEquals } from "@std/assert";
import { ValidateConfigurationUseCase } from "../../src/application/usecases/validate_configuration_usecase.ts";
import { RepositoryConfigurationDto } from "../../src/application/dto/repository_dto.ts";

Deno.test("ValidateConfigurationUseCase - valid configuration", () => {
  const useCase = new ValidateConfigurationUseCase();

  const validConfig: RepositoryConfigurationDto = {
    repositories: [
      {
        path: "group/project1",
        defaultBranch: "main",
        description: "Project 1",
        visibility: "private",
      },
      {
        path: "group/project2",
        defaultBranch: "develop",
        visibility: "internal",
      },
    ],
  };

  const result = useCase.execute(validConfig);

  assertEquals(result.isValid, true);
  assertEquals(result.errors.length, 0);
});

Deno.test("ValidateConfigurationUseCase - missing repositories array", () => {
  const useCase = new ValidateConfigurationUseCase();

  const invalidConfig = {} as RepositoryConfigurationDto;

  const result = useCase.execute(invalidConfig);

  assertEquals(result.isValid, false);
  assertEquals(result.errors.length, 1);
  assertEquals(result.errors[0].field, "repositories");
  assertEquals(result.errors[0].message, "Repositories must be an array");
});

Deno.test("ValidateConfigurationUseCase - empty repositories array", () => {
  const useCase = new ValidateConfigurationUseCase();

  const invalidConfig: RepositoryConfigurationDto = {
    repositories: [],
  };

  const result = useCase.execute(invalidConfig);

  assertEquals(result.isValid, false);
  assertEquals(result.errors.length, 1);
  assertEquals(result.errors[0].field, "repositories");
  assertEquals(
    result.errors[0].message,
    "At least one repository must be specified",
  );
});

Deno.test("ValidateConfigurationUseCase - duplicate paths", () => {
  const useCase = new ValidateConfigurationUseCase();

  const invalidConfig: RepositoryConfigurationDto = {
    repositories: [
      {
        path: "group/project1",
        defaultBranch: "main",
      },
      {
        path: "group/project1", // Duplicate path
        defaultBranch: "develop",
      },
    ],
  };

  const result = useCase.execute(invalidConfig);

  assertEquals(result.isValid, false);
  assertEquals(result.errors.length, 1);
  assertEquals(result.errors[0].field, "repositories[1].path");
  assertEquals(result.errors[0].message, "Duplicate path: group/project1");
});

Deno.test("ValidateConfigurationUseCase - invalid visibility", () => {
  const useCase = new ValidateConfigurationUseCase();

  const invalidConfig: RepositoryConfigurationDto = {
    repositories: [
      {
        path: "group/project1",
        defaultBranch: "main",
        visibility: "invalid-visibility" as "private" | "internal" | "public",
      },
    ],
  };

  const result = useCase.execute(invalidConfig);

  assertEquals(result.isValid, false);
  assertEquals(result.errors.length, 1);
  assertEquals(result.errors[0].field, "repositories[0].visibility");
  assertEquals(
    result.errors[0].message,
    "Visibility must be one of: private, internal, public",
  );
});

Deno.test("ValidateConfigurationUseCase - missing required fields", () => {
  const useCase = new ValidateConfigurationUseCase();

  const invalidConfig: RepositoryConfigurationDto = {
    repositories: [
      {
        path: "",
        defaultBranch: "",
      },
    ],
  };

  const result = useCase.execute(invalidConfig);

  assertEquals(result.isValid, false);
  assertEquals(result.errors.length, 2);

  const pathError = result.errors.find((e) =>
    e.field === "repositories[0].path"
  );
  const branchError = result.errors.find((e) =>
    e.field === "repositories[0].defaultBranch"
  );

  assertEquals(pathError?.message, "Path is required");
  assertEquals(branchError?.message, "Default branch is required");
});
