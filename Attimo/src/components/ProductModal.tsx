import type { Dispatch, SetStateAction } from 'react';
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
}: ProductModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28, 20, 18, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '760px',
          background: '#fffdfb',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        }}
      >
        <img src={produto.imagem} alt={produto.nome} referrerPolicy="no-referrer" style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: '#2d2826', fontSize: '2rem' }}>{produto.nome}</h2>
            <button type="button" onClick={onClose} aria-label="Fechar detalhes" style={{ background: '#f0e7e1', border: 'none', borderRadius: '50%', width: '34px', height: '34px', fontSize: '26px', cursor: 'pointer', color: '#2d2826' }}>
              ×
            </button>
          </div>

          <p style={{ margin: '14px 0 18px', color: '#514744', lineHeight: 1.6 }}>{produto.descricao}</p>

          <div style={{ marginBottom: '18px' }}>
            <strong style={{ display: 'block', marginBottom: '8px', color: '#352e2c', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ingredientes</strong>
            <span style={{ color: '#514744' }}>{produto.ingredientes.join(', ')}</span>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <strong style={{ display: 'block', marginBottom: '10px', color: '#352e2c', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tamanho</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {produto.tamanhos.map((tamanho) => (
                <button
                  type="button"
                  key={tamanho.nome}
                  onClick={() => onSizeChange(tamanho.nome)}
                  style={{ border: '1px solid rgba(180,84,60,0.4)', background: tamanhoSelecionado === tamanho.nome ? '#c4453a' : '#fff', color: tamanhoSelecionado === tamanho.nome ? '#fff' : '#2d2826', borderRadius: '999px', padding: '9px 12px', cursor: 'pointer', fontWeight: 700 }}
                >
                  {tamanho.nome} · {formatCurrency(tamanho.preco)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '10px', color: '#352e2c', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Acompanhamentos sugeridos</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {produto.acompanhamentos.map((item) => {
                const selecionado = acompanhamentosSelecionados.includes(item);
                return (
                  <label key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: selecionado ? '#fbe6d1' : '#f3efe8', borderRadius: '999px', padding: '8px 12px', border: selecionado ? '1px solid #d9a26d' : '1px solid transparent', color: '#2d2826', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selecionado}
                      onChange={() => setAcompanhamentosSelecionados((atual) => atual.includes(item) ? atual.filter((acompanhamento) => acompanhamento !== item) : [...atual, item])}
                      style={{ accentColor: '#c4453a' }}
                    />
                    {item} · +R$ 6,00
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderTop: '1px solid #f0e7e3', paddingTop: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#6d5c56', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Valor total</div>
              <div style={{ color: '#c4453a', fontSize: '1.9rem', fontWeight: 700 }}>{formatCurrency(valorTotal)}</div>
              <div style={{ color: '#6d5c56', fontSize: '0.82rem' }}>+{formatCurrency(valorAcompanhamentos)} em sugestões</div>
            </div>
            <button type="button" style={{ background: '#c4453a', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>Adicionar ao Pedido</button>
          </div>
        </div>
      </div>
    </div>
  );
}
