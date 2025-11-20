import { GroupOffer } from '../types/groupOffer';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con ofertas de grupos
 */

// Interfaz para la respuesta del backend
interface GroupResponse {
  id: number;
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  creatorStudentRegister: number;
  courseOfferingId: number;
  courseOffering: {
    id: number;
    quarter: string;
    year: string;
    courseId: number;
    courseEntity: {
      id: number;
      commission: string;
      active: boolean;
      subjectCode: string;
      subject: {
        code: string;
        name: string;
        department: string;
      };
    };
    groups: string[];
  };
  members: {
    id: number;
    register: number;
    name: string;
    groups: string[];
  }[];
}

/**
 * Obtiene todas las ofertas de grupos disponibles
 * @returns Promise con el listado de ofertas
 */
export const fetchGroupOffers = async (): Promise<GroupOffer[]> => {
  try {
    const groups: GroupResponse[] = await apiFetch('http://localhost:8080/groups');

    // Mapear la respuesta del backend al formato esperado por el frontend
    return groups.map(group => ({
      id: group.id.toString(),
      title: group.title,
      description: group.description,
      subject: group.courseOffering.courseEntity.subject.name,
      cathedra: group.courseOffering.courseEntity.commission,
      semester: `${group.courseOffering.quarter} ${group.courseOffering.year}`,
      totalSlots: group.maxMembers,
      availableSlots: group.maxMembers - group.memberCount,
      author: {
        id: `${group.creatorStudentRegister}`,
        name: group.members.find(member => member.register === group.creatorStudentRegister)?.name || `Estudiante ${group.creatorStudentRegister}`,
        profileUrl: `/profile/${group.creatorStudentRegister}`
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error al cargar grupos:', error);
    throw error;
  }
};

/**
 * Solicita unirse a una oferta de grupo
 * @param offerId - ID de la oferta a la que se quiere unir
 * @returns Promise con el resultado de la solicitud
 */
export const requestToJoinGroup = async (offerId: string): Promise<void> => {
  // TODO: Implementar llamada al API del backend
  // Ejemplo: await apiFetch(`/api/group-offers/${offerId}/join`, { method: 'POST' });
  console.log(`Solicitando unirse al grupo: ${offerId}`);
};