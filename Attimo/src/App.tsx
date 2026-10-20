import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  BeerBottle,
  BookOpenText,
  Check,
  ClockCountdown,
  ForkKnife,
  Heart,
  House,
  MagnifyingGlass,
  MapPinLine,
  Moon,
  Pizza,
  Plus,
  ShoppingBagOpen,
  SquaresFour,
  Star,
  Sun,
  User,
} from '@phosphor-icons/react';
import { cardapio, favoritosDaCasa } from './data';
import { CardapioOficialPage } from './components/CardapioOficialPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderReviewModal } from './components/OrderReviewModal';
import { ProductModal } from './components/ProductModal';
import brandLogo from './img/Captura de tela 2026-09-01 210620.png';
import './checkout.css';
import type { ActiveOrder, CartItem, CheckoutDraft, PendingReview, Produto, Tamanho } from './types';
import {
  calculateOrderTotal,
  formatCurrency,
  PRECO_ACOMPANHAMENTO,
  readStoredValue,
  STORAGE_KEYS,
  TEMPO_AVALIACAO_MS,
} from './utils';

type Category = 'Todos' | 'Pizzas' | 'Bebidas' | 'Acompanhamentos';

const CATEGORIES: { label: Category; icon: ReactNode }[] = [
  { label: 'Todos', icon: <SquaresFour size={16} weight="duotone" /> },
  { label: 'Pizzas', icon: <Pizza size={16} weight="duotone" /> },
  { label: 'Bebidas', icon: <BeerBottle size={16} weight="duotone" /> },
  { label: 'Acompanhamentos', icon: <ForkKnife size={16} weight="duotone" /> },
];

const DEFAULT_CHECKOUT_DRAFT: CheckoutDraft = {
  currentStep: 1,
  fulfillment: 'delivery',
  paymentMethod: 'pix',
  installments: '1',
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
};

function getProductCategory(product: Produto): Exclude<Category, 'Todos'> {
  if (product.nome.toLowerCase().includes('coca')) return 'Bebidas';
  return 'Pizzas';
}

function Logo() {
  return (
    <a className="brand" href="#inicio" aria-label="Attimo Pizzaria - início">
      <span className="brand-mark">
        <img src={brandLogo} alt="" />
      </span>
      <span>
        <strong>Attimo</strong>
        <small>Pizzaria</small>
      </span>
    </a>
  );
}

type HeaderProps = {
  cartCount: number;
  hasActiveOrder: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCardapio: () => void;
  onOpenCart: () => void;
  onTrackOrder: () => void;
};

function Header({
  cartCount,
  hasActiveOrder,
  theme,
  onToggleTheme,
  onOpenCardapio,
  onOpenCart,
  onTrackOrder,
}: HeaderProps) {
  return (
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Navegação principal">
        <a className="active" href="#inicio">Início</a>
        <button className="nav-link-button" type="button" onClick={onOpenCardapio}>
          Cardápio
        </button>
        <a href="#sobre">Nossa história</a>
        <a href="#contato">Contato</a>
      </nav>
      <div className="header-actions">
        <button
          className="icon-button"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          {theme === 'dark' ? <Sun size={18} weight="regular" /> : <Moon size={18} weight="regular" />}
        </button>
        <button className="icon-button" type="button" aria-label="Buscar">
          <MagnifyingGlass size={18} weight="regular" />
        </button>
        {hasActiveOrder && (
          <button className="track-order-button" type="button" onClick={onTrackOrder}>
            <MapPinLine size={16} weight="bold" />
            <span>Acompanhar pedido</span>
          </button>
        )}
        <button
          className="cart-button"
          type="button"
          onClick={onOpenCart}
          aria-label={`Carrinho com ${cartCount} itens`}
        >
          <ShoppingBagOpen size={19} weight="regular" />
          {cartCount > 0 && <b>{cartCount}</b>}
        </button>
      </div>
    </header>
  );
}

