import React, { useState } from 'react';
import { Edit, Trash2, Users, Calendar, BookOpen } from 'lucide-react';
import styles from './UserSearches.module.scss';
import AppShell from '../../components/Shell';
import SearchBar from '../../components/SearchBar/index';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import GroupOfferDetailModal from '../../components/GroupOfferDetailModal/GroupOfferDetailModal';
import { useUserSearches } from '../../hooks/useUserSearches';
import { GroupOffer } from '../../types/groupOffer';

/**
 * Componente para mostrar las búsquedas creadas por el usuario
 */
export default function UserSearches() {
  const { searches, loading, error, refetch, deleteSearch } = useUserSearches();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSearch, setSelectedSearch] = useState<GroupOffer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState<GroupOffer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Filtra las búsquedas según el término de búsqueda
   */
  const filteredSearches = searches.filter(search =>
    search.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    search.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    search.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Maneja la búsqueda de ofertas
   */
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  /**
   * Maneja la visualización de detalles de una búsqueda
   */
  const handleViewDetails = (search: GroupOffer) => {
    setSelectedSearch(search);
    setIsDetailModalOpen(true);
  };

  /**
   * Cierra el modal de detalles
   */
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSearch(null);
  };

  /**
   * Maneja la edición de una búsqueda
   */
  const handleEditSearch = (search: GroupOffer) => {
    console.log('Editar búsqueda:', search.id);
    // TODO: Navegar a pantalla de edición o abrir modal de edición
  };

  /**
   * Maneja la eliminación de una búsqueda - abre modal de confirmación
   */
  const handleDeleteSearch = (search: GroupOffer) => {
    setSearchToDelete(search);
    setIsConfirmModalOpen(true);
  };

  /**
   * Confirma la eliminación de la búsqueda
   */
  const handleConfirmDelete = async () => {
    if (!searchToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSearch(searchToDelete.id);
      console.log('Búsqueda eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar búsqueda:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setIsDeleting(false);
      setSearchToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  /**
   * Cierra el modal de confirmación
   */
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSearchToDelete(null);
  };

  /**
   * Maneja la solicitud de unión (no aplicable para búsquedas propias)
   */
  const handleRequestJoin = async (searchId: string) => {
    // No aplicable para búsquedas propias
    console.log('No se puede solicitar unirse a la propia búsqueda');
  };

  /**
   * Formatea la fecha de creación
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalSearches = searches.length;

  return (
    <AppShell>
      <div className={styles.searchesContainer}>
        <div className={styles.searchesHeader}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Mis Búsquedas</h1>
            <div className={styles.stats}>
              <span className={styles.totalCount}>
                {totalSearches} búsqueda{totalSearches !== 1 ? 's' : ''} creada{totalSearches !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <SearchBar
            placeholder="Buscar en mis búsquedas"
            onSearch={handleSearch}
            onChange={setSearchTerm}
          />
        </div>

        {loading && (
          <div className={styles.loadingState}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Cargando tus búsquedas...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <i className="pi pi-exclamation-circle" />
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={refetch}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filteredSearches.length === 0 && searches.length === 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-plus-circle" />
            <h3>Aún no has creado búsquedas</h3>
            <p>¡Crea tu primera búsqueda de compañeros de estudio!</p>
          </div>
        )}

        {!loading && !error && filteredSearches.length === 0 && searches.length > 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-search" />
            <h3>No se encontraron búsquedas</h3>
            <p>No hay búsquedas que coincidan con tu búsqueda.</p>
          </div>
        )}

        {!loading && !error && filteredSearches.length > 0 && (
          <div className={styles.searchesGrid}>
            {filteredSearches.map((search) => (
              <div key={search.id} className={styles.searchCard}>
                <div className={styles.searchHeader}>
                  <div className={styles.searchMeta}>
                    <span className={styles.subject}>
                      <BookOpen size={16} />
                      {search.subject}
                    </span>
                    <span className={styles.cathedra}>
                      {search.cathedra}
                    </span>
                    <span className={styles.semester}>
                      <Calendar size={16} />
                      {search.semester}
                    </span>
                  </div>
                  <div className={styles.searchActions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEditSearch(search)}
                      title="Editar búsqueda"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleDeleteSearch(search)}
                      title="Eliminar búsqueda"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.searchContent}>
                  <h3 className={styles.searchTitle}>{search.title}</h3>
                  <p className={styles.searchDescription}>{search.description}</p>

                  <div className={styles.searchStats}>
                    <div className={styles.stat}>
                      <Users size={16} />
                      <span>
                        {search.availableSlots} / {search.totalSlots} cupos disponibles
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span>Creada {formatDate(search.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.searchFooter}>
                  <button
                    className={styles.viewDetailsButton}
                    onClick={() => handleViewDetails(search)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSearch && (
          <GroupOfferDetailModal
            offer={selectedSearch}
            onClose={handleCloseDetailModal}
            onRequestJoin={handleRequestJoin}
          />
        )}

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmDelete}
          title="Eliminar búsqueda"
          message={`¿Quieres eliminar la búsqueda "${searchToDelete?.title}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          isLoading={isDeleting}
        />
      </div>
    </AppShell>
  );
}
