import { Friend, FriendResponse, FriendRequest, FriendshipStatus } from '../types/friends';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con amigos y solicitudes de amistad
 */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Convierte la respuesta del backend (Student) al formato Friend del frontend
 */
const mapStudentToFriend = (student: FriendResponse): Friend => ({
  id: student.id.toString(),
  register: student.register,
  name: student.name,
  avatarUrl: student.avatarUrl,
});

/**
 * Obtiene la lista de amigos del usuario actual
 */
export const fetchUserFriends = async (): Promise<Friend[]> => {
  try {
    const students: FriendResponse[] = await apiFetch(`${API_BASE_URL}/friend-requests/friends`);
    return students.map(mapStudentToFriend);
  } catch (error) {
    console.error('Error al cargar amigos:', error);
    throw error;
  }
};

/**
 * Elimina a un amigo de la lista
 * @param friendId - ID del amigo a eliminar
 */
export const removeFriend = async (friendId: string): Promise<void> => {
  await apiFetch(`${API_BASE_URL}/friend-requests/friends/${friendId}`, {
    method: 'DELETE',
  });
};

/**
 * Envía una solicitud de amistad
 * @param receiverId - ID del estudiante que recibirá la solicitud
 */
export const sendFriendRequest = async (receiverId: string): Promise<FriendRequest> => {
  const response = await apiFetch<any>(`${API_BASE_URL}/friend-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverId: parseInt(receiverId) }),
  });

  return {
    id: response.id.toString(),
    senderId: response.senderId.toString(),
    receiverId: response.receiverId.toString(),
    sender: response.sender,
    receiver: response.receiver,
    status: response.status,
    createdAt: response.createdAt,
    respondedAt: response.respondedAt,
  };
};

/**
 * Obtiene las solicitudes de amistad enviadas por el usuario actual
 */
export const fetchSentFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const requests = await apiFetch<any[]>(`${API_BASE_URL}/friend-requests/sent`);
    return requests.map(req => ({
      id: req.id.toString(),
      senderId: req.senderId.toString(),
      receiverId: req.receiverId.toString(),
      sender: req.sender,
      receiver: req.receiver,
      status: req.status,
      createdAt: req.createdAt,
      respondedAt: req.respondedAt,
    }));
  } catch (error) {
    console.error('Error al cargar solicitudes enviadas:', error);
    return [];
  }
};

/**
 * Obtiene las solicitudes de amistad recibidas por el usuario actual
 */
export const fetchReceivedFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const requests = await apiFetch<any[]>(`${API_BASE_URL}/friend-requests/received`);
    return requests.map(req => ({
      id: req.id.toString(),
      senderId: req.senderId.toString(),
      receiverId: req.receiverId.toString(),
      sender: req.sender,
      receiver: req.receiver,
      status: req.status,
      createdAt: req.createdAt,
      respondedAt: req.respondedAt,
    }));
  } catch (error) {
    console.error('Error al cargar solicitudes recibidas:', error);
    return [];
  }
};

/**
 * Acepta una solicitud de amistad
 * @param requestId - ID de la solicitud a aceptar
 */
export const acceptFriendRequest = async (requestId: string): Promise<void> => {
  await apiFetch(`${API_BASE_URL}/friend-requests/${requestId}/accept`, {
    method: 'PUT',
  });
};

/**
 * Rechaza una solicitud de amistad
 * @param requestId - ID de la solicitud a rechazar
 */
export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  await apiFetch(`${API_BASE_URL}/friend-requests/${requestId}/reject`, {
    method: 'PUT',
  });
};

/**
 * Cancela una solicitud de amistad enviada
 * @param requestId - ID de la solicitud a cancelar
 */
export const cancelFriendRequest = async (requestId: string): Promise<void> => {
  await apiFetch(`${API_BASE_URL}/friend-requests/${requestId}`, {
    method: 'DELETE',
  });
};

/**
 * Obtiene el estado de la relación de amistad con otro estudiante
 * @param otherStudentId - ID del otro estudiante
 */
export const getFriendshipStatus = async (otherStudentId: string): Promise<FriendshipStatus> => {
  try {
    const response = await apiFetch<{ status: FriendshipStatus }>(
      `${API_BASE_URL}/friend-requests/status/${otherStudentId}`
    );
    return response.status;
  } catch (error) {
    console.error('Error al obtener estado de amistad:', error);
    return 'NONE';
  }
};

// Función de compatibilidad (ya no usamos localStorage)
export const clearFriendsStorage = (): void => {
  // No-op: ya no usamos localStorage
};
