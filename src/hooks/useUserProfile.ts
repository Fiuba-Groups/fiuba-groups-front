import { useState, useEffect } from 'react';
import { Friend } from '../types/friends';
import { fetchUserProfile, sendFriendRequest, cancelFriendRequest } from '../services/userService';

/**
 * Estado del hook useUserProfile
 */
export interface UseUserProfileResult {
  user: Friend | null;
  loading: boolean;
  error: string | null;
  sendRequest: () => Promise<void>;
  cancelRequest: () => Promise<void>;
  isRequesting: boolean;
}

/**
 * Hook personalizado para manejar el perfil de un usuario específico
 * @param userId - ID del usuario cuyo perfil cargar
 * @returns Estado y métodos para manejar el perfil del usuario
 */
export const useUserProfile = (userId: string | undefined): UseUserProfileResult => {
  const [user, setUser] = useState<Friend | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const loadUserProfile = async () => {
    if (!userId) {
      setError('ID de usuario no proporcionado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await fetchUserProfile(userId);
      setUser(userData);
    } catch (err) {
      setError('Error al cargar el perfil del usuario');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const sendRequest = async () => {
    if (!userId) return;

    setIsRequesting(true);
    try {
      await sendFriendRequest(userId);
      // Aquí podrías actualizar el estado para mostrar que se envió la solicitud
      console.log('Solicitud enviada exitosamente');
    } catch (err) {
      console.error('Error sending friend request:', err);
      throw err;
    } finally {
      setIsRequesting(false);
    }
  };

  const cancelRequest = async () => {
    if (!userId) return;

    setIsRequesting(true);
    try {
      await cancelFriendRequest(userId);
      // Aquí podrías actualizar el estado para mostrar que se canceló la solicitud
      console.log('Solicitud cancelada exitosamente');
    } catch (err) {
      console.error('Error canceling friend request:', err);
      throw err;
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    user,
    loading,
    error,
    sendRequest,
    cancelRequest,
    isRequesting,
  };
};
