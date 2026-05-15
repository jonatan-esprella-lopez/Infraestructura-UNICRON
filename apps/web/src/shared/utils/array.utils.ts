export function uniqueBy<TItem, TKey>(items: TItem[], getKey: (item: TItem) => TKey) {
  return [...new Map(items.map((item) => [getKey(item), item])).values()];
}
