import { useMemo, useState, type FormEvent } from 'react';
import { cardapio, favoritosDaCasa } from './data';
import { ProductModal } from './components/ProductModal';
import type { Produto, Tamanho } from './types';
import { calculateOrderTotal, formatCurrency } from './utils';

type Category = 'Todos' | 'Pizzas' | 'Bebidas' | 'Acompanhamentos';

const categories: { label: Category; icon: string }[] = [
  { label: 'Todos', icon: '✦' },
  { label: 'Pizzas', icon: '🍕' },
  { label: 'Bebidas', icon: '🥤' },
  { label: 'Acompanhamentos', icon: '🍟' },
];

function productCategory(product: Produto): Exclude<Category, 'Todos'> {
  if (product.nome.toLowerCase().includes('coca')) return 'Bebidas';
  return 'Pizzas';
}

function Logo() {
  return (
    <a className="brand" href="#inicio" aria-label="Attimo Pizzaria - início">
      <span className="brand-mark">A</span>
      <span>
        <strong>attimo</strong>
        <small>pizzaria artesanal</small>
      </span>
    </a>
  );
}

function Header({ cartCount }: { cartCount: number }) {
  return (
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Navegação principal">
        <a className="active" href="#inicio">Início</a>
        <a href="#cardapio">Cardápio</a>
        <a href="#sobre">Nossa história</a>
        <a href="#contato">Contato</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Buscar">⌕</button>
        <button className="cart-button" type="button" aria-label={`Carrinho com ${cartCount} itens`}>
          <span>🛒</span>
          {cartCount > 0 && <b>{cartCount}</b>}
        </button>
      </div>
    </header>
  );
}

