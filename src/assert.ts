export function assert(condition: unknown, msg?: string): asserts condition {
  if (condition === false) throw new Error(`Error: ${msg}`);
}
