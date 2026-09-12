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
