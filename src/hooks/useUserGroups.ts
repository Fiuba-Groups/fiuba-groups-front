import { useState, useEffect } from 'react';
import { GroupOffer } from '../types/groupOffer';
import { fetchUserGroups, leaveUserGroup } from '../services/userGroupsService';

/**
 * Estado del hook useUserGroups
 */
export interface UseUserGroupsResult {
  groups: GroupOffer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  leaveGroup: (groupId: string) => Promise<void>;
}

/**
 * Hook personalizado para manejar los grupos del usuario actual
 * @returns Estado y métodos para manejar grupos del usuario
 */
export const useUserGroups = (): UseUserGroupsResult => {
  const [groups, setGroups] = useState<GroupOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserGroups();
      setGroups(data);
    } catch (err) {
      setError('Error al cargar tus grupos');
      console.error('Error fetching user groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const refetch = () => {
    loadGroups();
  };

  const leaveGroup = async (groupId: string) => {
    try {
      await leaveUserGroup(groupId);
      // Actualizar el estado local removiendo el grupo
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Error leaving group:', err);
      throw err;
    }
  };

  return {
    groups,
    loading,
    error,
    refetch,
    leaveGroup,
  };
};
