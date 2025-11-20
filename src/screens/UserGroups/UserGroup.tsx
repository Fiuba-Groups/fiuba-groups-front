import { useState } from 'react';
import styles from './UserGroup.module.scss';
import AppShell from '../../components/Shell';
import SearchBar from '../../components/SearchBar/index';
import GroupOfferCard from '../../components/GroupOfferCard/GroupOfferCard';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion';
import { GroupOffer } from '../../types/groupOffer';
// import { useUserGroups } from '../../hooks/useUserGroups'; // TODO: Implementar este hook

// --- Datos de ejemplo (reemplazar con datos reales del hook) ---
const mockUserGroups: GroupOffer[] = [
  {
    id: '1',
    title: 'Grupo de Análisis Matemático II',
    description: 'Buscamos estudiantes para formar un grupo de estudio para Análisis Matemático II. Nos juntamos los lunes y miércoles por la tarde.',
    subject: 'Análisis Matemático II',
    cathedra: 'García',
    semester: '1C 2025',
    totalSlots: 5,
    availableSlots: 2,
    author: {
      id: 'user1',
      name: 'Juan Pérez',
    },
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-02T12:00:00Z',
  },
  {
   id: '2',
    title: 'Grupo de Algebra',
    description: 'Solo quiero un compañero.',
    subject: 'Algebra 5',
    cathedra: 'Turri',
    semester: '1C 2026',
    totalSlots: 1,
    availableSlots: 1,
    author: {
      id: '4',
      name: 'Franco Foden',
    },
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-02T12:00:00Z',},
  
];
// --- Fin de datos de ejemplo ---


/**
 * Componente para mostrar los grupos a los que pertenece el usuario.
 */
export default function UserGroup() {
  // const { groups, loading, error } = useUserGroups(); // TODO: Usar el hook real
  const [groups, setGroups] = useState(mockUserGroups);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleLeaveGroup = (groupId: string) => {
    console.log('Saliendo del grupo:', groupId);
    // TODO: Lógica para salir de un grupo
    setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
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
                    onViewDetails={() => console.log("Viendo detalles de", group.id)} // TODO: Implementar vista de detalle/chat del grupo
                    onRequestJoin={handleLeaveGroup} // Reutilizamos el prop para la acción principal
                    isJoined={true}
                  />
                ))}
              </SubjectAccordion>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}