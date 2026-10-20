import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BeerBottle,
  BookOpenText,
  Check,
  CheckCircle,
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
  X,
} from '@phosphor-icons/react';
import { cardapio, favoritosDaCasa } from './data';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { ProductModal } from './components/ProductModal';
import brandLogo from './img/Captura de tela 2026-09-01 210620.png';
import './checkout.css';
import type { ActiveOrder, CartItem, CheckoutDraft, PendingReview, Produto, Tamanho } from './types';
import { calculateOrderTotal, formatCurrency } from './utils';

type Category = 'Todos' | 'Pizzas' | 'Bebidas' | 'Acompanhamentos';

const categories: { label: Category; icon: ReactNode }[] = [
  { label: 'Todos', icon: <SquaresFour size={16} weight="duotone" /> },
  { label: 'Pizzas', icon: <Pizza size={16} weight="duotone" /> },
  { label: 'Bebidas', icon: <BeerBottle size={16} weight="duotone" /> },
  { label: 'Acompanhamentos', icon: <ForkKnife size={16} weight="duotone" /> },
];

const cardapioOficialSalgadas: Produto[] = [
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

const cardapioOficialDoces: Produto[] = [
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

function productCategory(product: Produto): Exclude<Category, 'Todos'> {
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

function Header({
  cartCount,
  hasActiveOrder,
  theme,
  onToggleTheme,
  onOpenCardapio,
  onOpenCart,
  onTrackOrder,
}: {
  cartCount: number;
  hasActiveOrder: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCardapio: () => void;
  onOpenCart: () => void;
  onTrackOrder: () => void;
}) {
  return (
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Navegação principal">
        <a className="active" href="#inicio">Início</a>
        <button className="nav-link-button" type="button" onClick={onOpenCardapio}>Cardápio</button>
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
        <button className="cart-button" type="button" onClick={onOpenCart} aria-label={`Carrinho com ${cartCount} itens`}>
          <ShoppingBagOpen size={19} weight="regular" />
          {cartCount > 0 && <b>{cartCount}</b>}
        </button>
      </div>
    </header>
  );
}

function CardapioOficialPage({
  onClose,
  onSelectProduct,
}: {
  onClose: () => void;
  onSelectProduct: (product: Produto) => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <main className="cardapio-page" aria-label="Cardápio Attimo Pizzaria">
      <div className="cardapio-page-topbar">
        <button className="cardapio-back-btn" type="button" onClick={onClose}>
          <ArrowLeft size={16} weight="bold" /> Voltar ao início
        </button>
      </div>

      <section className="attimo-cardapio-sheet">
        <header className="attimo-cardapio-header">
          <img className="attimo-cardapio-logo" src={brandLogo} alt="Attimo Pizzaria" />
          <p className="attimo-cardapio-subtitle">
            Pizza contemporânea<br />
            Longa fermentação · Feita à mão · Congelada<br />
            Pronta quando o momento pede.
          </p>
        </header>

        <div className="attimo-cardapio-section">
          <div className="attimo-cardapio-section-title">
            <h2>SALGADAS</h2>
            <span className="attimo-cardapio-line" aria-hidden="true" />
          </div>
          <div className="attimo-cardapio-items">
            {cardapioOficialSalgadas.map((item) => (
              <button
                key={item.id}
                type="button"
                className="attimo-cardapio-row"
                onClick={() => onSelectProduct(item)}
              >
                <div className="attimo-cardapio-row-head">
                  <strong>{item.nome.replace('Pizza ', '').toUpperCase()}</strong>
                  <span>R$ 34,90</span>
                </div>
                <p>{item.descricao}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="attimo-cardapio-section">
          <div className="attimo-cardapio-section-title">
            <h2>DOCES</h2>
            <span className="attimo-cardapio-line" aria-hidden="true" />
          </div>
          <div className="attimo-cardapio-items">
            {cardapioOficialDoces.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === cardapioOficialDoces.length - 1 ? 'attimo-cardapio-row no-border' : 'attimo-cardapio-row'}
                onClick={() => onSelectProduct(item)}
              >
                <div className="attimo-cardapio-row-head">
                  <strong>{item.nome.replace('Pizza ', '').toUpperCase()}</strong>
                  <span>R$ 34,90</span>
                </div>
                <p>{item.descricao}</p>
              </button>
            ))}
          </div>
        </div>

        <footer className="attimo-cardapio-footer">
          Preços Promocionais de Soft Opening
        </footer>
      </section>
    </main>
  );
}

const reviewTags = ['Sabor incrível', 'Massa perfeita', 'Chegou quentinha', 'Entrega rápida', 'Embalagem caprichada'];
const ratingLabels: Record<number, string> = {
  1: 'Ruim',
  2: 'Regular',
  3: 'Bom',
  4: 'Muito bom',
  5: 'Excelente!',
};

function OrderReviewModal({
  review,
  onSubmit,
  onPostpone,
  onDismiss,
}: {
  review: PendingReview;
  onSubmit: () => void;
  onPostpone: () => void;
  onDismiss: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sabor incrível']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => {
      onSubmit();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onPostpone}>
      <section
        className="product-modal review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-content">
          <div className="review-modal-header">
            <div>
              <span className="eyebrow">Avaliação do pedido anterior</span>
              <h2 id="review-modal-title">Como foi o seu último pedido?</h2>
            </div>
            <button className="drawer-close" type="button" onClick={onPostpone} aria-label="Fechar avaliação">
              <X size={18} weight="bold" />
            </button>
          </div>

          {submitted ? (
            <div className="review-thank-you">
              <span><CheckCircle size={30} weight="duotone" /></span>
              <h3>Obrigado pela sua avaliação!</h3>
              <p>Sua opinião ajuda a Attimo a preparar momentos cada vez melhores.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="modal-description">
                Conte para nós o que achou do seu pedido anterior na Attimo:
              </p>

              <div className="review-order-items">
                {review.items.map((item) => (
                  <span key={item.id} className="badge">
                    {item.quantity}x {item.product.nome.replace('Pizza ', '')} ({item.size})
                  </span>
                ))}
              </div>

              <div className="review-stars-block">
                <div className="review-stars" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= rating ? 'star-button active' : 'star-button'}
                      onClick={() => setRating(star)}
                      aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                      aria-checked={rating === star}
                      role="radio"
                    >
                      <Star size={20} weight={star <= rating ? 'fill' : 'regular'} />
                    </button>
                  ))}
                </div>
                <strong className="review-rating-label">{ratingLabels[rating]}</strong>
              </div>

              <fieldset className="option-group">
                <legend>O que você mais gostou?</legend>
                <div className="extra-options">
                  {reviewTags.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={active ? 'category-tab selected' : 'category-tab'}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="review-comment-label">
                Deixe um comentário (opcional)
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="A massa estava crocante? Chegou no tempo esperado?"
                />
              </label>

              <div className="review-actions">
                <button type="button" className="continue-shopping" onClick={onDismiss}>
                  Não avaliar
                </button>
                <div className="review-actions-right">
                  <button type="button" className="outline-button" onClick={onPostpone}>
                    Responder depois
                  </button>
                  <button type="submit" className="primary-button">
                    Enviar avaliação
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

const defaultCheckoutDraft: CheckoutDraft = {
  currentStep: 1,
  fulfillment: 'delivery',
  paymentMethod: 'pix',
  installments: '1',
  address: { zipCode: '', state: '', street: '', number: '', complement: '', neighborhood: '', city: '', reference: '' },
};

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
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

function SectionHeading({ eyebrow, title, action, onActionClick }: { eyebrow?: string; title: string; action?: string; onActionClick?: () => void }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action && (
        onActionClick ? (
          <button type="button" className="primary-button" onClick={onActionClick}>
            <BookOpenText size={16} weight="duotone" />
            {action}
            <ArrowRight size={15} weight="bold" />
          </button>
        ) : (
          <a href="#favoritos-da-casa" className="primary-button">{action} <ArrowRight size={15} weight="bold" /></a>
        )
      )}
    </div>
  );
}

function ProductCard({ product, onOpen }: { product: Produto; onOpen: (product: Produto) => void }) {
  const mediumPrice = product.tamanhos.find((size) => size.nome === 'Média')?.preco ?? product.tamanhos[0].preco;

  return (
    <article className="product-card">
      <button className="product-image-button" type="button" onClick={() => onOpen(product)} aria-label={`Ver ${product.nome}`}>
        <img src={product.imagem} alt="" referrerPolicy="no-referrer" />
        <span className="favorite-button" aria-hidden="true"><Heart size={16} weight="regular" /></span>
      </button>
      <div className="product-card-content">
        <div className="product-card-title">
          <h3>{product.nome.replace('Pizza ', '')}</h3>
          <span className="rating"><Star size={12} weight="fill" /> 4,9</span>
        </div>
        <p>{product.descricao}</p>
        <div className="product-card-footer">
          <strong>{formatCurrency(mediumPrice)}</strong>
          <button type="button" onClick={() => onOpen(product)} aria-label={`Adicionar ${product.nome}`}>
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
      <a className="active" href="#inicio"><span><House size={20} weight="duotone" /></span>Início</a>
      <button type="button" className="bottom-nav-button" onClick={onOpenCardapio}><span><BookOpenText size={20} weight="duotone" /></span>Cardápio</button>
      <a href="#sobre"><span><Heart size={20} weight="duotone" /></span>Favoritos</a>
      <a href="#contato"><span><User size={20} weight="duotone" /></span>Perfil</a>
    </nav>
  );
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readStoredValue('attimo-theme', 'light'));
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [search, setSearch] = useState('');
  const [activeProduct, setActiveProduct] = useState<Produto | null>(null);
  const [selectedSize, setSelectedSize] = useState<Tamanho>('Média');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => readStoredValue('attimo-cart', []));
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft>(() => readStoredValue('attimo-checkout', defaultCheckoutDraft));
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => readStoredValue('attimo-active-order', null));
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(() => readStoredValue('attimo-pending-review', null));
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(() => Boolean(readStoredValue('attimo-pending-review', null)));
  const [cardapioOpen, setCardapioOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('attimo-theme', JSON.stringify(theme));
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

  useEffect(() => { window.localStorage.setItem('attimo-cart', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { window.localStorage.setItem('attimo-checkout', JSON.stringify(checkoutDraft)); }, [checkoutDraft]);
  useEffect(() => {
    if (activeOrder) window.localStorage.setItem('attimo-active-order', JSON.stringify(activeOrder));
    else window.localStorage.removeItem('attimo-active-order');
  }, [activeOrder]);
  useEffect(() => {
    if (pendingReview) window.localStorage.setItem('attimo-pending-review', JSON.stringify(pendingReview));
    else window.localStorage.removeItem('attimo-pending-review');
  }, [pendingReview]);

  useEffect(() => {
    if (!pendingReview) return;

    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const elapsed = Date.now() - pendingReview.createdAt;

    if (elapsed >= TEN_MINUTES_MS) {
      setReviewModalOpen(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setReviewModalOpen(true);
    }, TEN_MINUTES_MS - elapsed);

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
    if (!activeProduct) return;
    const unitPrice = total;
    const existing = cartItems.find((item) => item.product.id === activeProduct.id && item.size === selectedSize && item.extras.join('|') === selectedExtras.join('|'));
    if (existing) {
      setCartItems((items) => items.map((item) => item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCartItems((items) => [...items, { id: `${activeProduct.id}-${Date.now()}`, product: activeProduct, size: selectedSize, extras: selectedExtras, unitPrice, quantity: 1 }]);
    }
    closeProduct();
    setCartOpen(true);
  };

  const changeQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) setCartItems((items) => items.filter((item) => item.id !== itemId));
    else setCartItems((items) => items.map((item) => item.id === itemId ? { ...item, quantity } : item));
  };

  const removeItem = (itemId: string) => setCartItems((items) => items.filter((item) => item.id !== itemId));
  const openCheckout = () => { setCartOpen(false); setCardapioOpen(false); setCheckoutOpen(true); setCheckoutDraft((draft) => ({ ...draft, currentStep: 1 })); };
  const trackOrder = () => { if (activeOrder) { setCardapioOpen(false); setCheckoutDraft(activeOrder.draft); setCheckoutOpen(true); } };
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
    setCheckoutDraft(defaultCheckoutDraft);
    setCheckoutOpen(false);
    if (pendingReview) setReviewModalOpen(true);
  };
  const cancelOrder = () => {
    setActiveOrder(null);
    setPendingReview(null);
    setReviewModalOpen(false);
    setCheckoutDraft(defaultCheckoutDraft);
    setCheckoutOpen(false);
  };
  const startNewOrder = () => { setCheckoutDraft(defaultCheckoutDraft); setCheckoutOpen(false); setCartOpen(false); };
  const browseCatalog = () => {
    setCartOpen(false);
    window.requestAnimationFrame(() => document.getElementById('favoritos-da-casa')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSent(true);
  };

  const total = calculateOrderTotal(activeProduct, selectedSize, selectedExtras);

  return (
    <div className="app-shell">
      <Header
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
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
            <h1>Seu momento fica melhor com <em>Attimo.</em></h1>
            <p>Pizza artesanal, ingredientes frescos e aquele sabor que transforma qualquer encontro.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#favoritos-da-casa">Escolher minha pizza <ArrowRight size={16} weight="bold" /></a>
              <span className="delivery-note"><ClockCountdown size={16} weight="duotone" /> Entrega média de 30–40 min</span>
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
              <MagnifyingGlass size={16} weight="regular" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no cardápio" aria-label="Buscar no cardápio" />
            </label>
          </div>
          <CategoryTabs selected={activeCategory} onSelect={setActiveCategory} />

          <div className="offer-card">
            <div>
              <span className="offer-label">Oferta da semana</span>
              <h3>Combo Attimo</h3>
              <p>Pizza média + Coca-Cola 2L + sobremesa para compartilhar.</p>
              <a href="#cardapio">Ver oferta <ArrowRight size={15} weight="bold" /></a>
            </div>
            <img src={favoritosDaCasa[1]?.imagem ?? cardapio[1].imagem} alt="Pizza do combo Attimo" referrerPolicy="no-referrer" />
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
            <a className="outline-button" href="#contato">Conheça a Attimo <ArrowRight size={15} weight="bold" /></a>
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
              <button className="primary-button" type="submit">
                {newsletterSent ? <><Check size={16} weight="bold" /> Cadastrado</> : 'Quero receber'}
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
            setPendingReview((current) => (current ? { ...current, createdAt: Date.now() } : null));
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
          valorAcompanhamentos={selectedExtras.length * 6}
          onClose={closeProduct}
          onSizeChange={setSelectedSize}
          setAcompanhamentosSelecionados={setSelectedExtras}
          onAddToCart={addToCart}
        />
      )}
      {cartOpen && <CartDrawer items={cartItems} onClose={() => setCartOpen(false)} onChangeQuantity={changeQuantity} onRemove={removeItem} onContinue={openCheckout} onBrowseCatalog={browseCatalog} />}
      {checkoutOpen && <CheckoutPage
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
      />}
    </div>
  );
}

export default App;
