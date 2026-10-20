import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bank,
  Check,
  Copy,
  CreditCard,
  ForkKnife,
  Minus,
  Moped,
  Plus,
  QrCode,
  ShoppingBagOpen,
  Storefront,
} from '@phosphor-icons/react';
import type { CartItem, CheckoutDraft, DeliveryAddress, Fulfillment, PaymentMethod } from '../types';
import { formatCurrency } from '../utils';

type CheckoutPageProps = {
  items: CartItem[];
  trackedItems: CartItem[];
  trackedOrderCreatedAt?: number;
  draft: CheckoutDraft;
  onDraftChange: (draft: CheckoutDraft) => void;
  onContinueShopping: () => void;
  onChangeQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onOrderConfirmed: (draft: CheckoutDraft) => void;
  onOrderCompleted: () => void;
  onOrderCancelled: () => void;
};

const steps = ['Sacola', 'Entrega', 'Pagamento', 'Concluído'];
const fulfillmentOptions: { value: Fulfillment; icon: ReactNode; label: string; description: string }[] = [
  { value: 'delivery', icon: <Moped size={24} weight="duotone" />, label: 'Entrega', description: 'Receba em casa' },
  { value: 'pickup', icon: <Storefront size={24} weight="duotone" />, label: 'Retirar', description: 'Busque na Attimo' },
  { value: 'dine-in', icon: <ForkKnife size={24} weight="duotone" />, label: 'Na pizzaria', description: 'Comer no local' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return <div className="checkout-steps" aria-label="Etapas do pedido">{steps.map((step, index) => <div className={index + 1 <= currentStep ? 'checkout-step active' : 'checkout-step'} key={step}><span>{index + 1}</span><strong>{step}</strong></div>)}</div>;
}

function OrderItems({ items, onChangeQuantity, onRemove }: Pick<CheckoutPageProps, 'items' | 'onChangeQuantity' | 'onRemove'>) {
  return <div className="checkout-table" role="table" aria-label="Itens do pedido">
    <div className="checkout-table-head" role="row"><span>Produto</span><span>Quantidade</span><span>Valor</span></div>
    {items.map((item) => <article className="checkout-row" role="row" key={item.id}>
      <div className="checkout-product"><img src={item.product.imagem} alt="" referrerPolicy="no-referrer" /><div><h2>{item.product.nome}</h2><p>{item.size}{item.extras.length > 0 ? ` · ${item.extras.length} adicional(is)` : ''}</p><button className="remove-checkout-item" type="button" onClick={() => onRemove(item.id)}>Remover</button></div></div>
      <div className="checkout-quantity"><div className="quantity-control"><button type="button" onClick={() => onChangeQuantity(item.id, item.quantity - 1)} aria-label="Diminuir quantidade"><Minus size={14} weight="bold" /></button><strong>{item.quantity}</strong><button type="button" onClick={() => onChangeQuantity(item.id, item.quantity + 1)} aria-label="Aumentar quantidade"><Plus size={14} weight="bold" /></button></div></div>
      <strong className="checkout-price">{formatCurrency(item.unitPrice * item.quantity)}</strong>
    </article>)}
  </div>;
}

function FulfillmentSelector({ value, onChange }: { value: Fulfillment; onChange: (value: Fulfillment) => void }) {
  return <div className="fulfillment-grid">{fulfillmentOptions.map((option) => <label className={value === option.value ? 'fulfillment-option selected' : 'fulfillment-option'} key={option.value}><input type="radio" name="fulfillment" checked={value === option.value} onChange={() => onChange(option.value)} /><span>{option.icon}</span><strong>{option.label}</strong><small>{option.description}</small></label>)}</div>;
}

function AddressForm({ address, onChange }: { address: DeliveryAddress; onChange: (address: DeliveryAddress) => void }) {
  const update = (field: keyof DeliveryAddress) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...address, [field]: event.target.value });
  return <div className="address-form"><div className="checkout-form-heading"><span className="eyebrow">Etapa 2</span><h2>Onde devemos entregar?</h2><p>Preencha o endereço para calcular a entrega.</p></div><div className="address-grid">
    <label>CEP<input required inputMode="numeric" value={address.zipCode} onChange={update('zipCode')} placeholder="00000-000" /></label>
    <label>Estado<select required value={address.state} onChange={update('state')}><option value="">Selecione</option><option>SP</option><option>RJ</option><option>MG</option><option>PR</option></select></label>
    <label className="wide-field">Endereço<input required value={address.street} onChange={update('street')} placeholder="Rua, avenida..." /></label>
    <label>Número<input required inputMode="numeric" value={address.number} onChange={update('number')} placeholder="123" /></label>
    <label>Complemento<input value={address.complement} onChange={update('complement')} placeholder="Apto, bloco..." /></label>
    <label className="wide-field">Bairro<input required value={address.neighborhood} onChange={update('neighborhood')} placeholder="Seu bairro" /></label>
    <label>Cidade<input required value={address.city} onChange={update('city')} placeholder="Sua cidade" /></label>
    <label>Referência<input value={address.reference} onChange={update('reference')} placeholder="Próximo a..." /></label>
  </div></div>;
}

