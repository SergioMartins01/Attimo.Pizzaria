import type { MiniOferta, Produto, Sabor } from './types';

export const cardapio: Produto[] = [
  {
    id: 1,
    nome: 'Pizza Calabresa',
    descricao: 'Sabor marcante com calabresa, queijo derretido e molho artesanal.',
    ingredientes: ['calabresa', 'queijo', 'molho de tomate', 'orégano'],
    imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 35 },
      { nome: 'Média', preco: 45 },
      { nome: 'Grande', preco: 58 },
      { nome: 'Extra Grande', preco: 72 },
    ],
    acompanhamentos: ['Coca-Cola 2L', 'Batata frita', 'Pão de alho', 'Molho extra'],
  },
  {
    id: 2,
    nome: 'Pizza Marguerita',
    descricao: 'Clássica pizza italiana com mussarela, tomate e manjericão fresco.',
    ingredientes: ['molho de tomate', 'mussarela', 'manjericão', 'azeite'],
    imagem: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 32 },
      { nome: 'Média', preco: 40 },
      { nome: 'Grande', preco: 52 },
      { nome: 'Extra Grande', preco: 68 },
    ],
    acompanhamentos: ['Água com gás', 'Bruschetta', 'Suco natural', 'Salada'],
  },
  {
    id: 3,
    nome: 'Coca-Cola 2L',
    descricao: 'Refrigerante gelado para acompanhar sua pizza com sabor clássico.',
    ingredientes: ['água carbonatada', 'açúcar', 'extrato de cola'],
    imagem: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 8 },
      { nome: 'Média', preco: 12 },
      { nome: 'Grande', preco: 15 },
      { nome: 'Extra Grande', preco: 18 },
    ],
    acompanhamentos: ['Pizza de calabresa', 'Batata frita', 'Cookie', 'Pudim'],
  },
  {
    id: 4,
    nome: 'Pizza Pepperoni',
    descricao: 'Pepperoni crocante, molho encorpado e queijo derretido ao máximo.',
    ingredientes: ['pepperoni', 'queijo', 'molho de tomate', 'alho'],
    imagem: 'https://images.unsplash.com/photo-1548365328-9f547fb9587c?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 36 },
      { nome: 'Média', preco: 49 },
      { nome: 'Grande', preco: 62 },
      { nome: 'Extra Grande', preco: 76 },
    ],
    acompanhamentos: ['Coca-Cola 2L', 'Batata', 'Pão de alho'],
  },
  {
    id: 5,
    nome: 'Pizza Quatro Queijos',
    descricao: 'Mistura cremosa de queijos com sabor suave e irresistível.',
    ingredientes: ['mussarela', 'gorgonzola', 'parmesão', 'provolone'],
    imagem: 'https://images.unsplash.com/photo-1552539618-7eec9b4d8f95?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 38 },
      { nome: 'Média', preco: 50 },
      { nome: 'Grande', preco: 64 },
      { nome: 'Extra Grande', preco: 80 },
    ],
    acompanhamentos: ['Suco natural', 'Bruschetta', 'Molho extra'],
  },
  {
    id: 6,
    nome: 'Pizza Frango com Catupiry',
    descricao: 'Frango suculento com catupiry e toque cremoso em cada fatia.',
    ingredientes: ['frango', 'catupiry', 'cebola', 'molho de tomate'],
    imagem: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 39 },
      { nome: 'Média', preco: 53 },
      { nome: 'Grande', preco: 67 },
      { nome: 'Extra Grande', preco: 82 },
    ],
    acompanhamentos: ['Coca-Cola 2L', 'Batata frita', 'Pão de alho'],
  },
];

