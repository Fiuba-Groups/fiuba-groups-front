import React, { useState, useEffect, useCallback } from 'react';
import styles from './RateGroupModal.module.scss';
import RatingStars from '../RatingStars';
import { fetchPendingRatings, rateGroupMember, PendingRatingMember } from '../../services/ratingsService';

interface RateGroupModalProps {
  groupId: string;
  groupTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

/**
 * Modal para calificar a los compañeros de un grupo terminado
 */
const RateGroupModal: React.FC<RateGroupModalProps> = ({
  groupId,
  groupTitle,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [pendingMembers, setPendingMembers] = useState<PendingRatingMember[]>([]);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPendingMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const members = await fetchPendingRatings(groupId);
      setPendingMembers(members);
      setCurrentMemberIndex(0);
      setSelectedRating(0);
    } catch (err) {
      setError('Error al cargar miembros pendientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (isOpen) {
      loadPendingMembers();
    }
  }, [isOpen, loadPendingMembers]);

  const handleSubmitRating = async () => {
    if (selectedRating === 0) return;

    const currentMember = pendingMembers[currentMemberIndex];
    if (!currentMember) return;

    try {
      setSubmitting(true);
      await rateGroupMember(Number(groupId), currentMember.id, selectedRating);

      // Pasar al siguiente miembro o cerrar
      if (currentMemberIndex < pendingMembers.length - 1) {
        setCurrentMemberIndex(prev => prev + 1);
        setSelectedRating(0);
      } else {
        onComplete();
        onClose();
      }
    } catch (err) {
      setError('Error al enviar calificación');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (currentMemberIndex < pendingMembers.length - 1) {
      setCurrentMemberIndex(prev => prev + 1);
      setSelectedRating(0);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentMember = pendingMembers[currentMemberIndex];
  const progress = pendingMembers.length > 0 
    ? `${currentMemberIndex + 1} de ${pendingMembers.length}` 
    : '';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Calificar compañeros</h2>
          <span className={styles.groupTitle}>{groupTitle}</span>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="pi pi-times" />
          </button>
        </div>

        <div className={styles.content}>
          {loading && (
            <div className={styles.loadingState}>
              <i className="pi pi-spin pi-spinner" />
              <p>Cargando...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorState}>
              <i className="pi pi-exclamation-circle" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && pendingMembers.length === 0 && (
            <div className={styles.emptyState}>
              <i className="pi pi-check-circle" />
              <p>¡Ya calificaste a todos tus compañeros!</p>
            </div>
          )}

          {!loading && !error && currentMember && (
            <div className={styles.ratingSection}>
              <div className={styles.progress}>{progress}</div>
              
              <div className={styles.memberInfo}>
                <div className={styles.avatar}>
                  <i className="pi pi-user" />
                </div>
                <h3>{currentMember.name}</h3>
                <span className={styles.register}>Padrón: {currentMember.register}</span>
              </div>

              <p className={styles.question}>¿Cómo fue trabajar con este compañero?</p>

              <div className={styles.starsContainer}>
                <RatingStars
                  rating={selectedRating}
                  size="large"
                  interactive={true}
                  onRatingChange={setSelectedRating}
                />
              </div>

              <div className={styles.ratingLabels}>
                <span>Malo</span>
                <span>Excelente</span>
              </div>
            </div>
          )}
        </div>

        {!loading && currentMember && (
          <div className={styles.footer}>
            <button 
              className={styles.skipButton} 
              onClick={handleSkip}
              disabled={submitting}
            >
              Omitir
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmitRating}
              disabled={selectedRating === 0 || submitting}
            >
              {submitting ? (
                <i className="pi pi-spin pi-spinner" />
              ) : (
                currentMemberIndex < pendingMembers.length - 1 ? 'Siguiente' : 'Finalizar'
              )}
            </button>
          </div>
        )}

        {!loading && pendingMembers.length === 0 && (
          <div className={styles.footer}>
            <button className={styles.submitButton} onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateGroupModal;
