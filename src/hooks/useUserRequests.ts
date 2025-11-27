import { useState, useEffect } from 'react';
import { GroupRequest, UseUserRequestsResult } from '../types/requests';
import {
  fetchUserSentRequests,
  fetchUserReceivedRequests,
  acceptGroupRequest,
  rejectGroupRequest,
  cancelGroupRequest
} from '../services/requestsService';

/**
 * Hook personalizado para manejar las solicitudes de unión a grupos del usuario
 * @returns Estado y métodos para manejar solicitudes
 */
export const useUserRequests = (): UseUserRequestsResult => {
  const [sentRequests, setSentRequests] = useState<GroupRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<GroupRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sent, received] = await Promise.all([
        fetchUserSentRequests(),
        fetchUserReceivedRequests()
      ]);

      setSentRequests(sent);
      setReceivedRequests(received);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error('Error fetching user requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const refetch = () => {
    loadRequests();
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await acceptGroupRequest(requestId);

      // Encontrar la solicitud para obtener el ID del grupo
      const request = receivedRequests.find(r => r.id === requestId);
      if (request) {
        // Actualizar el contador de miembros del grupo
        const GROUPS_STORAGE_KEY = 'fiuba_group_offers';
        const groups = JSON.parse(localStorage.getItem(GROUPS_STORAGE_KEY) || '[]');
        const groupIndex = groups.findIndex((g: any) => g.id === request.groupOfferId);

        if (groupIndex !== -1) {
          groups[groupIndex].currentMembers += 1;
          localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
        }
      }

      // Actualizar el estado local
      setReceivedRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: 'accepted' as const, respondedAt: new Date().toISOString() }
            : request
        )
      );
    } catch (err) {
      console.error('Error accepting request:', err);
      throw err;
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await rejectGroupRequest(requestId);
      // Actualizar el estado local
      setReceivedRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: 'rejected' as const, respondedAt: new Date().toISOString() }
            : request
        )
      );
    } catch (err) {
      console.error('Error rejecting request:', err);
      throw err;
    }
  };

  const cancelRequest = async (requestId: string) => {
    try {
      await cancelGroupRequest(requestId);
      // Actualizar el estado local removiendo la solicitud
      setSentRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (err) {
      console.error('Error canceling request:', err);
      throw err;
    }
  };

  return {
    sentRequests,
    receivedRequests,
    loading,
    error,
    refetch,
    acceptRequest,
    rejectRequest,
    cancelRequest,
  };
};
