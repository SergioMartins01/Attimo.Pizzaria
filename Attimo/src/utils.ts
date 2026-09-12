import type { Produto } from './types';

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
  return basePrice + selectedExtras.length * 6;
};
