import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserSummary, getFullName, getInitials } from '../../types/users';
import { getCurrentStudentId } from '../../services/currentUserService';
import styles from './UserProfileLink.module.scss';

export type UserProfileLinkVariant = 'avatar' | 'text' | 'chip' | 'full';

interface UserProfileLinkProps {
  /** Datos del usuario a mostrar */
  user: UserSummary;
  /** Variante de visualización */
  variant?: UserProfileLinkVariant;
  /** Callback opcional que reemplaza la navegación por defecto */
  onClickOverride?: (user: UserSummary) => void;
  /** Clases CSS adicionales */
  className?: string;
  /** Mostrar rating si está disponible */
  showRating?: boolean;
  /** Mostrar padrón si está disponible */
  showRegister?: boolean;
  /** Deshabilitar el link (ej: si es el usuario actual) */
  disabled?: boolean;
  /** Tamaño del avatar (en px) */
  avatarSize?: number;
}

/**
 * Componente reutilizable para mostrar un usuario con navegación a su perfil.
 * Soporta diferentes variantes de visualización y maneja accesibilidad.
 */
export default function UserProfileLink({
  user,
  variant = 'full',
  onClickOverride,
  className = '',
  showRating = false,
  showRegister = false,
  disabled = false,
  avatarSize,
}: UserProfileLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = async (event: React.MouseEvent | React.KeyboardEvent) => {
    // Prevenir propagación para que los botones de acción no disparen navegación
    event.stopPropagation();

    if (disabled) return;

    if (onClickOverride) {
      onClickOverride(user);
      return;
    }

    try {
      const currentStudentId = await getCurrentStudentId();
      
      // Si es el usuario actual, navegar a editar perfil
      if (currentStudentId && String(currentStudentId) === String(user.id)) {
        navigate('/profile');
        return;
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    }

    // Navegar al perfil pasando el origen para el botón "Volver"
    navigate(`/user/${user.id}`, {
      state: { from: location.pathname, userData: user },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };

  const fullName = getFullName(user);
  const initials = getInitials(user);
  const avatarStyle = avatarSize ? { width: avatarSize, height: avatarSize, fontSize: avatarSize * 0.4 } : undefined;

  const renderAvatar = () => (
    <div className={styles.avatarContainer} style={avatarStyle}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={fullName}
          className={styles.avatar}
          style={avatarStyle}
        />
      ) : (
        <div className={styles.avatarPlaceholder} style={avatarStyle}>
          {initials}
        </div>
      )}
      {user.isOnline !== undefined && (
        <div className={`${styles.onlineIndicator} ${user.isOnline ? styles.online : styles.offline}`} />
      )}
    </div>
  );

  const renderInfo = () => (
    <div className={styles.userInfo}>
      <span className={styles.name}>{fullName}</span>
      {showRegister && user.register && (
        <span className={styles.register}>Padrón: {user.register}</span>
      )}
      {showRating && user.rating && user.rating.count > 0 && (
        <div className={styles.rating}>
          <i className="pi pi-star-fill" />
          <span>{user.rating.average.toFixed(1)}</span>
          <span className={styles.ratingCount}>({user.rating.count})</span>
        </div>
      )}
    </div>
  );

  const containerClasses = [
    styles.userProfileLink,
    styles[variant],
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Ver perfil de ${fullName}`}
      aria-disabled={disabled}
    >
      {(variant === 'avatar' || variant === 'full' || variant === 'chip') && renderAvatar()}
      {(variant === 'text' || variant === 'full') && renderInfo()}
      {variant === 'chip' && <span className={styles.chipName}>{user.name}</span>}
    </div>
  );
}
