import { cardapio, cardapioOficialDoces, cardapioOficialSalgadas } from './data';
import type { CheckoutDraft, Produto } from './types';

export const PRECO_ACOMPANHAMENTO = 6;
export const TAXA_ENTREGA = 8;
export const TEMPO_AVALIACAO_MS = 10 * 60 * 1000;

export const STORAGE_KEYS = {
  THEME: 'attimo-theme',
  CART: 'attimo-cart',
  CHECKOUT: 'attimo-checkout',
  ACTIVE_ORDER: 'attimo-active-order',
  PENDING_REVIEW: 'attimo-pending-review',
  REVIEW_DRAFT: 'attimo-review-draft',
  UI_SESSION: 'attimo-ui-session',
} as const;

export const DEFAULT_CHECKOUT_DRAFT: CheckoutDraft = {
  currentStep: 1,
  fulfillment: 'delivery',
  paymentMethod: 'pix',
  installments: '1',
  couponCode: '',
  address: {
    zipCode: '',
    state: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    reference: '',
  },
  cardDetails: {
    number: '',
    expiry: '',
    cvv: '',
  },
};

export const formatCurrency = (value: number): string =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export const findProductForFlavor = (flavorName: string, products: Produto[]): Produto => {
  const firstWord = flavorName.split(' ')[0];
  return products.find((product) => product.nome.includes(firstWord)) ?? products[0];
};

export const findProductById = (productId: number | null): Produto | null => {
  if (productId === null) return null;
  const allProducts = [...cardapio, ...cardapioOficialSalgadas, ...cardapioOficialDoces];
  return allProducts.find((product) => product.id === productId) ?? null;
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

export function normalizeCheckoutDraft(stored: Partial<CheckoutDraft> | null): CheckoutDraft {
  if (!stored) return DEFAULT_CHECKOUT_DRAFT;
  return {
    ...DEFAULT_CHECKOUT_DRAFT,
    ...stored,
    address: {
      ...DEFAULT_CHECKOUT_DRAFT.address,
      ...(stored.address ?? {}),
    },
    cardDetails: {
      ...DEFAULT_CHECKOUT_DRAFT.cardDetails,
      ...(stored.cardDetails ?? {}),
    },
  };
}
