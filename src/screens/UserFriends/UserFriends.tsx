import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserFriends.module.scss';
import AppShell from '../../components/Shell';
import SearchBar from '../../components/SearchBar/index';
import FriendCard from '../../components/FriendCard/FriendCard';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { useUserFriends } from '../../hooks/useUserFriends';
import { removeFriend } from '../../services/friendsService';
import { fetchStudentRatings, StudentRatingSummary } from '../../services/ratingsService';
import { getTeammateEmail } from '../../services/userService';
import { Friend } from '../../types/friends';

/**
 * Componente para mostrar los amigos del usuario
 */
export default function UserFriends() {
  const { friends, loading, error, refetch } = useUserFriends();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  const [isRemovingFriend, setIsRemovingFriend] = useState(false);
  const [friendRatings, setFriendRatings] = useState<Record<string, StudentRatingSummary | null>>({});
  const [sendingEmailTo, setSendingEmailTo] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar ratings de cada amigo
  useEffect(() => {
    const loadFriendRatings = async () => {
      const ratingsMap: Record<string, StudentRatingSummary | null> = {};
      
      for (const friend of friends) {
        try {
          const ratings = await fetchStudentRatings(Number(friend.id));
          ratingsMap[friend.id] = ratings;
        } catch {
          ratingsMap[friend.id] = null;
        }
      }
      
      setFriendRatings(ratingsMap);
    };

    if (friends.length > 0) {
      loadFriendRatings();
    }
  }, [friends]);

  /**
   * Filtra los amigos según el término de búsqueda
   */
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (friend.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (friend.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  /**
   * Maneja la búsqueda de amigos
   */
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  /**
   * Maneja la navegación al perfil de un amigo
   */
  const handleViewProfile = (friendId: string) => {
    navigate(`/user/${friendId}`);
  };

  /**
   * Maneja la eliminación de un amigo - abre el modal de confirmación
   */
  const handleRemoveFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      setFriendToRemove(friend);
      setIsConfirmModalOpen(true);
    }
  };

  /**
   * Confirma la eliminación del amigo
   */
  const handleConfirmRemoveFriend = async () => {
    if (!friendToRemove) return;

    setIsRemovingFriend(true);
    try {
      await removeFriend(friendToRemove.id);
      refetch(); // Recargar la lista de amigos
      console.log('Amigo eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setIsRemovingFriend(false);
      setFriendToRemove(null);
    }
  };

  /**
   * Cierra el modal de confirmación
   */
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setFriendToRemove(null);
  };

  /**
   * Maneja el envío de email a un amigo
   */
  const handleSendEmail = async (friendId: string) => {
    try {
      setSendingEmailTo(friendId);
      const email = await getTeammateEmail(friendId);
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
      const link = document.createElement('a');
      link.href = gmailUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al abrir email:', error);
    } finally {
      setSendingEmailTo(null);
    }
  };

  /**
   * Obtiene estadísticas de amigos
   */
  const totalCount = friends.length;

  return (
    <AppShell>
      <div className={styles.friendsContainer}>
        <div className={styles.friendsHeader}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Mis Amigos</h1>
            <div className={styles.stats}>
              <span className={styles.totalCount}>
                {totalCount} amigos en total
              </span>
            </div>
          </div>
          <SearchBar
            placeholder="Buscar amigos por nombre o email"
            onSearch={handleSearch}
            onChange={setSearchTerm}
          />
        </div>

        {loading && (
          <div className={styles.loadingState}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Cargando tus amigos...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <i className="pi pi-exclamation-circle" />
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={refetch}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filteredFriends.length === 0 && friends.length === 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-users" />
            <h3>Aún no tienes amigos</h3>
            <p>¡Explora los grupos de estudio y conoce a nuevos compañeros!</p>
          </div>
        )}

        {!loading && !error && filteredFriends.length === 0 && friends.length > 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-search" />
            <h3>No se encontraron amigos</h3>
            <p>No hay amigos que coincidan con tu búsqueda.</p>
          </div>
        )}

        {!loading && !error && filteredFriends.length > 0 && (
          <div className={styles.friendsGrid}>
            {filteredFriends.map((friend: Friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onViewProfile={handleViewProfile}
                onRemoveFriend={handleRemoveFriend}
                onSendEmail={handleSendEmail}
                rating={friendRatings[friend.id]}
                sendingEmail={sendingEmailTo === friend.id}
              />
            ))}
          </div>
        )}

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmRemoveFriend}
          title="Eliminar amigo"
          message={`¿Quieres eliminar a ${friendToRemove ? `${friendToRemove.name}${friendToRemove.surname ? ` ${friendToRemove.surname}` : ''}` : 'este usuario'} como amigo?`}
          confirmText="Eliminar"
          cancelText="No"
          isLoading={isRemovingFriend}
        />
      </div>
    </AppShell>
  );
}