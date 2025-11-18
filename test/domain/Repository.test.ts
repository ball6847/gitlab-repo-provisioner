// Unit tests for Repository entity
import { assertEquals } from "@std/assert";
import { Repository } from "../../src/domain/entities/repository.ts";
import { BranchName } from "../../src/domain/valueobjects/branch_name.ts";
import { ProjectPath } from "../../src/domain/valueobjects/project_path.ts";

Deno.test("Repository - creates valid repository", () => {
  const path = ProjectPath.create("group/project");
  const defaultBranch = BranchName.create("main");

  const repository = new Repository({
    path,
    defaultBranch,
    description: "Test repository",
    visibility: "private",
  });

  assertEquals(repository.getFullPath(), "group/project");
  assertEquals(repository.getDefaultBranch().getValue(), "main");
  assertEquals(repository.getDescription(), "Test repository");
  assertEquals(repository.getVisibility(), "private");
  assertEquals(repository.getNamespace(), "group");
  assertEquals(repository.getProjectName(), "project");
});

Deno.test("Repository - default visibility is private", () => {
  const path = ProjectPath.create("group/project");
  const defaultBranch = BranchName.create("main");

  const repository = new Repository({
    path,
    defaultBranch,
  });

  assertEquals(repository.getVisibility(), "private");
});

Deno.test("Repository - needsUpdate() detects branch changes", () => {
  const path = ProjectPath.create("group/project");
  const defaultBranch = BranchName.create("develop");

  const repository = new Repository({
    path,
    defaultBranch,
  });

  assertEquals(repository.needsUpdate("main"), true);
  assertEquals(repository.needsUpdate("develop"), false);
});

Deno.test("Repository - handles optional description", () => {
  const path = ProjectPath.create("group/project");
  const defaultBranch = BranchName.create("main");

  const repository = new Repository({
    path,
    defaultBranch,
  });

  assertEquals(repository.getDescription(), undefined);
});
