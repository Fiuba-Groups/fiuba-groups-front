import { useState } from 'react';
import styles from './UserGroup.module.scss';
import AppShell from '../../components/Shell';
import SearchBar from '../../components/SearchBar/index';
import GroupOfferCard from '../../components/GroupOfferCard/GroupOfferCard';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion';
import GroupOfferDetailModal from '../../components/GroupOfferDetailModal/GroupOfferDetailModal';
import { GroupOffer } from '../../types/groupOffer';
import { useUserGroups } from '../../hooks/useUserGroups';

/**
 * Componente para mostrar los grupos a los que pertenece el usuario.
 */
export default function UserGroup() {
  const { groups, loading, error, refetch, leaveGroup } = useUserGroups();
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupOffer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const handleSearch = (value: string) => {
    console.log('Buscando en mis grupos:', value);
    // TODO: Lógica para filtrar grupos del usuario
  };

  const handleViewGroupDetails = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedGroup(null);
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      setLeavingGroupId(groupId);
      await leaveGroup(groupId);
      console.log('Saliste del grupo exitosamente');
    } catch (error) {
      console.error('Error al salir del grupo:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setLeavingGroupId(null);
    }
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
                  <GroupOfferCard
                    key={group.id}
                    offer={group}
                    onViewDetails={handleViewGroupDetails}
                    onRequestJoin={handleLeaveGroup}
                    isJoined={true}
                    isLoading={leavingGroupId === group.id}
                  />
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
          />
        )}
      </div>
    </AppShell>
  );
}