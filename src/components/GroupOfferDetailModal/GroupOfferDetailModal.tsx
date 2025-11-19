import React from 'react';
import { createPortal } from 'react-dom';
import { GroupOffer } from '../../types/groupOffer';
import styles from './styles.module.scss';

interface GroupOfferDetailModalProps {
  offer: GroupOffer;
  onClose: () => void;
  onRequestJoin: (offerId: string) => void;
}

const GroupOfferDetailModal: React.FC<GroupOfferDetailModalProps> = ({
  offer,
  onClose,
  onRequestJoin,
}) => {
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
        <div className={styles.footer}>
          <div className={styles.timestamps}>
            <span>Creado: {new Date(offer.createdAt).toLocaleDateString()}</span>
            <span>
              Actualizado: {new Date(offer.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <button
            className={styles.joinButton}
            onClick={() => onRequestJoin(offer.id)}
            disabled={offer.availableSlots === 0}
          >
            {offer.availableSlots === 0 ? 'Completo' : 'Solicitar unirme'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalTarget);
};

export default GroupOfferDetailModal;

