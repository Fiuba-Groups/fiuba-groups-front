import React from 'react';
import { GroupOffer } from '../../types/groupOffer';
import RatingStars from '../RatingStars';
import styles from './styles.module.scss';

interface GroupOfferCardProps {
  offer: GroupOffer;
  onViewDetails: (offerId: string) => void;
  onRequestJoin: (offerId: string) => void;
  isJoined?: boolean; // Nueva prop
  isLoading?: boolean; // Nueva prop para estado de carga
  requestSent?: boolean; // Nueva prop para indicar si ya se envió solicitud
  authorRating?: { average: number; count: number } | null; // Rating del autor
}

export default function GroupOfferCard({
  offer,
  onViewDetails,
  onRequestJoin,
  isJoined = false, // Valor por defecto
  isLoading = false, // Valor por defecto
  requestSent = false, // Valor por defecto
  authorRating = null, // Valor por defecto
}: GroupOfferCardProps) {
  const { id, title, description, availableSlots, totalSlots, currentMembers } = offer;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.slotsInfo}>
          <i className="pi pi-users" />
          <span>{currentMembers}/{totalSlots}</span>
        </div>
        {offer.status === 'FINISHED' && (
          <span className={styles.finishedBadge}>Finalizado</span>
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.cathedraInfo}>
          <span className={styles.cathedraName}>{offer.cathedra}</span>
          <span className={styles.semester}>{offer.semester}</span>
        </div>

        {authorRating && authorRating.count > 0 && (
          <div className={styles.authorRating}>
            <span className={styles.authorLabel}>Creador:</span>
            <RatingStars 
              rating={authorRating.average} 
              totalRatings={authorRating.count}
              showCount={true}
              size="small"
            />
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button 
          className={styles.detailsButton}
          onClick={() => onViewDetails(id)}
        >
          {isJoined ? 'Ver Grupo' : 'Ver Detalles'}
        </button>
        <button
          className={`${styles.joinButton} ${isJoined ? styles.leaveButton : ''} ${requestSent ? styles.requestSent : ''}`}
          onClick={() => onRequestJoin(id)}
          disabled={(availableSlots === 0 && !isJoined && !requestSent) || isLoading || requestSent}
        >
          {isLoading ? (
            <>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '0.8rem', marginRight: '6px' }} />
              {requestSent ? 'Enviando...' : (isJoined ? 'Saliendo...' : 'Uniéndose...')}
            </>
          ) : requestSent ? (
            'Solicitud enviada'
          ) : (
            isJoined ? 'Salir del Grupo' : (availableSlots > 0 ? 'Unirse' : 'Cupos Llenos')
          )}
        </button>
      </div>
    </div>
  );
}