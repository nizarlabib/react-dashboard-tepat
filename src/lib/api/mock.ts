/**
 * Resolves a value after a simulated network delay. Used by mock service
 * implementations so the UI can exercise loading states during development.
 */
export function mockResponse<T>(data: T, delay = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}
