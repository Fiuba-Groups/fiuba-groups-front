import { useState, useEffect } from 'react';
import { GroupOffer } from '../types/groupOffer';
import { fetchUserSearches, deleteUserSearch } from '../services/searchesService';

/**
 * Estado del hook useUserSearches
 */
export interface UseUserSearchesResult {
  searches: GroupOffer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  deleteSearch: (searchId: string) => Promise<void>;
}

/**
 * Hook personalizado para manejar las búsquedas creadas por el usuario
 * @returns Estado y métodos para manejar búsquedas del usuario
 */
export const useUserSearches = (): UseUserSearchesResult => {
  const [searches, setSearches] = useState<GroupOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSearches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserSearches();
      setSearches(data);
    } catch (err) {
      setError('Error al cargar las búsquedas');
      console.error('Error fetching user searches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSearches();
  }, []);

  const refetch = () => {
    loadSearches();
  };

  const deleteSearch = async (searchId: string) => {
    try {
      await deleteUserSearch(searchId);
      // Actualizar el estado local removiendo la búsqueda eliminada
      setSearches(prev => prev.filter(search => search.id !== searchId));
    } catch (err) {
      console.error('Error deleting search:', err);
      throw err;
    }
  };

  return {
    searches,
    loading,
    error,
    refetch,
    deleteSearch,
  };
};
