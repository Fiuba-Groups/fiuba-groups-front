import { GroupOffer, GroupMember } from '../types/groupOffer';
import { apiFetch } from './authService';
import { fetchStudentRatings } from './ratingsService';

/**
 * Servicio para manejar las operaciones relacionadas con los grupos del usuario
 */

const API_BASE_URL = 'http://localhost:8080';

// Interfaz para un miembro del backend
interface BackendMember {
  id: number;
  register: number;
  name: string;
}

// Interfaz para la respuesta del backend (actualizada con los nuevos campos)
interface BackendGroup {
  id: number;
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  creatorStudentRegister: number;
  courseOfferingId: number;
  status: 'ACTIVE' | 'FINISHED';
  // Lista de miembros del grupo
  members?: BackendMember[];
  // Nuevo campo: estudiante creador con su nombre
  creatorStudent?: {
    id: number;
    register: number;
    name: string;
  };
  courseOffering?: {
    id: number;
    quarter: string;
    year: string;
    courseId: number;
    courseEntity?: {
      id: number;
      commission: string;
      active: boolean;
      subjectCode: string;
      subject?: {
        code: string;
        name: string;
        department: string;
      };
    };
  };
}

/**
 * Convierte los miembros del backend al formato del frontend (sin rating)
 */
const mapBackendMembers = (members?: BackendMember[]): GroupMember[] => {
  if (!members) return [];
  return members.map(member => ({
    id: member.id.toString(),
    register: member.register,
    name: member.name || `Estudiante ${member.register}`,
    profileUrl: `/profile/${member.register}`,
  }));
};

/**
 * Enriquece los miembros con información de rating
 */
const enrichMembersWithRatings = async (members: GroupMember[]): Promise<GroupMember[]> => {
  if (!members || members.length === 0) return [];
  
  const enrichedMembers = await Promise.all(
    members.map(async (member) => {
      try {
        const ratingSummary = await fetchStudentRatings(parseInt(member.id));
        return {
          ...member,
          rating: {
            average: ratingSummary.averageRating,
            count: ratingSummary.totalRatings,
          },
        };
      } catch (error) {
        console.warn(`No se pudo obtener rating para estudiante ${member.id}`);
        return member;
      }
    })
  );
  
  return enrichedMembers;
};

/**
 * Transforma un grupo del backend al formato GroupOffer del frontend
 */
const transformBackendGroup = (group: BackendGroup): GroupOffer => {
  // Usar datos del courseOffering si están disponibles
  const courseOffering = group.courseOffering;
  const courseEntity = courseOffering?.courseEntity;
  const subject = courseEntity?.subject;

  // Obtener nombre del creador desde creatorStudent si está disponible
  const creatorName = group.creatorStudent?.name || `Estudiante ${group.creatorStudentRegister}`;

  return {
    id: String(group.id),
    title: group.title || 'Sin título',
    description: group.description || '',
    subject: subject?.name || `Materia #${group.courseOfferingId}`,
    cathedra: courseEntity?.commission || 'Sin cátedra',
    semester: courseOffering ? `${courseOffering.quarter} ${courseOffering.year}` : '',
    totalSlots: group.maxMembers,
    availableSlots: group.maxMembers - group.memberCount,
    currentMembers: group.memberCount,
    author: {
      id: String(group.creatorStudentRegister),
      name: creatorName,
    },
    members: mapBackendMembers(group.members),
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
    const groupOffers = groups.map(transformBackendGroup);
    
    // Enriquecer cada grupo con los ratings de sus miembros
    const enrichedOffers = await Promise.all(
      groupOffers.map(async (offer) => ({
        ...offer,
        members: await enrichMembersWithRatings(offer.members || []),
      }))
    );
    
    return enrichedOffers;
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
