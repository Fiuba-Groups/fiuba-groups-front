import { useState, useEffect } from 'react';
import { GroupOffer, UseGroupOffersResult } from '../types/groupOffer';
import { fetchGroupOffers } from '../services/groupOffersService';

/**
 * Hook personalizado para manejar las ofertas de grupos
 * @returns Estado y métodos para manejar ofertas de grupos
 */
export const useGroupOffers = (): UseGroupOffersResult => {
  const [offers, setOffers] = useState<GroupOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGroupOffers();
      setOffers(data);
    } catch (err) {
      setError('Error al cargar las ofertas de grupos');
      console.error('Error fetching group offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const refetch = () => {
    loadOffers();
  };

  return {
    offers,
    loading,
    error,
    refetch,
  };
};
