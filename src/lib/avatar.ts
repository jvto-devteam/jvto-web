export function getInitials(name: string): string {
  if (!name) return "?";

  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return (
      words[0][0] + words[1][0]
    ).toUpperCase();
  }

  return words[0].slice(0, 2).toUpperCase();
}
