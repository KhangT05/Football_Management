export function parseJsonField<T>(
    value: unknown,
    guard: (v: unknown) => v is T,
    fallback: T
): T {
    return guard(value) ? value : fallback;
}