import { Minus, Plus, ShoppingBagOpen, Trash, X } from '@phosphor-icons/react';
import type { CartItem } from '../types';
import { formatCurrency } from '../utils';

type CartDrawerProps = {
  items: CartItem[];
  onClose: () => void;
  onChangeQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onContinue: () => void;
  onBrowseCatalog: () => void;
};

export function CartDrawer({ items, onClose, onChangeQuantity, onRemove, onContinue, onBrowseCatalog }: CartDrawerProps) {
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  return (
    <div className="cart-layer" onClick={onClose}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}>
        <header className="cart-drawer-header">
          <button className="drawer-close" type="button" onClick={onClose} aria-label="Fechar sacola">
            <X size={18} weight="bold" />
          </button>
          <h2 id="cart-title">Minha sacola</h2>
          <span aria-hidden="true" />
        </header>
        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon"><ShoppingBagOpen size={44} weight="duotone" /></span>
            <h3>Sua sacola está vazia</h3>
            <p>Escolha uma pizza deliciosa para começar.</p>
            <button className="primary-button" type="button" onClick={onBrowseCatalog}>Ver cardápio</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.product.imagem} alt="" referrerPolicy="no-referrer" />
                  <div className="cart-item-body">
                    <div className="cart-item-heading">
                      <div>
                        <h3>{item.product.nome.replace('Pizza ', '')}</h3>
                        <span>{item.size}{item.extras.length > 0 ? ` · ${item.extras.length} adicional(is)` : ''}</span>
                      </div>
                      <button className="remove-item" type="button" onClick={() => onRemove(item.id)} aria-label={`Remover ${item.product.nome}`}>
                        <Trash size={17} weight="regular" />
                      </button>
                    </div>
                    <div className="cart-item-footer">
                      <div className="quantity-control" aria-label={`Quantidade de ${item.product.nome}`}>
                        <button type="button" onClick={() => onChangeQuantity(item.id, item.quantity - 1)} aria-label="Diminuir quantidade">
                          <Minus size={14} weight="bold" />
                        </button>
                        <strong>{item.quantity}</strong>
                        <button type="button" onClick={() => onChangeQuantity(item.id, item.quantity + 1)} aria-label="Aumentar quantidade">
                          <Plus size={14} weight="bold" />
                        </button>
                      </div>
                      <strong className="cart-item-price">{formatCurrency(item.unitPrice * item.quantity)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-discount">
              <label htmlFor="coupon">Cupom de desconto</label>
              <div><input id="coupon" placeholder="Código do cupom" /><button type="button">Aplicar</button></div>
            </div>
            <footer className="cart-summary">
              <div><strong>Subtotal:</strong><strong>{formatCurrency(subtotal)}</strong></div>
              <button className="primary-button" type="button" onClick={onContinue}>Continuar</button>
              <small>Entrega e pagamento serão escolhidos no próximo passo.</small>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
