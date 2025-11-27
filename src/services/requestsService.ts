import { apiFetch } from './authService';
import { fetchCurrentUser } from './currentUserService';

/**
 * Servicio para manejar las operaciones relacionadas con solicitudes de unión a grupos
 * Conecta con el backend en /group-join-requests
 */

const API_BASE_URL = 'http://localhost:8080';

// Interfaces que representan las respuestas del backend
export interface BackendGroupJoinRequest {
  id: number;
  groupId: number;
  studentId: number;
  group?: {
    id: number;
    title: string;
    description: string;
    memberCount: number;
    maxMembers: number;
    creatorStudentRegister: number;
    courseOfferingId: number;
    courseOffering?: {
      id: number;
      quarter: string;
      year: string;
      courseEntity?: {
        commission: string;
        subject?: {
          name: string;
        };
      };
    };
  };
  student?: {
    id: number;
    register: number;
    name: string;
    lastName: string;
    career: string;
  };
  status?: string;
  createdAt?: string;
}

// Interfaz del frontend para solicitudes (mantener compatibilidad)
export interface GroupRequest {
  id: string;
  groupOfferId: string;
  groupOffer: {
    id: string;
    title: string;
    subject: string;
    cathedra: string;
    semester: string;
    author: {
      id: string;
      name: string;
    };
  };
  requesterId: string;
  requester: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
  message?: string;
}

/**
 * Convierte una solicitud del backend al formato del frontend
 */
const mapBackendToGroupRequest = (req: BackendGroupJoinRequest): GroupRequest => {
  const group = req.group;
  const courseOffering = group?.courseOffering;
  const courseEntity = courseOffering?.courseEntity;
  const subject = courseEntity?.subject;

  return {
    id: req.id.toString(),
    groupOfferId: req.groupId.toString(),
    groupOffer: {
      id: req.groupId.toString(),
      title: group?.title || 'Grupo sin título',
      subject: subject?.name || 'Materia desconocida',
      cathedra: courseEntity?.commission || 'Sin cátedra',
      semester: courseOffering ? `${courseOffering.quarter} ${courseOffering.year}` : '2C 2025',
      author: {
        id: group?.creatorStudentRegister?.toString() || '0',
        name: `Estudiante ${group?.creatorStudentRegister || 0}`,
      },
    },
    requesterId: req.studentId.toString(),
    requester: {
      id: req.studentId.toString(),
      name: req.student?.name || 'Usuario',
      surname: req.student?.lastName || '',
      email: '',
    },
    status: (req.status as 'pending' | 'accepted' | 'rejected') || 'pending',
    requestedAt: req.createdAt || new Date().toISOString(),
    message: '',
  };
};

/**
 * Obtiene todas las solicitudes del estudiante actual (solicitudes enviadas)
 */
export const fetchUserSentRequests = async (): Promise<GroupRequest[]> => {
  try {
    const currentUser = await fetchCurrentUser();
    const studentId = currentUser.student?.id;
    
    if (!studentId) {
      console.warn('Usuario no tiene estudiante asociado');
      return [];
    }

    const requests = await apiFetch<BackendGroupJoinRequest[]>(
      `${API_BASE_URL}/group-join-requests/student/${studentId}`
    );
    
    return requests.map(mapBackendToGroupRequest);
  } catch (error) {
    console.error('Error obteniendo solicitudes enviadas:', error);
    return [];
  }
};

/**
 * Obtiene las solicitudes recibidas para los grupos del usuario actual
 * @param groupId - ID del grupo para obtener sus solicitudes
 */
export const fetchGroupRequests = async (groupId: string): Promise<GroupRequest[]> => {
  try {
    const requests = await apiFetch<BackendGroupJoinRequest[]>(
      `${API_BASE_URL}/group-join-requests/group/${groupId}`
    );
    
    return requests.map(mapBackendToGroupRequest);
  } catch (error) {
    console.error(`Error obteniendo solicitudes del grupo ${groupId}:`, error);
    return [];
  }
};

/**
 * Crea una nueva solicitud para unirse a un grupo
 * @param groupId - ID del grupo al que se quiere unir
 * @param _message - Mensaje opcional (no soportado actualmente en backend)
 */
export const createGroupRequest = async (groupId: string, _message?: string): Promise<GroupRequest> => {
  const currentUser = await fetchCurrentUser();
  const studentId = currentUser.student?.id;
  
  if (!studentId) {
    throw new Error('No se encontró el estudiante asociado al usuario');
  }

  const response = await apiFetch<BackendGroupJoinRequest>(`${API_BASE_URL}/group-join-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: parseInt(groupId),
      studentId: studentId,
    }),
  });

  return mapBackendToGroupRequest(response);
};

/**
 * Acepta una solicitud de unión a grupo
 * @param requestId - ID de la solicitud a aceptar
 */
export const acceptGroupRequest = async (requestId: string): Promise<void> => {
  await apiFetch(`${API_BASE_URL}/group-join-requests/${requestId}/accept`, {
    method: 'PUT',
  });
};

/**
 * Rechaza una solicitud de unión a grupo
 * @param requestId - ID de la solicitud a rechazar
 */
export const rejectGroupRequest = async (requestId: string): Promise<void> => {
  await apiFetch(`${API_BASE_URL}/group-join-requests/${requestId}/reject`, {
    method: 'PUT',
  });
};

/**
 * Cancela una solicitud enviada por el usuario
 * @param requestId - ID de la solicitud a cancelar
 */
export const cancelGroupRequest = async (requestId: string): Promise<void> => {
  await apiFetch(`${API_BASE_URL}/group-join-requests/${requestId}`, {
    method: 'DELETE',
  });
};

/**
 * Verifica si el usuario actual ya envió solicitud a un grupo específico
 */
export const hasUserRequestedGroup = async (groupId: string): Promise<boolean> => {
  try {
    const sentRequests = await fetchUserSentRequests();
    return sentRequests.some(req => req.groupOfferId === groupId);
  } catch {
    return false;
  }
};

/**
 * Obtiene todas las solicitudes recibidas para los grupos del usuario actual
 * Busca en todos los grupos creados por el usuario y obtiene sus solicitudes
 */
export const fetchUserReceivedRequests = async (): Promise<GroupRequest[]> => {
  try {
    // Obtener los grupos del usuario actual
    const currentUser = await fetchCurrentUser();
    const studentRegister = currentUser.student?.register;
    
    if (!studentRegister) {
      console.warn('Usuario no tiene estudiante asociado');
      return [];
    }

    // Obtener todos los grupos y filtrar los del usuario
    const groupsResponse = await apiFetch<any[]>(`${API_BASE_URL}/groups`);
    const userGroups = groupsResponse.filter(g => g.creatorStudentRegister === studentRegister);
    
    // Obtener solicitudes de cada grupo del usuario
    const allRequests: GroupRequest[] = [];
    for (const group of userGroups) {
      try {
        const requests = await apiFetch<BackendGroupJoinRequest[]>(
          `${API_BASE_URL}/group-join-requests/group/${group.id}`
        );
        allRequests.push(...requests.map(mapBackendToGroupRequest));
      } catch (error) {
        console.error(`Error obteniendo solicitudes del grupo ${group.id}:`, error);
      }
    }
    
    return allRequests;
  } catch (error) {
    console.error('Error obteniendo solicitudes recibidas:', error);
    return [];
  }
};