function CategoryTabs({ selected, onSelect }: { selected: Category; onSelect: (category: Category) => void }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Categorias do cardápio">
      {categories.map((category) => (
        <button
          className={selected === category.label ? 'category-tab selected' : 'category-tab'}
          key={category.label}
          type="button"
          role="tab"
          aria-selected={selected === category.label}
          onClick={() => onSelect(category.label)}
        >
          <span>{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action && <a href="#cardapio" className="text-link">{action} <span>→</span></a>}
    </div>
  );
}

function ProductCard({ product, onOpen }: { product: Produto; onOpen: (product: Produto) => void }) {
  const mediumPrice = product.tamanhos.find((size) => size.nome === 'Média')?.preco ?? product.tamanhos[0].preco;

  return (
    <article className="product-card">
      <button className="product-image-button" type="button" onClick={() => onOpen(product)} aria-label={`Ver ${product.nome}`}>
        <img src={product.imagem} alt="" referrerPolicy="no-referrer" />
        <span className="favorite-button" aria-hidden="true">♡</span>
      </button>
      <div className="product-card-content">
        <div className="product-card-title">
          <h3>{product.nome.replace('Pizza ', '')}</h3>
          <span className="rating">★ 4,9</span>
        </div>
        <p>{product.descricao}</p>
        <div className="product-card-footer">
          <strong>{formatCurrency(mediumPrice)}</strong>
          <button type="button" onClick={() => onOpen(product)} aria-label={`Adicionar ${product.nome}`}>
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Navegação rápida">
      <a className="active" href="#inicio"><span>⌂</span>Início</a>
      <a href="#cardapio"><span>▦</span>Cardápio</a>
      <a href="#sobre"><span>♡</span>Favoritos</a>
      <a href="#contato"><span>♙</span>Perfil</a>
    </nav>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [search, setSearch] = useState('');
  const [activeProduct, setActiveProduct] = useState<Produto | null>(null);
  const [selectedSize, setSelectedSize] = useState<Tamanho>('Média');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [newsletterSent, setNewsletterSent] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return cardapio.filter((product) => {
      const matchesCategory = activeCategory === 'Todos' || productCategory(product) === activeCategory;
      const matchesSearch = !normalizedSearch
        || product.nome.toLowerCase().includes(normalizedSearch)
        || product.ingredientes.some((ingredient) => ingredient.toLowerCase().includes(normalizedSearch));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const openProduct = (product: Produto) => {
    setActiveProduct(product);
    setSelectedSize('Média');
    setSelectedExtras([]);
  };

  const closeProduct = () => {
    setActiveProduct(null);
    setSelectedExtras([]);
  };

  const addToCart = () => {
    setCartCount((count) => count + 1);
    closeProduct();
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSent(true);
  };

  const total = calculateOrderTotal(activeProduct, selectedSize, selectedExtras);

  return (
    <div className="app-shell">
      <Header cartCount={cartCount} />

      <main>
        <section className="hero-section" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">Feita para o seu momento</span>
            <h1>Seu momento fica melhor com <em>Attimo.</em></h1>
            <p>Pizza artesanal, ingredientes frescos e aquele sabor que transforma qualquer encontro.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#cardapio">Escolher minha pizza <span>→</span></a>
              <span className="delivery-note">⌁ Entrega média de 30–40 min</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow" />
            <img src={cardapio[0].imagem} alt="Pizza artesanal Attimo com queijo derretido" referrerPolicy="no-referrer" />
            <span className="hero-badge"><strong>100%</strong><small>ingredientes<br />frescos</small></span>
          </div>
        </section>

        <section className="catalog-section" id="cardapio">
          <div className="catalog-toolbar">
            <div>
              <span className="eyebrow">O nosso cardápio</span>
              <h2>Escolha o seu sabor</h2>
            </div>
            <label className="search-field">
              <span>⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no cardápio" aria-label="Buscar no cardápio" />
            </label>
          </div>
          <CategoryTabs selected={activeCategory} onSelect={setActiveCategory} />

          <div className="offer-card">
            <div>
              <span className="offer-label">Oferta da semana</span>
              <h3>Combo Attimo</h3>
              <p>Pizza média + Coca-Cola 2L + sobremesa para compartilhar.</p>
              <a href="#cardapio">Ver oferta <span>→</span></a>
            </div>
            <img src={favoritosDaCasa[1]?.imagem ?? cardapio[1].imagem} alt="Pizza do combo Attimo" referrerPolicy="no-referrer" />
            <strong className="offer-price">-15%</strong>
          </div>

          <SectionHeading title={activeCategory === 'Todos' ? 'Favoritos da casa' : activeCategory} action="Ver cardápio completo" />
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}
            </div>
          ) : (
            <div className="empty-state">Nenhum item encontrado. Tente outro sabor ou categoria.</div>
          )}
        </section>

        <section className="experience-section" id="sobre">
          <div>
            <span className="eyebrow">Mais que uma pizza</span>
            <h2>Feita com calma.<br /><em>Vivida no seu tempo.</em></h2>
            <p>Na Attimo, cada massa é aberta na hora e cada ingrediente é escolhido para fazer do seu pedido um momento especial.</p>
            <a className="outline-button" href="#contato">Conheça a Attimo <span>→</span></a>
          </div>
          <div className="experience-image">
            <img src={cardapio[4].imagem} alt="Pizza Attimo saindo do forno" referrerPolicy="no-referrer" />
            <span>massa artesanal<br /><strong>desde 2024</strong></span>
          </div>
        </section>

        <section className="newsletter-section" id="contato">
          <div>
            <span className="eyebrow">Fique por perto</span>
            <h2>Novidades quentinhas<br />no seu e-mail.</h2>
          </div>
          <form className="newsletter-form" onSubmit={submitNewsletter}>
            <label htmlFor="email">Seu melhor e-mail</label>
            <div>
              <input id="email" type="email" required placeholder="voce@email.com" />
              <button className="primary-button" type="submit">{newsletterSent ? 'Cadastrado ✓' : 'Quero receber'}</button>
            </div>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <Logo />
        <p>Pizza artesanal para os seus melhores momentos.</p>
        <span>© 2024 Attimo Pizzaria</span>
      </footer>

      <BottomNavigation />

      {activeProduct && (
        <ProductModal
          produto={activeProduct}
          tamanhoSelecionado={selectedSize}
          acompanhamentosSelecionados={selectedExtras}
          valorTotal={total}
          valorAcompanhamentos={selectedExtras.length * 6}
          onClose={closeProduct}
          onSizeChange={setSelectedSize}
          setAcompanhamentosSelecionados={setSelectedExtras}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}

export default App;
