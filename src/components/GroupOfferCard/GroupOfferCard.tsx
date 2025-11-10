import React from 'react';
import { GroupOffer } from '../../types/groupOffer';
import styles from './styles.module.scss';

interface GroupOfferCardProps {
  offer: GroupOffer;
  onViewDetails: (offerId: string) => void;
  onRequestJoin: (offerId: string) => void;
}

/**
 * Componente Card para mostrar una oferta de grupo
 */
const GroupOfferCard: React.FC<GroupOfferCardProps> = ({ 
  offer, 
  onViewDetails, 
  onRequestJoin 
}) => {
  const occupiedSlots = offer.totalSlots - offer.availableSlots;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{offer.title}</h3>
        <div className={styles.slotsInfo}>
          <i className="pi pi-users" />
          <span>{occupiedSlots}/{offer.totalSlots}</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.description}>{offer.description}</p>
        
        <div className={styles.cathedraInfo}>
          <span className={styles.cathedraName}>{offer.cathedra}</span>
          <span className={styles.semester}>{offer.semester}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button 
          className={styles.detailsButton}
          onClick={() => onViewDetails(offer.id)}
        >
          Ver más
        </button>
        <button 
          className={styles.joinButton}
          onClick={() => onRequestJoin(offer.id)}
          disabled={offer.availableSlots === 0}
        >
          {offer.availableSlots === 0 ? 'Completo' : 'Solicitar unirme'}
        </button>
      </div>
    </div>
  );
};

export default GroupOfferCard;

