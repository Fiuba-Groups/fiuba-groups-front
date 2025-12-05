import { useState, useEffect } from 'react';
import { Friend } from '../types/friends';
import { fetchUserProfile } from '../services/userService';
import { sendFriendRequest, fetchSentFriendRequests, cancelFriendRequest } from '../services/friendsService';
import { FriendRequest } from '../types/friends';

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
  hasPendingRequest: boolean;
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
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);

  const loadUserProfile = async () => {
    if (!userId) {
      setError('ID de usuario no proporcionado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Cargar perfil y verificar solicitudes pendientes en paralelo
      const [userData, sentRequests] = await Promise.all([
        fetchUserProfile(userId),
        fetchSentFriendRequests().catch(() => [])
      ]);
      
      setUser(userData);
      
      // Verificar si hay una solicitud pendiente para este usuario
      const pendingRequest = sentRequests.find(
        (req: FriendRequest) => req.receiver?.id.toString() === userId && req.status === 'PENDING'
      );
      setPendingRequestId(pendingRequest?.id || null);
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
      const response = await sendFriendRequest(userId);
      setPendingRequestId(response.id.toString());
      console.log('Solicitud enviada exitosamente');
    } catch (err) {
      console.error('Error sending friend request:', err);
      throw err;
    } finally {
      setIsRequesting(false);
    }
  };

  const cancelRequest = async () => {
    if (!pendingRequestId) return;

    setIsRequesting(true);
    try {
      await cancelFriendRequest(pendingRequestId);
      setPendingRequestId(null);
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
    hasPendingRequest: !!pendingRequestId,
  };
};
