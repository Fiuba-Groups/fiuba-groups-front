import { useState, useEffect } from 'react';
import styles from './UserGroup.module.scss';
import AppShell from '../../components/Shell';
import GroupOfferCard from '../../components/GroupOfferCard/GroupOfferCard';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion';
import GroupOfferDetailModal from '../../components/GroupOfferDetailModal/GroupOfferDetailModal';
import RateGroupModal from '../../components/RateGroupModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { GroupOffer } from '../../types/groupOffer';
import { useUserGroups } from '../../hooks/useUserGroups';
import { finishGroup, fetchPendingRatings } from '../../services/ratingsService';
import { fetchCurrentUser, CurrentUser } from '../../services/currentUserService';

/**
 * Componente para mostrar los grupos a los que pertenece el usuario.
 */
export default function UserGroup() {
  const { groups, loading, error, leaveGroup, refetch } = useUserGroups();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [finishingGroupId, setFinishingGroupId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupOffer | null>(null);
  const [ratingGroup, setRatingGroup] = useState<GroupOffer | null>(null);
  const [pendingRatingsMap, setPendingRatingsMap] = useState<Record<string, boolean>>({});
  const [leaveConfirmGroup, setLeaveConfirmGroup] = useState<GroupOffer | null>(null);

  // Cargar usuario actual
  useEffect(() => {
    fetchCurrentUser().then(setCurrentUser).catch(console.error);
  }, []);

  // Verificar grupos con ratings pendientes
  useEffect(() => {
    const checkPendingRatings = async () => {
      const finishedGroups = groups.filter(g => g.status === 'FINISHED');
      const pendingMap: Record<string, boolean> = {};
      
      for (const group of finishedGroups) {
        try {
          const pending = await fetchPendingRatings(group.id);
          pendingMap[group.id] = pending.length > 0;
        } catch {
          pendingMap[group.id] = false;
        }
      }
      setPendingRatingsMap(pendingMap);
    };

    if (groups.length > 0) {
      checkPendingRatings();
    }
  }, [groups]);

  /**
   * Agrupa las ofertas por materia
   */
  const groupOffersBySubject = (offers: GroupOffer[]): Record<string, GroupOffer[]> => {
    return offers.reduce((acc, offer) => {
      const subject = offer.subject;
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(offer);
      return acc;
    }, {} as Record<string, GroupOffer[]>);
  };

  const groupedGroups = groupOffersBySubject(groups);

  const handleViewGroupDetails = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
    }
  };

  const handleCloseDetailModal = () => {
    setSelectedGroup(null);
  };

  // Mostrar modal de confirmación para salir del grupo
  const handleRequestLeaveGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setLeaveConfirmGroup(group);
    }
  };

  // Ejecutar salida del grupo después de confirmar
  const handleConfirmLeaveGroup = async () => {
    if (!leaveConfirmGroup) return;
    
    try {
      setLeavingGroupId(leaveConfirmGroup.id);
      await leaveGroup(leaveConfirmGroup.id);
      console.log('Saliste del grupo exitosamente');
    } catch (error) {
      console.error('Error al salir del grupo:', error);
    } finally {
      setLeavingGroupId(null);
      setLeaveConfirmGroup(null);
    }
  };

  const handleFinishGroup = async (groupId: string) => {
    try {
      setFinishingGroupId(groupId);
      await finishGroup(groupId);
      refetch(); // Recargar grupos para actualizar el estado
    } catch (error) {
      console.error('Error al finalizar el grupo:', error);
    } finally {
      setFinishingGroupId(null);
    }
  };

  const handleOpenRatingModal = (group: GroupOffer) => {
    setRatingGroup(group);
  };

  const handleCloseRatingModal = () => {
    setRatingGroup(null);
    // Refrescar para actualizar estado de ratings pendientes
    refetch();
  };

  const isGroupOwner = (group: GroupOffer): boolean => {
    if (!currentUser?.student) {
      console.log('No currentUser.student');
      return false;
    }
    // Comparar con register (padrón) ya que author.id contiene el creatorStudentRegister
    const isOwner = group.author.id === String(currentUser.student.register);
    console.log('isGroupOwner check:', {
      groupId: group.id,
      authorId: group.author.id,
      userRegister: currentUser.student.register,
      status: group.status,
      isOwner
    });
    return isOwner;
  };

  return (
    <AppShell>
      <div className={styles['groups-container']}>

        {loading && (
          <div className={styles.loadingState}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Cargando tus grupos...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <i className="pi pi-exclamation-circle" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-inbox" />
            <p>Aún no te has unido a ningún grupo.</p>
            <p>¡Explora las búsquedas y encuentra tu equipo de estudio ideal!</p>
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className={styles['groups-grid']}>
            {Object.entries(groupedGroups).map(([subject, subjectGroups]) => (
              <SubjectAccordion 
                key={subject} 
                subject={subject}
              >
                {subjectGroups.map((group) => (
                  <div key={group.id} className={styles.groupCardWrapper}>
                    <GroupOfferCard
                      offer={group}
                      onViewDetails={handleViewGroupDetails}
                      onRequestJoin={handleRequestLeaveGroup}
                      isJoined={true}
                      isLoading={leavingGroupId === group.id}
                    />
                    <div className={styles.groupActions}>
                      {/* Mostrar botón finalizar si el grupo está activo (o sin status) y es el owner */}
                      {(group.status === 'ACTIVE' || !group.status) && isGroupOwner(group) && (
                        <button
                          className={styles.finishButton}
                          onClick={() => handleFinishGroup(group.id)}
                          disabled={finishingGroupId === group.id}
                        >
                          {finishingGroupId === group.id ? (
                            <>
                              <i className="pi pi-spin pi-spinner" />
                              Finalizando...
                            </>
                          ) : (
                            <>
                              <i className="pi pi-check-circle" />
                              Finalizar Grupo
                            </>
                          )}
                        </button>
                      )}
                      {group.status === 'FINISHED' && pendingRatingsMap[group.id] && (
                        <button
                          className={styles.rateButton}
                          onClick={() => handleOpenRatingModal(group)}
                        >
                          <i className="pi pi-star" />
                          Calificar Compañeros
                        </button>
                      )}
                      {group.status === 'FINISHED' && !pendingRatingsMap[group.id] && (
                        <span className={styles.ratedBadge}>
                          <i className="pi pi-check" />
                          Calificaciones completadas
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </SubjectAccordion>
            ))}
          </div>
        )}

        {selectedGroup && (
          <GroupOfferDetailModal
            offer={selectedGroup}
            onClose={handleCloseDetailModal}
            showJoinButton={false}
            showEmailButtons={true}
          />
        )}

        {ratingGroup && (
          <RateGroupModal
            groupId={ratingGroup.id}
            groupTitle={ratingGroup.title}
            isOpen={true}
            onClose={handleCloseRatingModal}
            onComplete={handleCloseRatingModal}
          />
        )}

        <ConfirmModal
          isOpen={leaveConfirmGroup !== null}
          onClose={() => setLeaveConfirmGroup(null)}
          onConfirm={handleConfirmLeaveGroup}
          title="Salir del grupo"
          message={`¿Estás seguro de que querés salir del grupo "${leaveConfirmGroup?.title}"? Podrás volver a unirte enviando una nueva solicitud.`}
          confirmText="Salir"
          cancelText="Cancelar"
          isLoading={leavingGroupId !== null}
        />
      </div>
    </AppShell>
  );
}