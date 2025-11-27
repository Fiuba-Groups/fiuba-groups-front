import { GroupRequest, RequestStatus } from '../types/requests';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con solicitudes de unión a grupos
 */

// Clave para localStorage
const REQUESTS_STORAGE_KEY = 'fiuba_user_requests';

// Funciones de utilidad para localStorage
const loadRequestsFromStorage = (): GroupRequest[] => {
  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando solicitudes desde localStorage:', error);
    return [];
  }
};

// Función para limpiar localStorage (útil para testing)
export const clearRequestsStorage = (): void => {
  try {
    localStorage.removeItem(REQUESTS_STORAGE_KEY);
    console.log('Solicitudes eliminadas del localStorage');
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

const saveRequestsToStorage = (requests: GroupRequest[]): void => {
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Error guardando solicitudes en localStorage:', error);
  }
};

// Función para inicializar datos de ejemplo si no existen
const initializeMockRequests = (): GroupRequest[] => {
  const existingRequests = loadRequestsFromStorage();
  if (existingRequests.length > 0) {
    return existingRequests;
  }

  const mockRequests: GroupRequest[] = [
    {
      id: '1',
      groupOfferId: '1',
      groupOffer: {
        id: '1',
        title: 'Grupo de Análisis Matemático II',
        subject: 'Análisis Matemático II',
        cathedra: 'García',
        semester: '1C 2025',
        author: {
          id: 'user1',
          name: 'Juan Pérez',
        },
      },
      requesterId: 'current-user',
      requester: {
        id: 'current-user',
        name: 'Tú',
        surname: '',
        email: 'user@fi.uba.ar',
      },
      status: 'pending',
      requestedAt: '2024-11-20T10:00:00Z',
      message: 'Estoy interesado en unirme al grupo para estudiar juntos.',
    },
    {
      id: '2',
      groupOfferId: '2',
      groupOffer: {
        id: '2',
        title: 'Grupo de Algebra',
        subject: 'Algebra 5',
        cathedra: 'Turri',
        semester: '1C 2026',
        author: {
          id: 'user4',
          name: 'Franco Foden',
        },
      },
      requesterId: 'current-user',
      requester: {
        id: 'current-user',
        name: 'Tú',
        surname: '',
        email: 'user@fi.uba.ar',
      },
      status: 'accepted',
      requestedAt: '2024-11-15T14:30:00Z',
      respondedAt: '2024-11-16T09:15:00Z',
      message: 'Hola, me gustaría unirme para estudiar algebra juntos.',
    },
    {
      id: '3',
      groupOfferId: '3',
      groupOffer: {
        id: '3',
        title: 'Grupo de Física I',
        subject: 'Física I',
        cathedra: 'López',
        semester: '2C 2025',
        author: {
          id: 'user2',
          name: 'María García',
        },
      },
      requesterId: 'current-user',
      requester: {
        id: 'current-user',
        name: 'Tú',
        surname: '',
        email: 'user@fi.uba.ar',
      },
      status: 'rejected',
      requestedAt: '2024-11-10T16:45:00Z',
      respondedAt: '2024-11-11T11:20:00Z',
      message: 'Busco compañeros para estudiar física.',
    },
  ];

  saveRequestsToStorage(mockRequests);
  return mockRequests;
};

/**
 * Obtiene todas las solicitudes enviadas por el usuario actual
 * @returns Promise con el listado de solicitudes enviadas
 */
export const fetchUserSentRequests = async (): Promise<GroupRequest[]> => {
  // TODO: Descomentar cuando esté disponible el endpoint en el backend
  // try {
  //   const requests: GroupRequestResponse[] = await apiFetch('/api/requests/sent');
  //   return requests.map(request => mapResponseToGroupRequest(request));
  // } catch (error) {
  //   console.error('Error al cargar solicitudes enviadas:', error);
  //   throw error;
  // }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cargar solicitudes desde localStorage con datos de ejemplo
  const allRequests = initializeMockRequests();
  return allRequests.filter(request => request.requesterId === 'current-user');
};

/**
 * Obtiene todas las solicitudes recibidas para grupos creados por el usuario
 * @returns Promise con el listado de solicitudes recibidas
 */
export const fetchUserReceivedRequests = async (): Promise<GroupRequest[]> => {
  // TODO: Descomentar cuando esté disponible el endpoint en el backend
  // try {
  //   const requests: GroupRequestResponse[] = await apiFetch('/api/requests/received');
  //   return requests.map(request => mapResponseToGroupRequest(request));
  // } catch (error) {
  //   console.error('Error al cargar solicitudes recibidas:', error);
  //   throw error;
  // }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Por ahora, devolver array vacío ya que no hay funcionalidad de solicitudes recibidas
  return [];
};

/**
 * Acepta una solicitud de unión a grupo
 * @param requestId - ID de la solicitud a aceptar
 * @returns Promise con el resultado de la operación
 */
export const acceptGroupRequest = async (requestId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`/api/requests/${requestId}/accept`, {
  //   method: 'POST',
  // });

  // Simulación de aceptar solicitud
  const requests = loadRequestsFromStorage();
  const requestIndex = requests.findIndex(r => r.id === requestId);

  if (requestIndex === -1) {
    throw new Error(`Solicitud con ID ${requestId} no encontrada`);
  }

  requests[requestIndex].status = 'accepted';
  requests[requestIndex].respondedAt = new Date().toISOString();

  saveRequestsToStorage(requests);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};

/**
 * Rechaza una solicitud de unión a grupo
 * @param requestId - ID de la solicitud a rechazar
 * @returns Promise con el resultado de la operación
 */
export const rejectGroupRequest = async (requestId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`/api/requests/${requestId}/reject`, {
  //   method: 'POST',
  // });

  // Simulación de rechazar solicitud
  const requests = loadRequestsFromStorage();
  const requestIndex = requests.findIndex(r => r.id === requestId);

  if (requestIndex === -1) {
    throw new Error(`Solicitud con ID ${requestId} no encontrada`);
  }

  requests[requestIndex].status = 'rejected';
  requests[requestIndex].respondedAt = new Date().toISOString();

  saveRequestsToStorage(requests);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};

/**
 * Cancela una solicitud enviada por el usuario
 * @param requestId - ID de la solicitud a cancelar
 * @returns Promise con el resultado de la operación
 */
export const cancelGroupRequest = async (requestId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`/api/requests/${requestId}/cancel`, {
  //   method: 'POST',
  // });

  // Simulación de cancelar solicitud
  const requests = loadRequestsFromStorage();
  const filteredRequests = requests.filter(r => r.id !== requestId);

  if (filteredRequests.length === requests.length) {
    throw new Error(`Solicitud con ID ${requestId} no encontrada`);
  }

  saveRequestsToStorage(filteredRequests);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};

/**
 * Crea una nueva solicitud para unirse a un grupo
 * @param groupOfferId - ID del grupo al que se quiere unir
 * @param message - Mensaje opcional con la solicitud
 * @returns Promise con la solicitud creada
 */
export const createGroupRequest = async (groupOfferId: string, message?: string): Promise<GroupRequest> => {
  // TODO: Descomentar cuando esté disponible el backend
  // const response = await apiFetch<GroupRequestResponse>('/api/requests', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ groupOfferId, message }),
  // });
  // return mapResponseToGroupRequest(response);

  // Simulación de crear solicitud
  const requests = loadRequestsFromStorage();

  // Obtener información del grupo (simulado)
  const GROUPS_STORAGE_KEY = 'fiuba_group_offers';
  const groups = JSON.parse(localStorage.getItem(GROUPS_STORAGE_KEY) || '[]');
  const group = groups.find((g: any) => g.id === groupOfferId);

  if (!group) {
    throw new Error(`Grupo con ID ${groupOfferId} no encontrado`);
  }

  // Crear nueva solicitud
  const newRequest: GroupRequest = {
    id: Date.now().toString(), // ID único basado en timestamp
    groupOfferId,
    groupOffer: {
      id: group.id,
      title: group.title,
      subject: group.subject,
      cathedra: group.cathedra,
      semester: group.semester,
      author: group.author,
    },
    requesterId: 'current-user',
    requester: {
      id: 'current-user',
      name: 'Tú',
      surname: '',
      email: 'user@fi.uba.ar',
    },
    status: 'pending',
    requestedAt: new Date().toISOString(),
    message: message || 'Estoy interesado en unirme al grupo.',
  };

  requests.push(newRequest);
  saveRequestsToStorage(requests);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));

  return newRequest;
};
