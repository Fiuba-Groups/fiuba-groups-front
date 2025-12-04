import { GroupOffer } from '../types/groupOffer';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con ofertas de grupos
 * Conecta con el backend en /groups
 */

const API_BASE_URL = 'http://localhost:8080';

// Interfaz para el request de crear grupo (coincide con GroupCreateRequest del backend)
interface CreateGroupRequest {
  title: string;
  description: string;
  courseOfferingId: number;
  maxMembers: number;
  creatorStudentRegister: number;
}

// Interfaz que representa la respuesta del backend (modelo Group)
interface BackendGroup {
  id: number;
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  creatorStudentRegister: number;
  courseOfferingId: number;
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
 * Convierte un grupo del backend al formato GroupOffer del frontend
 */
const mapBackendGroupToGroupOffer = (group: BackendGroup): GroupOffer => {
  // Usar datos del courseOffering si están disponibles
  const courseOffering = group.courseOffering;
  const courseEntity = courseOffering?.courseEntity;
  const subject = courseEntity?.subject;

  // Obtener nombre del creador desde creatorStudent si está disponible
  const creatorName = group.creatorStudent?.name || `Estudiante ${group.creatorStudentRegister}`;

  return {
    id: group.id.toString(),
    title: group.title,
    description: group.description,
    subject: subject?.name || `Materia ${group.courseOfferingId}`,
    cathedra: courseEntity?.commission || 'Sin cátedra',
    semester: courseOffering ? `${courseOffering.quarter} ${courseOffering.year}` : '2C 2025',
    totalSlots: group.maxMembers,
    availableSlots: group.maxMembers - group.memberCount,
    currentMembers: group.memberCount,
    author: {
      id: group.creatorStudentRegister.toString(),
      name: creatorName,
      profileUrl: `/profile/${group.creatorStudentRegister}`
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Obtiene todas las ofertas de grupos disponibles desde el backend
 * @returns Promise con el listado de ofertas
 */
export const fetchGroupOffers = async (): Promise<GroupOffer[]> => {
  const backendGroups = await apiFetch<BackendGroup[]>(`${API_BASE_URL}/groups`);
  return backendGroups.map(mapBackendGroupToGroupOffer);
};

/**
 * Crea una nueva oferta de grupo en el backend
 * @param request - Datos de la nueva oferta de grupo
 * @returns Promise con la oferta creada
 */
export const createGroupOffer = async (request: CreateGroupRequest): Promise<GroupOffer> => {
  const backendGroup = await apiFetch<BackendGroup>(`${API_BASE_URL}/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  return mapBackendGroupToGroupOffer(backendGroup);
};

/**
 * Solicita unirse a una oferta de grupo
 * @param offerId - ID de la oferta a la que se quiere unir
 * @returns Promise con el resultado de la solicitud
 */
export const requestToJoinGroup = async (offerId: string): Promise<void> => {
  // TODO: Implementar endpoint en backend para unirse a un grupo
  // Por ahora solo loguea la acción
  console.log(`Solicitud para unirse al grupo ${offerId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
};

// Funciones de limpieza de localStorage (ya no son necesarias pero se mantienen por compatibilidad)
export const clearGroupsStorage = (): void => {
  console.log('clearGroupsStorage: Ya no se usa localStorage para grupos');
};

export const clearAllMockData = (): void => {
  try {
    localStorage.removeItem('fiuba_group_offers');
    localStorage.removeItem('fiuba_user_friends');
    localStorage.removeItem('fiuba_user_searches');
    console.log('Datos mock locales eliminados');
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};
