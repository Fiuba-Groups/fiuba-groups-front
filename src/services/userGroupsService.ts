import { GroupOffer } from '../types/groupOffer';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con los grupos del usuario
 */

const API_BASE_URL = 'http://localhost:8080';

// Interfaz para la respuesta del backend
interface BackendGroup {
  id: number;
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  creatorStudentRegister: number;
  courseOfferingId: number;
  status: 'ACTIVE' | 'FINISHED';
}

/**
 * Transforma un grupo del backend al formato GroupOffer del frontend
 */
const transformBackendGroup = (group: BackendGroup): GroupOffer => {
  return {
    id: String(group.id),
    title: group.title || 'Sin título',
    description: group.description || '',
    subject: `Materia #${group.courseOfferingId}`, // Se podría mejorar con lookup de courseOffering
    cathedra: '',
    semester: '',
    totalSlots: group.maxMembers,
    availableSlots: group.maxMembers - group.memberCount,
    currentMembers: group.memberCount,
    author: {
      id: String(group.creatorStudentRegister),
      name: `Estudiante ${group.creatorStudentRegister}`,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: group.status,
  };
};

/**
 * Obtiene todos los grupos a los que pertenece el usuario actual
 * @returns Promise con el listado de grupos del usuario
 */
export const fetchUserGroups = async (): Promise<GroupOffer[]> => {
  try {
    const groups: BackendGroup[] = await apiFetch(`${API_BASE_URL}/users/me/groups`);
    return groups.map(transformBackendGroup);
  } catch (error) {
    console.error('Error al cargar grupos del usuario:', error);
    throw error;
  }
};

/**
 * Permite al usuario salir de un grupo
 * @param groupId - ID del grupo del que salir
 * @returns Promise con el resultado de la operación
 */
export const leaveUserGroup = async (groupId: string): Promise<void> => {
  // TODO: Implementar cuando exista el endpoint en el backend
  // await apiFetch(`/groups/${groupId}/leave`, {
  //   method: 'POST',
  // });
  console.log('leaveUserGroup llamado para grupo:', groupId);
  throw new Error('Funcionalidad "Salir del grupo" aún no implementada en el backend');
};
