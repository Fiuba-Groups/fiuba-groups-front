import React from 'react';
import styles from './RatingStars.module.scss';

interface RatingStarsProps {
  rating: number;
  totalRatings?: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

/**
 * Componente para mostrar estrellas de calificación
 */
const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  totalRatings = 0,
  showCount = false,
  size = 'medium',
  interactive = false,
  onRatingChange,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number>(0);

  const handleClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  const renderStar = (index: number) => {
    const filled = index <= displayRating;
    const halfFilled = !filled && index - 0.5 <= displayRating;

    return (
      <span
        key={index}
        className={`${styles.star} ${styles[size]} ${filled ? styles.filled : ''} ${halfFilled ? styles.half : ''} ${interactive ? styles.interactive : ''}`}
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
      >
        {filled || halfFilled ? '★' : '☆'}
      </span>
    );
  };

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      {showCount && totalRatings > 0 && (
        <span className={styles.count}>
          ({rating.toFixed(1)} - {totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'})
        </span>
      )}
      {showCount && totalRatings === 0 && (
        <span className={styles.noRatings}>Sin calificaciones</span>
      )}
    </div>
  );
};

export default RatingStars;
