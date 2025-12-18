import { useState, useEffect, useCallback } from 'react';
import { FriendRequest, UseUserFriendRequestsResult } from '../types/friends';
import {
  fetchSentFriendRequests,
  fetchReceivedFriendRequests,
  sendFriendRequest as sendFriendRequestService,
  acceptFriendRequest as acceptFriendRequestService,
  rejectFriendRequest as rejectFriendRequestService,
  cancelFriendRequest as cancelFriendRequestService,
} from '../services/friendsService';

/**
 * Hook personalizado para manejar las solicitudes de amistad del usuario
 * @returns Estado y métodos para manejar solicitudes de amistad
 */
export const useUserFriendRequests = (): UseUserFriendRequestsResult => {
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sent, received] = await Promise.all([
        fetchSentFriendRequests(),
        fetchReceivedFriendRequests(),
      ]);

      setSentRequests(sent);
      setReceivedRequests(received);
    } catch (err) {
      setError('Error al cargar las solicitudes de amistad');
      console.error('Error fetching friend requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const refetch = () => {
    loadRequests();
  };

  const sendFriendRequest = async (receiverId: string) => {
    try {
      const newRequest = await sendFriendRequestService(receiverId);
      setSentRequests(prev => [...prev, newRequest]);
    } catch (err) {
      console.error('Error sending friend request:', err);
      throw err;
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequestService(requestId);
      // Actualizar el estado local
      setReceivedRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: 'ACCEPTED' as const, respondedAt: new Date().toISOString() }
            : request
        )
      );
    } catch (err) {
      console.error('Error accepting friend request:', err);
      throw err;
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequestService(requestId);
      // Actualizar el estado local
      setReceivedRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: 'REJECTED' as const, respondedAt: new Date().toISOString() }
            : request
        )
      );
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      throw err;
    }
  };

  const cancelRequest = async (requestId: string) => {
    try {
      await cancelFriendRequestService(requestId);
      // Remover la solicitud del estado local
      setSentRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (err) {
      console.error('Error canceling friend request:', err);
      throw err;
    }
  };

  return {
    sentRequests,
    receivedRequests,
    loading,
    error,
    refetch,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
  };
};
