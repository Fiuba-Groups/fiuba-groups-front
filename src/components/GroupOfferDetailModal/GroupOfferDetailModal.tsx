import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { GroupOffer } from '../../types/groupOffer';
import { getTeammateEmail } from '../../services/userService';
import { getCurrentStudentId } from '../../services/currentUserService';
import { sendFriendRequest, getFriendshipStatus } from '../../services/friendsService';
import { FriendshipStatus } from '../../types/friends';
import styles from './styles.module.scss';

interface GroupOfferDetailModalProps {
  offer: GroupOffer;
  onClose: () => void;
  onRequestJoin?: (offerId: string) => void;
  showJoinButton?: boolean;
  showEmailButtons?: boolean; // Muestra botones de email para compañeros de grupo
  showFriendButtons?: boolean; // Muestra botones de solicitud de amistad
}

/**
 * Obtiene las iniciales de un nombre para mostrar como avatar
 */
const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const GroupOfferDetailModal: React.FC<GroupOfferDetailModalProps> = ({
  offer,
  onClose,
  onRequestJoin,
  showJoinButton = true,
  showEmailButtons = false,
  showFriendButtons = false,
}) => {
  const [sendingEmailTo, setSendingEmailTo] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [friendshipStatuses, setFriendshipStatuses] = useState<Record<string, FriendshipStatus>>({});
  const [sendingFriendRequestTo, setSendingFriendRequestTo] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewProfile = async (memberId: string) => {
    try {
      const currentStudentId = await getCurrentStudentId();
      
      // Si es el usuario actual, navegar a editar perfil
      if (currentStudentId && String(currentStudentId) === String(memberId)) {
        navigate('/profile');
        return;
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    }

    navigate(`/user/${memberId}`, {
      state: { from: location.pathname },
    });
  };

  // Obtener el ID del usuario actual para no mostrar el botón de email para uno mismo
  useEffect(() => {
    if (showEmailButtons || showFriendButtons) {
      getCurrentStudentId().then(setCurrentUserId);
    }
  }, [showEmailButtons, showFriendButtons]);

  // Cargar el estado de amistad de cada miembro
  useEffect(() => {
    const loadFriendshipStatuses = async () => {
      if (!showFriendButtons || !currentUserId || !offer.members) return;

      const statuses: Record<string, FriendshipStatus> = {};
      for (const member of offer.members) {
        if (String(currentUserId) !== member.id) {
          try {
            const status = await getFriendshipStatus(member.id);
            statuses[member.id] = status;
          } catch {
            statuses[member.id] = 'NONE';
          }
        }
      }
      setFriendshipStatuses(statuses);
    };

    if (currentUserId && offer.members) {
      loadFriendshipStatuses();
    }
  }, [showFriendButtons, currentUserId, offer.members]);

  const handleSendEmail = async (memberId: string) => {
    try {
      setSendingEmailTo(memberId);
      const email = await getTeammateEmail(memberId);
      const subject = encodeURIComponent(`[FIUBA GROUPS] ${offer.title}`);
      
      // Crear un link temporal y hacer click para abrir Gmail
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`;
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

  const handleSendFriendRequest = async (memberId: string) => {
    try {
      setSendingFriendRequestTo(memberId);
      await sendFriendRequest(memberId);
      // Actualizar el estado local
      setFriendshipStatuses(prev => ({
        ...prev,
        [memberId]: 'PENDING_SENT'
      }));
    } catch (error) {
      console.error('Error al enviar solicitud de amistad:', error);
    } finally {
      setSendingFriendRequestTo(null);
    }
  };

  const getFriendButtonProps = (memberId: string) => {
    const status = friendshipStatuses[memberId] || 'NONE';
    
    switch (status) {
      case 'FRIENDS':
        return {
          icon: 'pi-check',
          title: 'Ya son amigos',
          className: styles.friendButtonFriends,
          disabled: true,
        };
      case 'PENDING_SENT':
        return {
          icon: 'pi-clock',
          title: 'Solicitud enviada',
          className: styles.friendButtonPending,
          disabled: true,
        };
      case 'PENDING_RECEIVED':
        return {
          icon: 'pi-inbox',
          title: 'Tienes una solicitud pendiente',
          className: styles.friendButtonPending,
          disabled: true,
        };
      default:
        return {
          icon: 'pi-user-plus',
          title: 'Enviar solicitud de amistad',
          className: styles.friendButton,
          disabled: false,
        };
    }
  };

  const portalTarget = document.getElementById('modal-root') || document.body;

  const content = (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className={styles.header}>
          <div>
            <p className={styles.subject}>{offer.subject}</p>
            <h2>{offer.title}</h2>
          </div>
          <div className={styles.slotsInfo}>
            <i className="pi pi-users" />
            <span>
              {offer.totalSlots - offer.availableSlots}/{offer.totalSlots}
            </span>
          </div>
        </div>
        <p className={styles.description}>{offer.description}</p>
        <div className={styles.detailsGrid}>
          <div>
            <span className={styles.label}>Cátedra</span>
            <p>{offer.cathedra}</p>
          </div>
          <div>
            <span className={styles.label}>Cuatrimestre</span>
            <p>{offer.semester}</p>
          </div>
          <div>
            <span className={styles.label}>Publicado por</span>
            <p>{offer.author.name}</p>
          </div>
          <div>
            <span className={styles.label}>Cupos disponibles</span>
            <p>{offer.availableSlots}</p>
          </div>
        </div>

        {/* Sección de miembros del grupo */}
        {offer.members && offer.members.length > 0 && (
          <div className={styles.membersSection}>
            <h3>Integrantes del grupo</h3>
            <div className={styles.membersList}>
              {offer.members.map((member) => (
                <div
                  key={member.id}
                  className={styles.memberItem}
                  role="link"
                  tabIndex={0}
                  onClick={() => handleViewProfile(member.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleViewProfile(member.id);
                    }
                  }}
                  aria-label={`Ver perfil de ${member.name}`}
                >
                  {member.avatarUrl ? (
                    <img 
                      className={styles.memberAvatar}
                      src={member.avatarUrl}
                      alt={member.name}
                    />
                  ) : (
                    <div className={styles.memberAvatar}>
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>{member.name}</div>
                    {member.rating && member.rating.count > 0 && (
                      <div className={styles.memberRating}>
                        <i className="pi pi-star-fill" />
                        <span>{member.rating.average.toFixed(1)}</span>
                        <span>({member.rating.count})</span>
                      </div>
                    )}
                  </div>
                  {member.id === offer.author.id && (
                    <span className={styles.creatorBadge}>Creador</span>
                  )}
                  {String(currentUserId) !== member.id && (showEmailButtons || showFriendButtons) && (
                    <div className={styles.memberActions}>
                      {showFriendButtons && (() => {
                        const buttonProps = getFriendButtonProps(member.id);
                        return (
                          <button
                            className={`${styles.friendButton} ${buttonProps.className}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleSendFriendRequest(member.id);
                            }}
                            disabled={buttonProps.disabled || sendingFriendRequestTo === member.id}
                            title={buttonProps.title}
                            aria-label={`${buttonProps.title} - ${member.name}`}
                          >
                            <i className={`pi ${sendingFriendRequestTo === member.id ? 'pi-spin pi-spinner' : buttonProps.icon}`} />
                          </button>
                        );
                      })()}
                      {showEmailButtons && (
                        <button
                          className={styles.emailButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSendEmail(member.id);
                          }}
                          disabled={sendingEmailTo === member.id}
                          title="Enviar email"
                          aria-label={`Enviar email a ${member.name}`}
                        >
                          <i className="pi pi-envelope" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.timestamps}>
            <span>Creado: {new Date(offer.createdAt).toLocaleDateString()}</span>
            <span>
              Actualizado: {new Date(offer.updatedAt).toLocaleDateString()}
            </span>
          </div>
          {showJoinButton && onRequestJoin && (
            <button
              className={styles.joinButton}
              onClick={() => onRequestJoin(offer.id)}
              disabled={offer.availableSlots === 0}
            >
              {offer.availableSlots === 0 ? 'Completo' : 'Solicitar unirme'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalTarget);
};

export default GroupOfferDetailModal;

