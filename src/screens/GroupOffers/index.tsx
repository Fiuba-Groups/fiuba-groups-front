import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import AppShell from '../../components/Shell';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import SearchBar from '../../components/SearchBar/index';
import GroupOfferCard from '../../components/GroupOfferCard/GroupOfferCard';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion';
import { useGroupOffers } from '../../hooks/useGroupOffers';
import { requestToJoinGroup } from '../../services/groupOffersService';
import { createGroupRequest } from '../../services/requestsService';
import { GroupOffer } from '../../types/groupOffer';
import { useNavigate } from 'react-router-dom';
import GroupOfferDetailModal from '../../components/GroupOfferDetailModal/GroupOfferDetailModal';
import FilterModal from '../../components/FilterModal/FilterModal';

/**
 * Componente principal de la pantalla de ofertas de grupos
 * Maneja la lógica de la pantalla y renderiza los componentes
 */
export default function GroupOffers() {
  const { offers, loading, error } = useGroupOffers();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<GroupOffer | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [slotFilter, setSlotFilter] = useState<'all' | 'available' | 'full'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [cathedraFilter, setCathedraFilter] = useState<string>('all');
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [requestingOfferId, setRequestingOfferId] = useState<string | null>(null);

  // Cargar solicitudes enviadas al montar el componente
  useEffect(() => {
    const loadSentRequests = () => {
      try {
        const REQUESTS_STORAGE_KEY = 'fiuba_user_requests';
        const storedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY);
        if (storedRequests) {
          const requests = JSON.parse(storedRequests);
          const sentRequestIds = new Set<string>(
            requests
              .filter((req: any) => req.requesterId === 'current-user' && req.status === 'pending')
              .map((req: any) => String(req.groupOfferId))
          );
          setSentRequests(sentRequestIds);
        }
      } catch (error) {
        console.error('Error cargando solicitudes enviadas:', error);
      }
    };

    loadSentRequests();
  }, []);

  /**
   * Verifica si ya se envió una solicitud para una oferta específica
   */
  const hasSentRequest = (offerId: string): boolean => {
    return sentRequests.has(offerId);
  };

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

  /**
   * Filtra las ofertas según todos los filtros aplicados
   * @param offers - Lista de ofertas a filtrar
   * @returns Lista filtrada de ofertas
   */
  const filterOffers = (offers: GroupOffer[]): GroupOffer[] => {
    let filtered = offers;

    // Filtro por cupo disponible
    switch (slotFilter) {
      case 'available':
        filtered = filtered.filter(offer => offer.availableSlots > 0);
        break;
      case 'full':
        filtered = filtered.filter(offer => offer.availableSlots === 0);
        break;
      case 'all':
      default:
        break;
    }

    // Filtro por materia
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(offer => offer.subject === subjectFilter);
    }

    // Filtro por cuatrimestre
    if (semesterFilter !== 'all') {
      filtered = filtered.filter(offer => offer.semester === semesterFilter);
    }

    // Filtro por cátedra
    if (cathedraFilter !== 'all') {
      filtered = filtered.filter(offer => offer.cathedra === cathedraFilter);
    }

    return filtered;
  };

  /**
   * Extrae las opciones únicas de materia de todas las ofertas
   */
  const getUniqueSubjects = (offers: GroupOffer[]): string[] => {
    const subjects = offers.map(offer => offer.subject);
    return ['all', ...Array.from(new Set(subjects)).sort()];
  };

  /**
   * Extrae las opciones únicas de cuatrimestre de todas las ofertas
   */
  const getUniqueSemesters = (offers: GroupOffer[]): string[] => {
    const semesters = offers.map(offer => offer.semester);
    return ['all', ...Array.from(new Set(semesters)).sort()];
  };

  /**
   * Extrae las opciones únicas de cátedra de todas las ofertas
   */
  const getUniqueCathedras = (offers: GroupOffer[]): string[] => {
    const cathedras = offers.map(offer => offer.cathedra);
    return ['all', ...Array.from(new Set(cathedras)).sort()];
  };

  const uniqueSubjects = getUniqueSubjects(offers);
  const uniqueSemesters = getUniqueSemesters(offers);
  const uniqueCathedras = getUniqueCathedras(offers);

  const filteredOffers = filterOffers(offers);
  const groupedOffers = groupOffersBySubject(filteredOffers);

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
    setIsFilterModalOpen(true);
  };

  /**
   * Función para ver los detalles de una oferta
   * @param offerId - ID de la oferta a ver
   */
  const handleViewDetails = (offerId: string) => {
    const offer = offers.find((item) => item.id === offerId);
    if (offer) {
      setSelectedOffer(offer);
    }
  };

  /**
   * Cierra el modal de detalles
   */
  const handleCloseDetails = () => {
    setSelectedOffer(null);
  };

  /**
   * Cierra el modal de filtros
   */
  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  /**
   * Limpia los filtros aplicados
   */
  const handleClearFilters = () => {
    setSlotFilter('all');
    setSubjectFilter('all');
    setSemesterFilter('all');
    setCathedraFilter('all');
    console.log('Filtros limpiados');
  };

  /**
   * Aplica los filtros seleccionados
   */
  const handleApplyFilters = () => {
    console.log('Aplicando filtros');
    setIsFilterModalOpen(false);
  };

  /**
   * Función para solicitar unirse a un grupo
   * @param offerId - ID de la oferta a la que se quiere unir
   */
  const handleRequestJoin = async (offerId: string) => {
    if (hasSentRequest(offerId)) {
      return; // Ya se envió solicitud para esta oferta
    }

    setRequestingOfferId(offerId);
    try {
      // Crear la solicitud
      await createGroupRequest(offerId, 'Estoy interesado en unirme al grupo.');

      // Reducir slots disponibles (lógica existente)
      await requestToJoinGroup(offerId);

      // Actualizar el estado local
      setSentRequests(prev => new Set(Array.from(prev).concat(offerId)));

      console.log('Solicitud enviada exitosamente');
      // TODO: Mostrar notificación de éxito
      // TODO: Actualizar la lista de ofertas
    } catch (error) {
      console.error('Error al solicitar unirse:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setRequestingOfferId(null);
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
                    requestSent={hasSentRequest(offer.id)}
                    isLoading={requestingOfferId === offer.id}
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

        {selectedOffer && (
          <GroupOfferDetailModal
            offer={selectedOffer}
            onClose={handleCloseDetails}
            onRequestJoin={handleRequestJoin}
          />
        )}

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleCloseFilterModal}
          onClear={handleClearFilters}
          onApply={handleApplyFilters}
          slotFilter={slotFilter}
          onSlotFilterChange={setSlotFilter}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          semesterFilter={semesterFilter}
          onSemesterFilterChange={setSemesterFilter}
          cathedraFilter={cathedraFilter}
          onCathedraFilterChange={setCathedraFilter}
          availableSubjects={uniqueSubjects}
          availableSemesters={uniqueSemesters}
          availableCathedras={uniqueCathedras}
        />
      </div>
    </AppShell>
  );
}