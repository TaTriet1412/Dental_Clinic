export function improveUILongId(id: string): string {
  if (id.length <= 6) {
    return id; // Not enough characters to improve
  }
  return '...' +  id.slice(-5);
}
