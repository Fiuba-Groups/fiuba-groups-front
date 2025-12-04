import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GroupOffer } from '../../types/groupOffer';
import { getTeammateEmail } from '../../services/userService';
import { getCurrentStudentId } from '../../services/currentUserService';
import styles from './styles.module.scss';

interface GroupOfferDetailModalProps {
  offer: GroupOffer;
  onClose: () => void;
  onRequestJoin?: (offerId: string) => void;
  showJoinButton?: boolean;
  showEmailButtons?: boolean; // Muestra botones de email para compañeros de grupo
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
}) => {
  const [sendingEmailTo, setSendingEmailTo] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Obtener el ID del usuario actual para no mostrar el botón de email para uno mismo
  useEffect(() => {
    if (showEmailButtons) {
      getCurrentStudentId().then(setCurrentUserId);
    }
  }, [showEmailButtons]);

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
                <div key={member.id} className={styles.memberItem}>
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
                  {showEmailButtons && String(currentUserId) !== member.id && (
                    <button
                      className={styles.emailButton}
                      onClick={() => handleSendEmail(member.id)}
                      disabled={sendingEmailTo === member.id}
                      title="Enviar email"
                      aria-label={`Enviar email a ${member.name}`}
                    >
                      <i className="pi pi-envelope" />
                    </button>
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

