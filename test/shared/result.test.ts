// Unit tests for result utility functions
import { assertEquals } from "@std/assert";
import { err, ok, Result, wrap, wrapAsync } from "../../src/shared/result.ts";

Deno.test("ok() - creates success result", () => {
  const result = ok(42);

  assertEquals(result.success, true);
  assertEquals(result.data, 42);
});

Deno.test("err() - creates error result", () => {
  const error = new Error("Test error");
  const result = err(error);

  assertEquals(result.success, false);
  assertEquals(result.error, error);
});

Deno.test("wrap() - wraps successful function", () => {
  const fn = () => 42;
  const result = wrap(fn);

  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data, 42);
  }
});

Deno.test("wrap() - wraps throwing function", () => {
  const error = new Error("Test error");
  const fn = () => {
    throw error;
  };
  const result = wrap(fn);

  assertEquals(result.success, false);
  if (!result.success) {
    assertEquals(result.error, error);
  }
});

Deno.test("wrap() - wraps non-Error throws", () => {
  const fn = () => {
    throw "string error";
  };
  const result = wrap(fn);

  assertEquals(result.success, false);
  if (!result.success) {
    assertEquals(result.error.message, "string error");
  }
});

Deno.test("wrapAsync() - wraps successful async function", async () => {
  const fn = () => Promise.resolve(42);
  const result = await wrapAsync(fn);

  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data, 42);
  }
});

Deno.test("wrapAsync() - wraps throwing async function", async () => {
  const error = new Error("Test error");
  const fn = () => Promise.reject(error);
  const result = await wrapAsync(fn);

  assertEquals(result.success, false);
  if (!result.success) {
    assertEquals(result.error, error);
  }
});

Deno.test("Result type - can be used in type guards", () => {
  function processResult(result: Result<number>): string {
    if (result.success) {
      return `Success: ${result.data}`;
    } else {
      return `Error: ${result.error.message}`;
    }
  }

  const successResult = ok(42);
  const errorResult = err(new Error("Test error"));

  assertEquals(processResult(successResult), "Success: 42");
  assertEquals(processResult(errorResult), "Error: Test error");
});
