import React from 'react';
import { Friend } from '../../types/friends';
import { StudentRatingSummary } from '../../services/ratingsService';
import styles from './styles.module.scss';

interface FriendCardProps {
  friend: Friend;
  onRemoveFriend?: (friendId: string) => void;
  onSendEmail?: (friendId: string) => void;
  rating?: StudentRatingSummary | null;
  sendingEmail?: boolean;
}

export default function FriendCard({
  friend,
  onRemoveFriend,
  onSendEmail,
  rating,
  sendingEmail = false,
}: FriendCardProps) {
  const { id, name, surname, avatarUrl, register } = friend;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarSection}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}${surname ? ` ${surname}` : ''}`}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.name}>{name}{surname ? ` ${surname}` : ''}</h3>
          {register && <p className={styles.register}>Padrón: {register}</p>}
          {rating && rating.totalRatings > 0 && (
            <div className={styles.rating}>
              <i className="pi pi-star-fill" />
              <span>{rating.averageRating.toFixed(1)}</span>
              <span className={styles.ratingCount}>({rating.totalRatings})</span>
            </div>
          )}
          {(!rating || rating.totalRatings === 0) && (
            <span className={styles.noRating}>Sin calificaciones</span>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        {onSendEmail && (
          <button
            className={styles.emailButton}
            onClick={() => onSendEmail(id)}
            disabled={sendingEmail}
            title="Enviar email"
          >
            <i className={`pi ${sendingEmail ? 'pi-spin pi-spinner' : 'pi-envelope'}`} />
          </button>
        )}
        {onRemoveFriend && (
          <button
            className={styles.removeButton}
            onClick={() => onRemoveFriend(id)}
            title="Eliminar amigo"
          >
            <i className="pi pi-times" />
          </button>
        )}
      </div>
    </div>
  );
}
