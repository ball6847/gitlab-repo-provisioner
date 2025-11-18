// Value Object for branch names with validation
import { InvalidBranchNameError } from "../errors.ts";

export class BranchName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): BranchName {
    if (!value || value.trim().length === 0) {
      throw new InvalidBranchNameError("Branch name cannot be empty");
    }

    // Git branch name validation - simplified to avoid control character issues
    if (value.includes("..")) {
      throw new InvalidBranchNameError(value);
    }

    // Check for invalid characters without using control character ranges
    const invalidChars = ["~", "^", ":", "?", "*", "[", "\\", "|"];
    for (const char of invalidChars) {
      if (value.includes(char)) {
        throw new InvalidBranchNameError(value);
      }
    }

    if (value.startsWith("/") || value.endsWith("/")) {
      throw new InvalidBranchNameError(value);
    }

    if (value.endsWith(".lock")) {
      throw new InvalidBranchNameError(value);
    }

    if (value.includes("@{")) {
      throw new InvalidBranchNameError(value);
    }

    return new BranchName(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BranchName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
