// Result types for functional error handling following typescript-result patterns
export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface ErrorResult<E> {
  success: false;
  error: E;
}

export type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

// Helper functions for creating results
export function ok<T>(data: T): SuccessResult<T> {
  return { success: true, data };
}

export function err<E>(error: E): ErrorResult<E> {
  return { success: false, error };
}

// Helper to wrap functions that might throw
export function wrap<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

// Async version of wrap
export async function wrapAsync<T>(
  fn: () => Promise<T>,
): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}