function PaymentOptions({ method, installments, onChange, onInstallmentsChange }: { method: PaymentMethod; installments: string; onChange: (method: PaymentMethod) => void; onInstallmentsChange: (value: string) => void }) {
  return <div className="payment-form"><div className="checkout-form-heading"><span className="eyebrow">Etapa 3</span><h2>Como você quer pagar?</h2><p>O entregador não realiza cobranças. O pagamento é feito pelo sistema.</p></div><div className="payment-methods">
    <button className={method === 'pix' ? 'payment-method selected' : 'payment-method'} type="button" onClick={() => onChange('pix')}><span><QrCode size={24} weight="duotone" /></span><strong>Pix</strong><small>QR Code e copia e cola</small></button>
    <button className={method === 'credit' ? 'payment-method selected' : 'payment-method'} type="button" onClick={() => onChange('credit')}><span><CreditCard size={24} weight="duotone" /></span><strong>Cartão de crédito</strong><small>Parcele sua compra</small></button>
    <button className={method === 'debit' ? 'payment-method selected' : 'payment-method'} type="button" onClick={() => onChange('debit')}><span><Bank size={24} weight="duotone" /></span><strong>Débito / conta</strong><small>Pagamento à vista</small></button>
  </div>
  {method === 'pix' && <div className="pix-preview"><div className="qr-placeholder" aria-hidden="true">{Array.from({ length: 25 }, (_, index) => <i key={index} className={(index * 7 + 3) % 5 < 2 ? 'filled' : ''} />)}</div><div><strong>QR Code Pix</strong><p>O QR Code será gerado ao confirmar o pedido.</p><button className="copy-pix" type="button"><Copy size={14} weight="bold" /> Copiar código Pix</button></div></div>}
  {method === 'credit' && <div className="card-fields"><label>Número do cartão<input required inputMode="numeric" placeholder="0000 0000 0000 0000" /></label><div><label>Validade<input required placeholder="MM/AA" /></label><label>CVV<input required inputMode="numeric" placeholder="000" /></label></div><label>Parcelas<select value={installments} onChange={(event) => onInstallmentsChange(event.target.value)}><option value="1">1x sem juros</option><option value="2">2x sem juros</option><option value="3">3x sem juros</option></select></label></div>}
  {method === 'debit' && <div className="payment-notice">Você será direcionado ao ambiente seguro do banco para concluir o pagamento.</div>}</div>;
}

function OrderTracking({ fulfillment, items, createdAt, onComplete, onCancel }: { fulfillment: Fulfillment; items: CartItem[]; createdAt?: number; onComplete: () => void; onCancel: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 30_000); return () => window.clearInterval(timer); }, []);
  const statuses = fulfillment === 'delivery' ? ['Pedido recebido', 'Pizza em preparo', 'Pedido pronto', 'Saiu para entrega'] : ['Pedido recebido', 'Pizza em preparo', fulfillment === 'pickup' ? 'Disponível para retirada' : 'Pronto para servir'];
  const cancellationAvailable = createdAt !== undefined && now - createdAt <= 15 * 60 * 1000;
  const completionLabel = fulfillment === 'delivery' ? 'Confirmar recebimento' : fulfillment === 'pickup' ? 'Confirmar retirada' : 'Confirmar consumo';
  const orderTotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) + (fulfillment === 'delivery' ? 8 : 0);
  return <div className="tracking-card">
    <span className="eyebrow">Acompanhe seu pedido</span>
    <h2>{fulfillment === 'delivery' ? 'Sua pizza está a caminho.' : 'Seu pedido está sendo preparado.'}</h2>
    <p>O pedido está bloqueado para alterações após a confirmação do pagamento.</p>
    <div className="tracking-order-summary">
      <div className="tracking-summary-heading"><strong>Itens do pedido</strong><span>{fulfillment === 'delivery' ? 'Entrega' : fulfillment === 'pickup' ? 'Retirada' : 'Na pizzaria'}</span></div>
      {items.map((item) => <div className="tracking-order-item" key={item.id}><span>{item.quantity}x {item.product.nome.replace('Pizza ', '')} · {item.size}</span><strong>{formatCurrency(item.unitPrice * item.quantity)}</strong></div>)}
      <div className="tracking-order-total"><span>Total</span><strong>{formatCurrency(orderTotal)}</strong></div>
    </div>
    <div className="tracking-list">{statuses.map((status, index) => <div className={index === 0 ? 'tracking-item current' : 'tracking-item'} key={status}><span>{index === 0 ? <Check size={15} weight="bold" /> : index + 1}</span><div><strong>{status}</strong><small>{index === 0 ? 'Confirmado agora' : index === statuses.length - 1 ? 'Aguardando atualização' : 'Em breve'}</small></div></div>)}</div>
    <div className="tracking-note">{fulfillment === 'delivery' ? 'Quando sair para entrega, a previsão e a rota serão exibidas aqui.' : 'Avisaremos quando estiver pronto para você.'}</div>
    <div className="tracking-actions"><button className="primary-button tracking-complete-button" type="button" onClick={onComplete}>{completionLabel}</button>{cancellationAvailable && <button className="continue-shopping" type="button" onClick={onCancel}>Cancelar pedido</button>}</div>
  </div>;
}

