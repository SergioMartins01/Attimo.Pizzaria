import { useEffect } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { cardapioOficialDoces, cardapioOficialSalgadas } from '../data';
import brandLogo from '../img/Captura de tela 2026-09-01 210620.png';
import type { Produto } from '../types';

type CardapioOficialPageProps = {
  onClose: () => void;
  onSelectProduct: (product: Produto) => void;
};

export function CardapioOficialPage({ onClose, onSelectProduct }: CardapioOficialPageProps) {
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
