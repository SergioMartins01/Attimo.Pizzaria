import { useState, type FormEvent } from 'react';
import { cardapio, depoimentos, favoritosDaCasa, miniOfertas, sabores } from './data';
import { ProductModal } from './components/ProductModal';
import type { Produto, Tamanho } from './types';
import { calculateOrderTotal, findProductForFlavor, formatCurrency } from './utils';

function App() {
  const [produtoAtivo, setProdutoAtivo] = useState<Produto | null>(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<Tamanho>('Média');
  const [acompanhamentoSelecionado, setAcompanhamentoSelecionado] = useState<string[]>([]);
  const [pizzaMontando, setPizzaMontando] = useState(false);
  const [newsletterConsentimento, setNewsletterConsentimento] = useState(false);
  const [newsletterEnviada, setNewsletterEnviada] = useState(false);

  const produtoAtual = produtoAtivo;
  const valorAcompanhamentos = acompanhamentoSelecionado.length * 6;
  const valorTotal = calculateOrderTotal(produtoAtual, tamanhoSelecionado, acompanhamentoSelecionado);

  const abrirProduto = (produto: Produto) => {
    setProdutoAtivo(produto);
    setTamanhoSelecionado('Média');
    setAcompanhamentoSelecionado([]);
  };

  const fecharProduto = () => {
    setProdutoAtivo(null);
    setAcompanhamentoSelecionado([]);
  };

  const enviarNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newsletterConsentimento) setNewsletterEnviada(true);
  };

  return (
    <div
      className="app-shell"
      style={{
        minHeight: '100vh',
        background: '#111111',
        padding: '28px 20px 50px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          background: '#f9f2ee',
          borderRadius: '0 0 18px 18px',
          overflow: 'hidden',
          boxShadow: '0 18px 50px rgba(0,0,0,0.08)',
          border: '1px solid rgba(117,74,62,0.08)',
        }}
      >
        <nav
          className="nav-header"
          style={{
            background: '#b55c45',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 34px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            color: '#f8f0ea',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.9)',
                position: 'relative',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 7,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.8)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '2px',
                  height: '18px',
                  background: 'rgba(255,255,255,0.9)',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '2px',
                  height: '18px',
                  background: 'rgba(255,255,255,0.9)',
                  transform: 'translate(-50%, -50%) rotate(-45deg)',
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#fffaf6', fontSize: '1.8rem', fontFamily: 'Georgia, serif', lineHeight: 1 }}>Attimo</div>
              <div style={{ fontWeight: 700, color: '#f7d9c8', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Pizzaria</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '28px', color: '#473b37', fontSize: '0.92rem', fontWeight: 600 }}>
            <span>Início</span>
            <span>Cardápio</span>
            <span>Localização</span>
            <span>Sobre</span>
            <span>Contato</span>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <button
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1.15rem',
                color: '#fffaf6',
              }}
            >
              🛒
            </button>
            <button
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1.15rem',
                color: '#fffaf6',
              }}
            >
              ☰
            </button>
          </div>
        </nav>

        <section
          style={{
            background: '#b55c45',
            padding: '20px 24px 12px',
          }}
        >
          <div
            style={{
              background: '#b55c45',
              borderRadius: '22px',
              padding: '8px 0 0',
              position: 'relative',
            }}
          >
            <div
              className="hero-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <div style={{ padding: '8px 0 0 8px' }}>
                <h1
                  className="hero-title"
                  style={{
                    fontSize: '3.2rem',
                    lineHeight: 0.98,
                    margin: '0 0 12px',
                    color: '#f9efe8',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                  }}
                >
                  Sua pizza favorita,
                  <br />
                  em um clique!
                </h1>

                <p style={{ margin: '0 0 16px', fontSize: '1rem', color: '#f6e5dc' }}>
                  Pizza quentinha e fresca, entregue rapidinho.
                </p>

                <div className="hero-actions" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <button
                    style={{
                      background: '#fff',
                      color: '#b55c45',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '14px 22px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Pedir agora
                  </button>
                  <button
                    style={{
                      background: 'transparent',
                      color: '#fff8f4',
                      border: '1px solid rgba(255,255,255,0.5)',
                      borderRadius: '999px',
                      padding: '14px 22px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Ver cardápio
                  </button>
                </div>
              </div>

              <div className="hero-visual" style={{ position: 'relative', minHeight: '330px' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: '6px 0 0 auto',
                    width: '330px',
                    height: '330px',
                    borderRadius: '50%',
                    background: '#f8ead7',
                    boxShadow: 'inset 0 0 0 14px rgba(255,255,255,0.5)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateY(-12px)',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                    alt="Pizza"
                    referrerPolicy="no-referrer"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                </div>

                <div style={{ position: 'absolute', right: '18px', top: '42px', display: 'grid', gap: '10px' }}>
                  {miniOfertas.map((item) => (
                    <div
                      key={item.nome}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '8px 10px',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.nome}
                        referrerPolicy="no-referrer"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#5d4d44', fontWeight: 700 }}>{item.nome}</div>
                        <div style={{ fontSize: '0.72rem', color: '#d14f3c', fontWeight: 700 }}>{item.preco}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: '#f5efe9', padding: '10px 32px 30px' }}>
          <div
            className="promo-banner"
            style={{
              background: 'linear-gradient(90deg, #b75b48 0%, #a44939 35%, #8d3d33 100%)',
              borderRadius: '20px',
              padding: '30px 24px',
              color: '#fff',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {(['pizza', 'batata', 'combo', 'promo'] as const).map((tipo) => (
                  <button
                    key={tipo}
                    style={{
                      background: '#fff',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '12px 20px',
                      color: '#a44939',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {tipo === 'pizza' && '🍕 Pizza'}
                    {tipo === 'batata' && '🍟 Batata Frita'}
                    {tipo === 'combo' && '🍱 Combos'}
                    {tipo === 'promo' && 'Promoção'}

                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: '#f5f0ed', padding: '18px 32px 10px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '3rem', margin: '0 0 26px', color: '#2d201d' }}>Favoritos da casa</h2>
          <div className="favorites-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '22px' }}>
            {favoritosDaCasa.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => abrirProduto(item)}
                style={{
                  background: '#f8f2ec',
                  borderRadius: '14px',
                  padding: '10px',
                  boxShadow: '0 10px 20px rgba(110, 80, 58, 0.06)',
                  border: '1px solid rgba(111,80,65,0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    referrerPolicy="no-referrer"
                    style={{ width: '95px', height: '95px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                <div style={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0}}>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2d201d' }}>{item.nome}</div>
                  <p style={{ margin: 0, color: '#5d504d', fontSize: '0.85rem', lineHeight: 1.3 }}>
                    {item.descricao}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '4px', padding: '4px' }}>
                    <div style={{ color: '#664947', fontWeight: 700, fontSize: '1.05rem', padding: '4px' }}>
                      {formatCurrency(item.tamanhos[1].preco)}
                    </div>
                    <button
                      style={{
                        background: '#d14f3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '10px 16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Pedir agora
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: '#f5efe9', padding: '22px 32px 18px' }}>
          <h2 style={{ textAlign: 'center', color: '#2d201d', fontSize: '2.3rem', margin: '0 0 16px' }}>Monte sua pizza dos sonhos</h2>
          <div
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '22px',
              padding: '14px 16px 12px',
              textAlign: 'center',
              maxWidth: '760px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f7ece2' }} />
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f7ece2' }} />
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f7ece2' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '180px' }}>
              <div
                style={{
                  width: pizzaMontando ? '150px' : '170px',
                  height: pizzaMontando ? '150px' : '170px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '6px solid #f2e6d8',
                  boxShadow: '0 18px 30px rgba(0,0,0,0.1)',
                  transform: pizzaMontando ? 'rotate(18deg) scale(0.96)' : 'rotate(0deg) scale(1)',
                  transition: 'all 0.6s ease',
                  willChange: 'transform',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                  alt="Pizza custom"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setPizzaMontando(true)}
                style={{
                  background: '#fff',
                  color: '#d14f3c',
                  border: '1px solid rgba(209,79,60,0.2)',
                  borderRadius: '999px',
                  padding: '10px 18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Começar a montar →
              </button>
            </div>
          </div>
        </section>

        <section style={{ background: '#f5efe9', padding: '24px 32px 36px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '3rem', margin: '0 0 18px', color: '#2d201d' }}>Nossos sabores regulares</h2>
          <p style={{ textAlign: 'center', color: '#5d504d', margin: '0 0 28px' }}>
            Escolha o estilo de pizza que mais gosta e aproveite o aroma e o sabor do forno fresco.
          </p>

          <div className="regular-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
            {sabores.map((pizza) => (
              <div
                key={pizza.nome}
                onClick={() => abrirProduto(findProductForFlavor(pizza.nome, cardapio))}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '10px',
                  border: '1px solid rgba(183, 91, 72, 0.65)',
                  boxShadow: '0 10px 20px rgba(110, 80, 58, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <img
                  src={pizza.image}
                  alt={pizza.nome}
                  referrerPolicy="no-referrer"
                  style={{ width: '95px', height: '95px', objectFit: 'cover', borderRadius: '50%' }}
                />
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#2d201d' }}>{pizza.nome}</div>
                  <div style={{ color: '#d14f3c', fontWeight: 700, marginTop: '6px' }}>Preço: {pizza.preco.replace('$', 'R$').replace('.', ',')}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '26px' }}>
            <button
              style={{
                background: '#fff',
                color: '#a44939',
                border: '1px solid rgba(164, 73, 57, 0.7)',
                borderRadius: '999px',
                padding: '12px 22px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Ver mais
            </button>
          </div>
        </section>

        <section style={{ background: '#f4eae2', padding: '26px 32px 36px' }}>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '26px', alignItems: 'center' }}>
            <div>
              <h2 style={{ textAlign: 'center', fontSize: '3rem', margin: '0 0 2px', color: '#2d201d' }}>
                Feito com amor, entregue com cuidado!
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '14px', color: '#594a44' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#594a44' }}>
                  <span style={{ color: '#c4453a', fontWeight: 700 }}>✓</span>
                  <span>Entrega rápida</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#594a44' }}>
                  <span style={{ color: '#c4453a', fontWeight: 700 }}>✓</span>
                  <span>100% ingredientes frescos</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#594a44' }}>
                  <span style={{ color: '#c4453a', fontWeight: 700 }}>✓</span>
                  <span>Acompanhe seu pedido em tempo real</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#594a44' }}>
                  <span style={{ color: '#c4453a', fontWeight: 700 }}>✓</span>
                  <span>Pagamento seguro</span>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  background: 'linear-gradient(180deg, #d94b38 0%, #a82f24 100%)',
                  borderRadius: '22px',
                  minHeight: '320px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <p
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    margin: 0,
                    color: '#fff4ee',
                    lineHeight: 1.5,
                    fontSize: '0.9rem',
                    padding: '22px',
                  }}
                >
                  Na Attimo Pizzaria, preparamos cada pizza com carinho e atenção. Combinamos ingredientes de alta
                  qualidade, massa artesanal e o sabor caseiro para entregar a melhor experiência.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                  alt="Pizza delivery"
                  referrerPolicy="no-referrer"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    width: '260px',
                    height: '200px',
                    borderRadius: '28px',
                    objectFit: 'cover',
                    border: '6px solid rgba(255,255,255,0.35)',
                  }}
                />
                <button
                  style={{
                    position: 'absolute',
                    left: '22px',
                    bottom: '22px',
                    background: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '12px 18px',
                    fontWeight: 700,
                    color: '#bf3c2e',
                    cursor: 'pointer',
                  }}
                >
                  Saiba mais sobre nós →
                </button>
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: '#f5efe9', padding: '30px 32px 36px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '3rem', margin: '0 0 26px', color: '#2d201d' }}>
            Do nosso forno até sua porta em 30 minutos!
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '30px', alignItems: 'center' }}>
            <div style={{ display: 'grid', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e9d2b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏱</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#2d201d' }}>Entrega rápida</div>
                  <div style={{ color: '#5d504d' }}>Pizza quente, chegando bem até você.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e9d2b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#2d201d' }}>100% ingredientes frescos</div>
                  <div style={{ color: '#5d504d' }}>Preparados na hora para cada pedido.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e9d2b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚚</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#2d201d' }}>Acompanhe seu pedido em tempo real</div>
                  <div style={{ color: '#5d504d' }}>Veja em cada etapa onde sua entrega está.</div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: '#f9f5f0',
                borderRadius: '24px',
                padding: '18px',
                border: '1px solid rgba(111,80,65,0.08)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                alt="Delivery scooter"
                referrerPolicy="no-referrer"
                style={{ width: '100%', maxWidth: '480px', borderRadius: '18px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        <section style={{ background: '#f5efe9', padding: '20px 32px 40px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '3rem', margin: '0 0 30px', color: '#2d201d' }}>O que nossos clientes dizem</h2>

          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '18px' }}>
            {depoimentos.map((texto, index) => (
              <div
                key={index}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '18px 16px',
                  border: '1px solid rgba(111,80,65,0.08)',
                  boxShadow: '0 10px 20px rgba(110, 80, 58, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#efdac2' }} />
                  <div style={{ color: '#d14f3c', fontSize: '1.2rem' }}>“”</div>
                </div>
                <p style={{ margin: 0, color: '#4c3d39', lineHeight: 1.7 }}>{texto}</p>
              </div>
            ))}
          </div>
        </section>

        <footer
          style={{
            background: '#b75b48',
            color: '#fff',
            padding: '120px 32px 120px 32px',
          }}
        >
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr 1fr 1.05fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '10px' }}>Attimo Pizzaria</div>
              <p style={{ margin: 0, lineHeight: 1.8, opacity: 0.9 }}>
                Pizza artesanal, ingredientes frescos e uma experiência premium em cada pedido.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '10px' }}>Início</div>
              <div style={{ opacity: 0.9, lineHeight: 1.9 }}>Cardápio</div>
              <div style={{ opacity: 0.9, lineHeight: 1.9 }}>Como funciona</div>
              <div style={{ opacity: 0.9, lineHeight: 1.9 }}>Sobre nós</div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '10px' }}>Contato</div>
              <div style={{ opacity: 0.9, lineHeight: 1.9 }}>+55 11 99999-9999</div>
              <div style={{ opacity: 0.9, lineHeight: 1.9 }}>atendimento@attimopizzaria.com.br</div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: '10px' }}>Fique por dentro</div>
              <form onSubmit={enviarNewsletter} style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  aria-label="Seu e-mail"
                  autoComplete="email"
                  required
                  style={{
                    flex: 1,
                    borderRadius: '999px',
                    border: 'none',
                    padding: '12px 14px',
                    outline: 'none',
                    fontSize: '0.95rem',
                  }}
                />
                <button
                  type="submit"
                  disabled={!newsletterConsentimento}
                  style={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '12px 16px',
                    color: '#d14f3c',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: newsletterConsentimento ? 1 : 0.6,
                  }}
                >
                  Entrar
                </button>
                </div>
                <label style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', fontSize: '0.72rem', lineHeight: 1.3 }}>
                  <input
                    type="checkbox"
                    checked={newsletterConsentimento}
                    onChange={(event) => {
                      setNewsletterConsentimento(event.target.checked);
                      setNewsletterEnviada(false);
                    }}
                    required
                  />
                  Autorizo receber novidades por e-mail. O dado não é salvo neste site sem integração de atendimento.
                </label>
                {newsletterEnviada && <span style={{ fontSize: '0.75rem' }}>Consentimento registrado para esta sessão.</span>}
              </form>
            </div>
          </div>
        </footer>
      </div>

      {produtoAtual && (
        <ProductModal
          produto={produtoAtual}
          tamanhoSelecionado={tamanhoSelecionado}
          acompanhamentosSelecionados={acompanhamentoSelecionado}
          valorTotal={valorTotal}
          valorAcompanhamentos={valorAcompanhamentos}
          onClose={fecharProduto}
          onSizeChange={setTamanhoSelecionado}
          setAcompanhamentosSelecionados={setAcompanhamentoSelecionado}
        />
      )}
    </div>
  );
}

export default App;
