export type Tamanho = 'Pequena' | 'Média' | 'Grande' | 'Extra Grande';

export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  ingredientes: string[];
  imagem: string;
  tamanhos: { nome: Tamanho; preco: number }[];
  acompanhamentos: string[];
};

export type MiniOferta = {
  nome: string;
  preco: string;
  image: string;
};

export type Sabor = {
  nome: string;
  preco: string;
  image: string;
};

export type CartItem = {
  id: string;
  product: Produto;
  size: Tamanho;
  extras: string[];
  unitPrice: number;
  quantity: number;
};

export type Fulfillment = 'delivery' | 'pickup' | 'dine-in';
export type PaymentMethod = 'pix' | 'credit' | 'debit';

export type DeliveryAddress = {
  zipCode: string;
  state: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  reference: string;
};

export type CheckoutDraft = {
  currentStep: number;
  fulfillment: Fulfillment;
  paymentMethod: PaymentMethod;
  installments: string;
  address: DeliveryAddress;
};

export type ActiveOrder = {
  id: string;
  createdAt: number;
  items: CartItem[];
  draft: CheckoutDraft;
};

export type PendingReview = {
  orderId: string;
  createdAt: number;
  items: CartItem[];
  fulfillment: Fulfillment;
};
