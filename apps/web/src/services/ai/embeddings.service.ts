export const embeddingsService = {
  async embed(input: string) {
    return Array.from(input).slice(0, 8).map((char) => char.charCodeAt(0) / 100);
  },
};
