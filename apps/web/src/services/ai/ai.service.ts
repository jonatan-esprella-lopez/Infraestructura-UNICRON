export const aiService = {
  async complete(prompt: string) {
    return { text: `Mock response for: ${prompt}` };
  },
};
