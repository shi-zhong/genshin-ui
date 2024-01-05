export const RarityToColor = (rank: 1 | 2 | 3 | 4 | 5): string => {
  return ['gray', 'green', 'blue', 'purple', 'golden'][rank - 1];
};