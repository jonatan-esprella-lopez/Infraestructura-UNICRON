export async function runTransaction<T>(work: () => Promise<T>): Promise<T> {
  return work();
}