export function CheckoutPage({ items, trackedItems, trackedOrderCreatedAt, draft, onDraftChange, onContinueShopping, onChangeQuantity, onRemove, onOrderConfirmed, onOrderCompleted, onOrderCancelled }: CheckoutPageProps) {
  const isTracking = draft.currentStep === 4;
  const displayItems = isTracking ? trackedItems : items;
  const subtotal = displayItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const deliveryFee = draft.fulfillment === 'delivery' ? 8 : 0;
  const total = subtotal + deliveryFee;
  const updateDraft = (changes: Partial<CheckoutDraft>) => onDraftChange({ ...draft, ...changes });
  const advance = () => {
    if (draft.currentStep === 3) { onOrderConfirmed({ ...draft, currentStep: 4 }); return; }
    updateDraft({ currentStep: draft.currentStep === 1 ? (draft.fulfillment === 'delivery' ? 2 : 3) : Math.min(draft.currentStep + 1, 4) });
  };
  const goBack = () => updateDraft({ currentStep: draft.currentStep === 3 && draft.fulfillment !== 'delivery' ? 1 : Math.max(draft.currentStep - 1, 1) });
  const title = draft.currentStep === 1 ? 'Minha sacola' : draft.currentStep === 2 ? 'Endereço de entrega' : draft.currentStep === 3 ? 'Pagamento' : 'Pedido em andamento';
  return <main className="checkout-page"><div className="checkout-heading"><div><span className="eyebrow">{isTracking ? 'Pedido em andamento' : 'Seu pedido'}</span><h1>{title}</h1></div><p>Etapa {draft.currentStep} de 4</p></div><StepIndicator currentStep={draft.currentStep} />
    {displayItems.length === 0 ? <div className="checkout-empty"><span><ShoppingBagOpen size={48} weight="duotone" /></span><h2>Sua sacola está vazia</h2><p>Adicione uma pizza para continuar o pedido.</p><button className="primary-button" type="button" onClick={onContinueShopping}>Voltar ao cardápio</button></div> : <div className="checkout-layout"><section className="checkout-content">
      {draft.currentStep === 1 && <><OrderItems items={displayItems} onChangeQuantity={onChangeQuantity} onRemove={onRemove} /><div className="checkout-options"><h2>Como você quer receber?</h2><FulfillmentSelector value={draft.fulfillment} onChange={(fulfillment) => updateDraft({ fulfillment })} /></div></>}
      {draft.currentStep === 2 && <AddressForm address={draft.address} onChange={(address) => updateDraft({ address })} />}
      {draft.currentStep === 3 && <PaymentOptions method={draft.paymentMethod} installments={draft.installments} onChange={(paymentMethod) => updateDraft({ paymentMethod })} onInstallmentsChange={(installments) => updateDraft({ installments })} />}
      {draft.currentStep === 4 && <><OrderTracking fulfillment={draft.fulfillment} items={displayItems} createdAt={trackedOrderCreatedAt} onComplete={onOrderCompleted} onCancel={onOrderCancelled} /><div className="new-order-callout"><strong>Quer pedir mais?</strong><p>Você pode iniciar um novo pedido sem alterar este pedido em andamento.</p><button className="primary-button" type="button" onClick={onContinueShopping}>Fazer novo pedido</button></div></>}
      {draft.currentStep > 1 && draft.currentStep < 4 && <div className="checkout-navigation"><button className="continue-shopping" type="button" onClick={goBack}><ArrowLeft size={14} weight="bold" /> Voltar</button><button className="primary-button" type="button" onClick={advance}>{draft.currentStep === 3 ? 'Confirmar pagamento' : 'Ir para pagamento'} <ArrowRight size={15} weight="bold" /></button></div>}
    </section><aside className="checkout-summary"><span className="eyebrow">Resumo</span><h2>Detalhes do pedido</h2><div className="summary-line"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div className="summary-line muted"><span>Entrega</span><span>{deliveryFee ? formatCurrency(deliveryFee) : 'Grátis'}</span></div><div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div><p className="payment-hint">{isTracking ? 'Pedido pago e bloqueado para alterações.' : draft.currentStep < 3 ? 'O pagamento será escolhido na próxima etapa.' : 'Pagamento seguro processado pela Attimo.'}</p>{draft.currentStep === 1 && <button className="primary-button checkout-submit" type="button" onClick={advance}>Continuar <ArrowRight size={15} weight="bold" /></button>}{!isTracking && <button className="continue-shopping" type="button" onClick={onContinueShopping}><ArrowLeft size={14} weight="bold" /> Continuar comprando</button>}</aside></div>}
  </main>;
}