export const miniOfertas: MiniOferta[] = [
  { nome: 'Cogumelo', preco: 'R$ 12,99', image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=500&q=80' },
  { nome: 'Pepperoni', preco: 'R$ 10,99', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80' },
  { nome: 'Basilico', preco: 'R$ 11,99', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80' },
];

export const sabores: Sabor[] = [
  { nome: 'Pepperoni', preco: 'R$ 12,49', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
  { nome: 'Margherita', preco: 'R$ 9,99', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80' },
  { nome: 'Cheese Burst', preco: 'R$ 13,99', image: 'https://images.unsplash.com/photo-1548365328-9f547fb9587c?auto=format&fit=crop&w=800&q=80' },
  { nome: 'Pepperoni Mix', preco: 'R$ 14,99', image: 'https://images.unsplash.com/photo-1552539618-7eec9b4d8f95?auto=format&fit=crop&w=800&q=80' },
  { nome: 'Cogumelo', preco: 'R$ 10,49', image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80' },
  { nome: 'Italian Hot', preco: 'R$ 11,99', image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=800&q=80' },
  { nome: 'Paneer', preco: 'R$ 10,49', image: 'https://images.unsplash.com/photo-1514129963530-5ad9d4d3b4d7?auto=format&fit=crop&w=800&q=80' },
  { nome: 'Veggie', preco: 'R$ 11,99', image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80' },
];

export const depoimentos = [
  'A pizza chegou quentinha e com sabor incrível. A massa está perfeita e o molho tem um toque muito especial.',
  'Adorei a variedade e a qualidade. O atendimento foi rápido e o sabor super fresco.',
  'A melhor pizza da cidade. O sabor é muito bem equilibrado, e a entrega foi pontual.',
  'Excelente para pedir com a família. Os ingredientes parecem bem frescos e a experiência foi ótima.',
];

export const favoritosDaCasa = cardapio.filter((item) => item.nome !== 'Coca-Cola 2L');

export const cardapioOficialSalgadas: Produto[] = [
  {
    id: 101,
    nome: 'Pizza Calabresa',
    descricao: 'Passata de tomate, muçarela, calabresa e orégano.',
    ingredientes: ['passata de tomate', 'muçarela', 'calabresa', 'orégano'],
    imagem: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 34.9 },
      { nome: 'Média', preco: 34.9 },
      { nome: 'Grande', preco: 44.9 },
      { nome: 'Extra Grande', preco: 54.9 },
    ],
    acompanhamentos: ['Coca-Cola 2L', 'Batata frita', 'Pão de alho', 'Molho extra'],
  },
  {
    id: 102,
    nome: 'Pizza Pepperoni',
    descricao: 'Passata de tomate, muçarela, pepperoni.',
    ingredientes: ['passata de tomate', 'muçarela', 'pepperoni'],
    imagem: 'https://images.unsplash.com/photo-1548365328-9f547fb9587c?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 34.9 },
      { nome: 'Média', preco: 34.9 },
      { nome: 'Grande', preco: 44.9 },
      { nome: 'Extra Grande', preco: 54.9 },
    ],
    acompanhamentos: ['Coca-Cola 2L', 'Batata', 'Pão de alho'],
  },
  {
    id: 103,
    nome: 'Pizza Margherita',
    descricao: 'Passata de tomate, muçarela e manjericão.',
    ingredientes: ['passata de tomate', 'muçarela', 'manjericão'],
    imagem: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 34.9 },
      { nome: 'Média', preco: 34.9 },
      { nome: 'Grande', preco: 44.9 },
      { nome: 'Extra Grande', preco: 54.9 },
    ],
    acompanhamentos: ['Água com gás', 'Bruschetta', 'Suco natural', 'Salada'],
  },
  {
    id: 104,
    nome: 'Pizza Quatro Queijos',
    descricao: 'Base bianca, muçarela, parmesão, provolone e gorgonzola.',
    ingredientes: ['base bianca', 'muçarela', 'parmesão', 'provolone', 'gorgonzola'],
    imagem: 'https://images.unsplash.com/photo-1552539618-7eec9b4d8f95?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 34.9 },
      { nome: 'Média', preco: 34.9 },
      { nome: 'Grande', preco: 44.9 },
      { nome: 'Extra Grande', preco: 54.9 },
    ],
    acompanhamentos: ['Suco natural', 'Bruschetta', 'Molho extra'],
  },
];

export const cardapioOficialDoces: Produto[] = [
  {
    id: 105,
    nome: 'Pizza Bianco & Fragola',
    descricao: 'Ganache de chocolate branco e compota artesanal de morangos.',
    ingredientes: ['ganache de chocolate branco', 'compota artesanal de morangos'],
    imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 34.9 },
      { nome: 'Média', preco: 34.9 },
      { nome: 'Grande', preco: 44.9 },
      { nome: 'Extra Grande', preco: 54.9 },
    ],
    acompanhamentos: ['Coca-Cola 2L', 'Sorvete de creme'],
  },
  {
    id: 106,
    nome: 'Pizza Caramelada',
    descricao: 'Ganache de banana caramelizada e doce de leite.',
    ingredientes: ['ganache de banana caramelizada', 'doce de leite'],
    imagem: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=900&q=80',
    tamanhos: [
      { nome: 'Pequena', preco: 34.9 },
      { nome: 'Média', preco: 34.9 },
      { nome: 'Grande', preco: 44.9 },
      { nome: 'Extra Grande', preco: 54.9 },
    ],
    acompanhamentos: ['Coca-Cola 2L', 'Doce de leite extra'],
  },
];