function CategoryTabs({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (category: Category) => void;
}) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Categorias do cardápio">
      {CATEGORIES.map((category) => (
        <button
          key={category.label}
          className={selected === category.label ? 'category-tab selected' : 'category-tab'}
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

function SectionHeading({
  eyebrow,
  title,
  action,
  onActionClick,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onActionClick?: () => void;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action &&
        (onActionClick ? (
          <button type="button" className="primary-button" onClick={onActionClick}>
            <BookOpenText size={16} weight="duotone" />
            {action}
            <ArrowRight size={15} weight="bold" />
          </button>
        ) : (
          <a href="#favoritos-da-casa" className="primary-button">
            {action} <ArrowRight size={15} weight="bold" />
          </a>
        ))}
    </div>
  );
}

function ProductCard({
  product,
  onOpen,
}: {
  product: Produto;
  onOpen: (product: Produto) => void;
}) {
  const mediumPrice =
    product.tamanhos.find((size) => size.nome === 'Média')?.preco ?? product.tamanhos[0].preco;

  return (
    <article className="product-card">
      <button
        className="product-image-button"
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`Ver ${product.nome}`}
      >
        <img src={product.imagem} alt="" referrerPolicy="no-referrer" />
        <span className="favorite-button" aria-hidden="true">
          <Heart size={16} weight="regular" />
        </span>
      </button>
      <div className="product-card-content">
        <div className="product-card-title">
          <h3>{product.nome.replace('Pizza ', '')}</h3>
          <span className="rating">
            <Star size={12} weight="fill" /> 4,9
          </span>
        </div>
        <p>{product.descricao}</p>
        <div className="product-card-footer">
          <strong>{formatCurrency(mediumPrice)}</strong>
          <button
            type="button"
            onClick={() => onOpen(product)}
            aria-label={`Adicionar ${product.nome}`}
          >
            <Plus size={18} weight="bold" />
          </button>
        </div>
      </div>
    </article>
  );
}

function BottomNavigation({ onOpenCardapio }: { onOpenCardapio: () => void }) {
  return (
    <nav className="bottom-navigation" aria-label="Navegação rápida">
      <a className="active" href="#inicio">
        <span><House size={20} weight="duotone" /></span>
        Início
      </a>
      <button type="button" className="bottom-nav-button" onClick={onOpenCardapio}>
        <span><BookOpenText size={20} weight="duotone" /></span>
        Cardápio
      </button>
      <a href="#sobre">
        <span><Heart size={20} weight="duotone" /></span>
        Favoritos
      </a>
      <a href="#contato">
        <span><User size={20} weight="duotone" /></span>
        Perfil
      </a>
    </nav>
  );
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    readStoredValue(STORAGE_KEYS.THEME, 'light'),
  );
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [search, setSearch] = useState('');
  const [activeProduct, setActiveProduct] = useState<Produto | null>(null);
  const [selectedSize, setSelectedSize] = useState<Tamanho>('Média');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    readStoredValue(STORAGE_KEYS.CART, []),
  );
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft>(() =>
    readStoredValue(STORAGE_KEYS.CHECKOUT, DEFAULT_CHECKOUT_DRAFT),
  );
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() =>
    readStoredValue(STORAGE_KEYS.ACTIVE_ORDER, null),
  );
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(() =>
    readStoredValue(STORAGE_KEYS.PENDING_REVIEW, null),
  );
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(() =>
    Boolean(readStoredValue(STORAGE_KEYS.PENDING_REVIEW, null)),
  );
  const [cardapioOpen, setCardapioOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  useEffect(() => {
    if (activeProduct || cardapioOpen || reviewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProduct, cardapioOpen, reviewModalOpen]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.CHECKOUT, JSON.stringify(checkoutDraft));
  }, [checkoutDraft]);

  useEffect(() => {
    if (activeOrder) {
      window.localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER, JSON.stringify(activeOrder));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORDER);
    }
  }, [activeOrder]);

  useEffect(() => {
    if (pendingReview) {
      window.localStorage.setItem(STORAGE_KEYS.PENDING_REVIEW, JSON.stringify(pendingReview));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.PENDING_REVIEW);
    }
  }, [pendingReview]);

  useEffect(() => {
    if (!pendingReview) return;

    const remainingMs = Math.max(TEMPO_AVALIACAO_MS - (Date.now() - pendingReview.createdAt), 0);
    const timer = window.setTimeout(() => {
      setReviewModalOpen(true);
    }, remainingMs);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setReviewModalOpen(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pendingReview]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return cardapio.filter((product) => {
      const matchesCategory =
        activeCategory === 'Todos' || getProductCategory(product) === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.nome.toLowerCase().includes(normalizedSearch) ||
        product.ingredientes.some((ingredient) =>
          ingredient.toLowerCase().includes(normalizedSearch),
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const total = calculateOrderTotal(activeProduct, selectedSize, selectedExtras);

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
    if (!activeProduct) return;
    const unitPrice = total;
    const existing = cartItems.find(
      (item) =>
        item.product.id === activeProduct.id &&
        item.size === selectedSize &&
        item.extras.join('|') === selectedExtras.join('|'),
    );

    if (existing) {
      setCartItems((items) =>
        items.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      setCartItems((items) => [
        ...items,
        {
          id: `${activeProduct.id}-${Date.now()}`,
          product: activeProduct,
          size: selectedSize,
          extras: selectedExtras,
          unitPrice,
          quantity: 1,
        },
      ]);
    }
    closeProduct();
    setCartOpen(true);
  };

  const changeQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((items) => items.filter((item) => item.id !== itemId));
    } else {
      setCartItems((items) =>
        items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
      );
    }
  };

  const removeItem = (itemId: string) =>
    setCartItems((items) => items.filter((item) => item.id !== itemId));

  const openCheckout = () => {
    setCartOpen(false);
    setCardapioOpen(false);
    setCheckoutOpen(true);
    setCheckoutDraft((draft) => ({ ...draft, currentStep: 1 }));
  };

  const trackOrder = () => {
    if (!activeOrder) return;
    setCardapioOpen(false);
    setCheckoutDraft(activeOrder.draft);
    setCheckoutOpen(true);
  };

  const confirmOrder = (draft: CheckoutDraft) => {
    const orderId = `attimo-${Date.now()}`;
    const createdAt = Date.now();
    setActiveOrder({ id: orderId, createdAt, items: cartItems, draft });
    setPendingReview({ orderId, createdAt, items: cartItems, fulfillment: draft.fulfillment });
    setReviewModalOpen(false);
    setCartItems([]);
    setCheckoutDraft(draft);
  };

  const completeOrder = () => {
    setActiveOrder(null);
    setCheckoutDraft(DEFAULT_CHECKOUT_DRAFT);
    setCheckoutOpen(false);
    if (pendingReview) setReviewModalOpen(true);
  };

  const cancelOrder = () => {
    setActiveOrder(null);
    setPendingReview(null);
    setReviewModalOpen(false);
    setCheckoutDraft(DEFAULT_CHECKOUT_DRAFT);
    setCheckoutOpen(false);
  };

  const startNewOrder = () => {
    setCheckoutDraft(DEFAULT_CHECKOUT_DRAFT);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  const browseCatalog = () => {
    setCartOpen(false);
    window.requestAnimationFrame(() =>
      document
        .getElementById('favoritos-da-casa')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSent(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-shell">
      <Header
        cartCount={totalCartCount}
        hasActiveOrder={Boolean(activeOrder)}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        onOpenCardapio={() => setCardapioOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onTrackOrder={trackOrder}
      />

      <main>
        <section className="hero-section" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">Feita para o seu momento</span>
            <h1>
              Seu momento fica melhor com <em>Attimo.</em>
            </h1>
            <p>
              Pizza artesanal, ingredientes frescos e aquele sabor que transforma qualquer encontro.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#favoritos-da-casa">
                Escolher minha pizza <ArrowRight size={16} weight="bold" />
              </a>
              <span className="delivery-note">
                <ClockCountdown size={16} weight="duotone" /> Entrega média de 30–40 min
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow" />
            <img
              src={cardapio[0].imagem}
              alt="Pizza artesanal Attimo com queijo derretido"
              referrerPolicy="no-referrer"
            />
            <span className="hero-badge">
              <strong>100%</strong>
              <small>
                ingredientes<br />frescos
              </small>
            </span>
          </div>
        </section>

        <section className="catalog-section" id="cardapio">
          <div className="catalog-toolbar">
            <div>
              <span className="eyebrow">O nosso cardápio</span>
              <h2>Escolha o seu sabor</h2>
            </div>
            <label className="search-field">
              <MagnifyingGlass size={16} weight="regular" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar no cardápio"
                aria-label="Buscar no cardápio"
              />
            </label>
          </div>
          <CategoryTabs selected={activeCategory} onSelect={setActiveCategory} />

          <div className="offer-card">
            <div>
              <span className="offer-label">Oferta da semana</span>
              <h3>Combo Attimo</h3>
              <p>Pizza média + Coca-Cola 2L + sobremesa para compartilhar.</p>
              <a href="#cardapio">
                Ver oferta <ArrowRight size={15} weight="bold" />
              </a>
            </div>
            <img
              src={favoritosDaCasa[1]?.imagem ?? cardapio[1].imagem}
              alt="Pizza do combo Attimo"
              referrerPolicy="no-referrer"
            />
            <strong className="offer-price">-15%</strong>
          </div>

          <div id="favoritos-da-casa" className="favorites-anchor">
            <SectionHeading
              title={activeCategory === 'Todos' ? 'Favoritos da casa' : activeCategory}
              action="Ver cardápio completo"
              onActionClick={() => setCardapioOpen(true)}
            />
          </div>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={openProduct} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              Nenhum item encontrado. Tente outro sabor ou categoria.
            </div>
          )}
        </section>

        <section className="experience-section" id="sobre">
          <div>
            <span className="eyebrow">Mais que uma pizza</span>
            <h2>
              Feita com calma.<br />
              <em>Vivida no seu tempo.</em>
            </h2>
            <p>
              Na Attimo, cada massa é aberta na hora e cada ingrediente é escolhido para fazer do
              seu pedido um momento especial.
            </p>
            <a className="outline-button" href="#contato">
              Conheça a Attimo <ArrowRight size={15} weight="bold" />
            </a>
          </div>
          <div className="experience-image">
            <img
              src={cardapio[4].imagem}
              alt="Pizza Attimo saindo do forno"
              referrerPolicy="no-referrer"
            />
            <span>
              massa artesanal<br />
              <strong>desde 2024</strong>
            </span>
          </div>
        </section>

        <section className="newsletter-section" id="contato">
          <div>
            <span className="eyebrow">Fique por perto</span>
            <h2>
              Novidades quentinhas<br />no seu e-mail.
            </h2>
          </div>
          <form className="newsletter-form" onSubmit={submitNewsletter}>
            <label htmlFor="email">Seu melhor e-mail</label>
            <div>
              <input id="email" type="email" required placeholder="voce@email.com" />
              <button className="primary-button" type="submit">
                {newsletterSent ? (
                  <>
                    <Check size={16} weight="bold" /> Cadastrado
                  </>
                ) : (
                  'Quero receber'
                )}
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <Logo />
        <p>Pizza artesanal para os seus melhores momentos.</p>
        <span>© 2024 Attimo Pizzaria</span>
      </footer>

      <BottomNavigation onOpenCardapio={() => setCardapioOpen(true)} />

      {cardapioOpen && (
        <CardapioOficialPage
          onClose={() => setCardapioOpen(false)}
          onSelectProduct={openProduct}
        />
      )}

      {reviewModalOpen && pendingReview && (
        <OrderReviewModal
          review={pendingReview}
          onSubmit={() => {
            setPendingReview(null);
            setReviewModalOpen(false);
          }}
          onPostpone={() => {
            setPendingReview((current) =>
              current ? { ...current, createdAt: Date.now() } : null,
            );
            setReviewModalOpen(false);
          }}
          onDismiss={() => {
            setPendingReview(null);
            setReviewModalOpen(false);
          }}
        />
      )}

      {activeProduct && (
        <ProductModal
          produto={activeProduct}
          tamanhoSelecionado={selectedSize}
          acompanhamentosSelecionados={selectedExtras}
          valorTotal={total}
          valorAcompanhamentos={selectedExtras.length * PRECO_ACOMPANHAMENTO}
          onClose={closeProduct}
          onSizeChange={setSelectedSize}
          setAcompanhamentosSelecionados={setSelectedExtras}
          onAddToCart={addToCart}
        />
      )}

      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={changeQuantity}
          onRemove={removeItem}
          onContinue={openCheckout}
          onBrowseCatalog={browseCatalog}
        />
      )}

      {checkoutOpen && (
        <CheckoutPage
          items={cartItems}
          trackedItems={activeOrder?.items ?? []}
          trackedOrderCreatedAt={activeOrder?.createdAt}
          draft={checkoutDraft}
          onDraftChange={setCheckoutDraft}
          onContinueShopping={startNewOrder}
          onChangeQuantity={changeQuantity}
          onRemove={removeItem}
          onOrderConfirmed={confirmOrder}
          onOrderCompleted={completeOrder}
          onOrderCancelled={cancelOrder}
        />
      )}
    </div>
  );
}

export default App;
