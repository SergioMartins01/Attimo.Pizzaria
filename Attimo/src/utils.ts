import type { Produto } from './types';

export const PRECO_ACOMPANHAMENTO = 6;
export const TAXA_ENTREGA = 8;
export const TEMPO_AVALIACAO_MS = 10 * 60 * 1000;

export const STORAGE_KEYS = {
  THEME: 'attimo-theme',
  CART: 'attimo-cart',
  CHECKOUT: 'attimo-checkout',
  ACTIVE_ORDER: 'attimo-active-order',
  PENDING_REVIEW: 'attimo-pending-review',
} as const;

export const formatCurrency = (value: number): string =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export const findProductForFlavor = (flavorName: string, products: Produto[]): Produto => {
  const firstWord = flavorName.split(' ')[0];
  return products.find((product) => product.nome.includes(firstWord)) ?? products[0];
};

export const calculateOrderTotal = (
  product: Produto | null,
  sizeName: Produto['tamanhos'][number]['nome'],
  selectedExtras: string[],
): number => {
  if (!product) return 0;

  const basePrice = product.tamanhos.find((size) => size.nome === sizeName)?.preco ?? 0;
  return basePrice + selectedExtras.length * PRECO_ACOMPANHAMENTO;
};

export function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}
