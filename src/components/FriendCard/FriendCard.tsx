import React from 'react';
import { Friend } from '../../types/friends';
import styles from './styles.module.scss';

interface FriendCardProps {
  friend: Friend;
  onViewProfile: (friendId: string) => void;
  onRemoveFriend?: (friendId: string) => void;
}

export default function FriendCard({
  friend,
  onViewProfile,
  onRemoveFriend,
}: FriendCardProps) {
  const { id, name, surname, email, avatarUrl, bio } = friend;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatarSection}>
          <img
            src={avatarUrl || '/user.png'}
            alt={`${name} ${surname}`}
            className={styles.avatar}
          />
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.name}>{name} {surname}</h3>
          <p className={styles.email}>{email}</p>
        </div>
      </div>

      <div className={styles.cardBody}>
        {bio && (
          <p className={styles.bio}>
            {bio.length > 100 ? `${bio.substring(0, 100)}...` : bio}
          </p>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button
          className={styles.profileButton}
          onClick={() => onViewProfile(id)}
        >
          <i className="pi pi-user" />
          <span>Ver Perfil</span>
        </button>
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
