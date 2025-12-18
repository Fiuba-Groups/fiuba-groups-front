import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import AppShell from '../../components/Shell';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import SearchBar from '../../components/SearchBar/index';
import GroupOfferCard from '../../components/GroupOfferCard/GroupOfferCard';
import SubjectAccordion from '../../components/SubjectAccordion/SubjectAccordion';
import { useGroupOffers } from '../../hooks/useGroupOffers';
import { createGroupRequest, fetchUserSentRequests } from '../../services/requestsService';
import { fetchCurrentUser } from '../../services/currentUserService';
import { fetchUserGroups } from '../../services/userGroupsService';
import { fetchStudentRatings } from '../../services/ratingsService';
import { GroupOffer } from '../../types/groupOffer';
import { useNavigate } from 'react-router-dom';
import GroupOfferDetailModal from '../../components/GroupOfferDetailModal/GroupOfferDetailModal';
import FilterModal from '../../components/FilterModal/FilterModal';

/**
 * Componente principal de la pantalla de ofertas de grupos
 * Maneja la lógica de la pantalla y renderiza los componentes
 */
export default function GroupOffers() {
  const { offers, loading, error, refetch } = useGroupOffers();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<GroupOffer | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [slotFilter, setSlotFilter] = useState<'all' | 'available' | 'full'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [cathedraFilter, setCathedraFilter] = useState<string>('all');
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [userGroupIds, setUserGroupIds] = useState<Set<string>>(new Set());
  const [requestingOfferId, setRequestingOfferId] = useState<string | null>(null);
  const [currentUserRegister, setCurrentUserRegister] = useState<number | null>(null);
  const [authorRatings, setAuthorRatings] = useState<Record<string, { average: number; count: number } | null>>({});

  // Cargar usuario actual, grupos a los que pertenece y solicitudes enviadas
  useEffect(() => {
    const loadUserAndRequests = async () => {
      try {
        // Obtener usuario actual
        const user = await fetchCurrentUser();
        if (user.student?.register) {
          setCurrentUserRegister(user.student.register);
        }

        // Obtener grupos a los que el usuario ya pertenece
        try {
          const userGroups = await fetchUserGroups();
          const groupIds = new Set<string>(userGroups.map(g => g.id));
          setUserGroupIds(groupIds);
        } catch (err) {
          console.error('Error cargando grupos del usuario:', err);
        }

        // Obtener solicitudes enviadas desde el backend
        const requests = await fetchUserSentRequests();
        const sentRequestIds = new Set<string>(
          requests
            .filter(req => req.status === 'pending')
            .map(req => req.groupOfferId)
        );
        setSentRequests(sentRequestIds);
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      }
    };

    loadUserAndRequests();
  }, []);

  // Cargar ratings de los autores de las ofertas
  useEffect(() => {
    const loadAuthorRatings = async () => {
      const ratingsMap: Record<string, { average: number; count: number } | null> = {};
      const uniqueAuthorIds = Array.from(new Set(offers.map(o => o.author.id)));
      
      for (const authorId of uniqueAuthorIds) {
        if (!ratingsMap[authorId]) {
          try {
            const ratings = await fetchStudentRatings(Number(authorId));
            ratingsMap[authorId] = {
              average: ratings.averageRating,
              count: ratings.totalRatings
            };
          } catch {
            ratingsMap[authorId] = null;
          }
        }
      }
      
      setAuthorRatings(ratingsMap);
    };

    if (offers.length > 0) {
      loadAuthorRatings();
    }
  }, [offers]);

  /**
   * Verifica si ya se envió una solicitud para una oferta específica
   */
  const hasSentRequest = (offerId: string): boolean => {
    return sentRequests.has(offerId);
  };

  /**
   * Verifica si el usuario ya es miembro del grupo
   */
  const isMemberOfGroup = (offerId: string): boolean => {
    return userGroupIds.has(offerId);
  };

  /**
   * Verifica si el usuario actual es el autor de una oferta
   */
  const isOwnOffer = (offer: GroupOffer): boolean => {
    if (!currentUserRegister) return false;
    return offer.author.id === currentUserRegister.toString();
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

    // Excluir grupos propios - el usuario no debería ver sus propios grupos en la búsqueda
    filtered = filtered.filter(offer => !isOwnOffer(offer));

    // Excluir grupos donde el usuario ya es miembro
    filtered = filtered.filter(offer => !isMemberOfGroup(offer.id));

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
      console.warn('Ya has enviado una solicitud a este grupo');
      return; // Ya se envió solicitud para esta oferta
    }

    if (isMemberOfGroup(offerId)) {
      console.warn('Ya eres miembro de este grupo');
      return; // Ya es miembro del grupo
    }

    // Verificar que no sea un grupo propio
    const offer = offers.find(o => o.id === offerId);
    if (offer && isOwnOffer(offer)) {
      console.warn('No puedes solicitar unirte a tu propio grupo');
      return;
    }

    setRequestingOfferId(offerId);
    try {
      // Crear la solicitud en el backend
      await createGroupRequest(offerId, 'Estoy interesado en unirme al grupo.');

      // Actualizar el estado local de solicitudes enviadas
      setSentRequests(prev => new Set(Array.from(prev).concat(offerId)));

      // Refrescar la lista de ofertas para actualizar los slots
      refetch();

      console.log('Solicitud enviada exitosamente');
    } catch (error) {
      console.error('Error al solicitar unirse:', error);
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
                    authorRating={authorRatings[offer.author.id]}
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