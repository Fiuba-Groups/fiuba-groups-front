import { useState, useEffect } from 'react';
import { Friend, UseUserFriendsResult } from '../types/friends';
import { fetchUserFriends } from '../services/friendsService';

/**
 * Hook personalizado para manejar los amigos del usuario
 * @returns Estado y métodos para manejar amigos
 */
export const useUserFriends = (): UseUserFriendsResult => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserFriends();
      setFriends(data);
    } catch (err) {
      setError('Error al cargar los amigos');
      console.error('Error fetching user friends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  const refetch = () => {
    loadFriends();
  };

  return {
    friends,
    loading,
    error,
    refetch,
  };
};
