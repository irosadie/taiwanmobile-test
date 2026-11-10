export function pathVariable(path: string, variables: Record<string, string | number>) {
  return path.replace(/:([a-zA-Z][a-zA-Z0-9_]*)/g, (_, key: string) => {
    if (!(key in variables)) throw new Error(`Missing path variable: ${key}`);
    return encodeURIComponent(String(variables[key]));
  });
}
