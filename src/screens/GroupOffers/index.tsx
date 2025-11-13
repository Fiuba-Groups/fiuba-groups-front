import styles from './styles.module.scss';
import AppShell from '../../components/Shell';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import SearchBar from '../../components/SearchBar/index';
import GroupOfferCard from '../../components/GroupOfferCard/GroupOfferCard';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion';
import { useGroupOffers } from '../../hooks/useGroupOffers';
import { requestToJoinGroup } from '../../services/groupOffersService';
import { GroupOffer } from '../../types/groupOffer';
import { useNavigate } from 'react-router-dom';

/**
 * Componente principal de la pantalla de ofertas de grupos
 * Maneja la lógica de la pantalla y renderiza los componentes
 */
export default function GroupOffers() {
  const { offers, loading, error } = useGroupOffers();
  const navigate = useNavigate();

  /**
   * Agrupa las ofertas por materia
   * @returns Objeto con ofertas agrupadas por materia
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

  const groupedOffers = groupOffersBySubject(offers);

  /**
   * Función para crear una nueva publicación
   * Maneja la lógica para navegar a crear publicación
   */
  const handleCreatePost = () => {
    navigate('/new-group-search');
  };

  /**
   * Función para manejar la búsqueda
   * @param value - Valor ingresado en el buscador
   */
  const handleSearch = (value: string) => {
    console.log('Buscando:', value);
    // TODO: lógica para filtrar/buscar grupos
  };

  /**
   * Función para manejar el filtrado
   */
  const handleFilter = () => {
    console.log('Filtrar');
    // TODO: lógica para abrir modal de filtros
  };

  /**
   * Función para ver los detalles de una oferta
   * @param offerId - ID de la oferta a ver
   */
  const handleViewDetails = (offerId: string) => {
    console.log('Ver detalles de oferta:', offerId);
    // TODO: lógica para navegar a los detalles de la oferta
  };

  /**
   * Función para solicitar unirse a un grupo
   * @param offerId - ID de la oferta a la que se quiere unir
   */
  const handleRequestJoin = async (offerId: string) => {
    try {
      await requestToJoinGroup(offerId);
      console.log('Solicitud enviada exitosamente');
      // TODO: Mostrar notificación de éxito
      // TODO: Actualizar la lista de ofertas
    } catch (error) {
      console.error('Error al solicitar unirse:', error);
      // TODO: Mostrar notificación de error
    }
  };

  /**
   * Función para renderizar el botón de filtrado
   * @returns Botón de filtro
   */
  const filterButton = () => {
    return (
      <button className={styles.filterButton} onClick={handleFilter}>
        <i className="pi pi-filter" />
        <span>Filtrar</span>
      </button>
    );
  };

  return (
    <AppShell>
      <div className={styles.searchGroupOffersContent}> 
        <div className={styles.searchGroupOffersContentHeader}>
          <SearchBar placeholder="Buscar grupos" onSearch={handleSearch} />
          {filterButton()}
        </div>

        {loading && (
          <div className={styles.loadingState}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Cargando ofertas...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <i className="pi pi-exclamation-circle" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-inbox" />
            <p>No hay ofertas de grupos disponibles</p>
          </div>
        )}

        {!loading && !error && offers.length > 0 && (
          <div className={styles.offersContainer}>
            {Object.entries(groupedOffers).map(([subject, subjectOffers]) => (
              <SubjectAccordion 
                key={subject} 
                subject={subject}
              >
                {subjectOffers.map((offer) => (
                  <GroupOfferCard
                    key={offer.id}
                    offer={offer}
                    onViewDetails={handleViewDetails}
                    onRequestJoin={handleRequestJoin}
                  />
                ))}
              </SubjectAccordion>
            ))}
          </div>
        )}

        <FloatingButton 
          onClick={handleCreatePost}
          icon="pi pi-plus"
          label="Crear búsqueda"
        />
      </div>
    </AppShell>
  );
}