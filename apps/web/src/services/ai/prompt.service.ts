export const promptService = {
  build(system: string, user: string) {
    return [system, user].join('\n\n');
  },
};
