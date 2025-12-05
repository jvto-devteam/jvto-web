export function stripHtml(html: string): string {
  return html
    .replace(/<\/p>/g, "\n\n")
    .replace(/<li>/g, "- ")
    .replace(/<\/li>/g, "\n")
    .replace(/<\/ul>/g, "\n")
    .replace(/<\/ol>/g, "\n")
    .replace(/<[^>]+>/g, "") // hapus semua tag
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
