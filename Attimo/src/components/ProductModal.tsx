import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { ShoppingBagOpen, Star, X } from '@phosphor-icons/react';
import type { Produto, Tamanho } from '../types';
import { formatCurrency } from '../utils';

type ProductModalProps = {
  produto: Produto;
  tamanhoSelecionado: Tamanho;
  acompanhamentosSelecionados: string[];
  valorTotal: number;
  valorAcompanhamentos: number;
  onClose: () => void;
  onSizeChange: (tamanho: Tamanho) => void;
  setAcompanhamentosSelecionados: Dispatch<SetStateAction<string[]>>;
  onAddToCart: () => void;
};

export function ProductModal({
  produto,
  tamanhoSelecionado,
  acompanhamentosSelecionados,
  valorTotal,
  valorAcompanhamentos,
  onClose,
  onSizeChange,
  setAcompanhamentosSelecionados,
  onAddToCart,
}: ProductModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-image-wrap">
          <img src={produto.imagem} alt={produto.nome} referrerPolicy="no-referrer" />
          <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar detalhes">
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="modal-content">
          <span className="eyebrow">Escolha do dia</span>
          <div className="modal-title-row">
            <h2 id="product-modal-title">{produto.nome}</h2>
            <span className="modal-rating"><Star size={14} weight="fill" /> 4,9</span>
          </div>
          <p className="modal-description">{produto.descricao}</p>
          <p className="ingredients"><strong>Ingredientes:</strong> {produto.ingredientes.join(', ')}</p>

          <fieldset className="option-group">
            <legend>Tamanho</legend>
            <div className="size-options">
              {produto.tamanhos.map((size) => (
                <button className={tamanhoSelecionado === size.nome ? 'size-option selected' : 'size-option'} key={size.nome} type="button" onClick={() => onSizeChange(size.nome)}>
                  <span>{size.nome.replace('Extra Grande', 'GG')}</span>
                  <small>{formatCurrency(size.preco)}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="option-group">
            <legend>Quer acompanhar?</legend>
            <div className="extra-options">
              {produto.acompanhamentos.map((item) => {
                const selected = acompanhamentosSelecionados.includes(item);
                return (
                  <label className={selected ? 'extra-option selected' : 'extra-option'} key={item}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => setAcompanhamentosSelecionados((current) => current.includes(item) ? current.filter((extra) => extra !== item) : [...current, item])}
                    />
                    <span>{item}</span>
                    <small>+ R$ 6,00</small>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="modal-footer">
            <div><small>Total do pedido</small><strong>{formatCurrency(valorTotal)}</strong>{valorAcompanhamentos > 0 && <span>+ {formatCurrency(valorAcompanhamentos)} em adicionais</span>}</div>
            <button className="primary-button" type="button" onClick={onAddToCart}>
              <ShoppingBagOpen size={17} weight="bold" />
              Adicionar ao pedido
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
