// Retorna un elemento aleatorio del array
export function getRandomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// Retorna una copia del array sin elementos duplicados
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// Retorna un nuevo array con los elementos del array original mezclados (shuffle)
export function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Retorna los n primeros elementos del array
export function take<T>(array: T[], n: number): T[] {
  return array.slice(0, n);
}

// Retorna los n últimos elementos del array
export function takeLast<T>(array: T[], n: number): T[] {
  return array.slice(-n);
}

// Divide el array en chunks de tamaño n
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Agrupa elementos por una clave dada
export function groupBy<T, K extends string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// Aplana un array de arrays (una sola profundidad)
export function flatten<T>(array: T[][]): T[] {
  return array.reduce((acc, val) => acc.concat(val), []);
}
