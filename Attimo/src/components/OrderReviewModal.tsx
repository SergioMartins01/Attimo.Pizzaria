import { useState, type FormEvent } from 'react';
import { CheckCircle, Star, X } from '@phosphor-icons/react';
import type { PendingReview } from '../types';

type OrderReviewModalProps = {
  review: PendingReview;
  onSubmit: () => void;
  onPostpone: () => void;
  onDismiss: () => void;
};

const REVIEW_TAGS = [
  'Sabor incrível',
  'Massa perfeita',
  'Chegou quentinha',
  'Entrega rápida',
  'Embalagem caprichada',
] as const;

const RATING_LABELS: Record<number, string> = {
  1: 'Ruim',
  2: 'Regular',
  3: 'Bom',
  4: 'Muito bom',
  5: 'Excelente!',
};

export function OrderReviewModal({
  review,
  onSubmit,
  onPostpone,
  onDismiss,
}: OrderReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sabor incrível']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
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
                <strong className="review-rating-label">{RATING_LABELS[rating]}</strong>
              </div>

              <fieldset className="option-group">
                <legend>O que você mais gostou?</legend>
                <div className="extra-options">
                  {REVIEW_TAGS.map((tag) => {
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
