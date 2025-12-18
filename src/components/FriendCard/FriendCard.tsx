import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Friend } from '../../types/friends';
import { StudentRatingSummary } from '../../services/ratingsService';
import { getCurrentStudentId } from '../../services/currentUserService';
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
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navega al perfil del usuario
   */
  const handleNavigateToProfile = async () => {
    try {
      const currentStudentId = await getCurrentStudentId();
      
      // Si es el usuario actual, navegar a editar perfil
      if (currentStudentId && String(currentStudentId) === String(id)) {
        navigate('/profile');
        return;
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    }

    navigate(`/user/${id}`, {
      state: { from: location.pathname, userData: friend },
    });
  };

  /**
   * Maneja el click en la tarjeta para navegar al perfil
   */
  const handleCardClick = (event: React.MouseEvent) => {
    // Solo navegar si el click no fue en un botón de acción
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    handleNavigateToProfile();
  };

  /**
   * Maneja la navegación con teclado
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target as HTMLElement;
      // Solo navegar si no está en un botón
      if (!target.closest('button')) {
        event.preventDefault();
        handleNavigateToProfile();
      }
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Ver perfil de ${name}${surname ? ` ${surname}` : ''}`}
    >
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
