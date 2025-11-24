import { Friend, FriendResponse } from '../types/friends';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con amigos
 */

// Clave para localStorage
const FRIENDS_STORAGE_KEY = 'fiuba_user_friends';

// Funciones de utilidad para localStorage
const loadFriendsFromStorage = (): Friend[] => {
  try {
    const stored = localStorage.getItem(FRIENDS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando amigos desde localStorage:', error);
    return [];
  }
};

// Función para limpiar localStorage (útil para testing)
export const clearFriendsStorage = (): void => {
  try {
    localStorage.removeItem(FRIENDS_STORAGE_KEY);
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

const saveFriendsToStorage = (friends: Friend[]): void => {
  try {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
  } catch (error) {
    console.error('Error guardando amigos en localStorage:', error);
  }
};


/**
 * Obtiene la lista de amigos del usuario actual
 * @returns Promise con el listado de amigos
 */
export const fetchUserFriends = async (): Promise<Friend[]> => {
  // TODO: Descomentar cuando esté disponible el endpoint /api/friends en el backend
  // try {
  //   const friends: FriendResponse[] = await apiFetch('/api/friends');
  //
  //   // Mapear la respuesta del backend al formato esperado por el frontend
  //   return friends.map(friend => ({
  //     id: friend.id.toString(),
  //     register: friend.register,
  //     name: friend.name,
  //     surname: friend.surname,
  //     email: friend.email,
  //     avatarUrl: friend.avatarUrl,
  //     isOnline: friend.isOnline,
  //     lastSeen: friend.lastSeen,
  //     bio: friend.bio,
  //   }));
  // } catch (error) {
  //   console.error('Error al cargar amigos:', error);
  //   throw error;
  // }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cargar amigos desde localStorage
  return loadFriendsFromStorage();
};

/**
 * Obtiene los detalles de un amigo específico
 * @param friendId - ID del amigo
 * @returns Promise con los detalles del amigo
 */
export const fetchFriendDetails = async (friendId: string): Promise<Friend> => {
  // TODO: Descomentar cuando esté disponible el backend
  // const friend: FriendResponse = await apiFetch(`http://localhost:8080/friends/${friendId}`);
  // return {
  //   id: friend.id.toString(),
  //   register: friend.register,
  //   name: friend.name,
  //   surname: friend.surname,
  //   email: friend.email,
  //   avatarUrl: friend.avatarUrl,
  //   isOnline: friend.isOnline,
  //   lastSeen: friend.lastSeen,
  //   bio: friend.bio,
  // };

  // Simulación de obtener detalles de amigo
  const friends = loadFriendsFromStorage();
  const friend = friends.find(f => f.id === friendId);

  if (!friend) {
    throw new Error(`Amigo con ID ${friendId} no encontrado`);
  }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));

  return friend;
};

/**
 * Elimina a un amigo de la lista
 * @param friendId - ID del amigo a eliminar
 * @returns Promise con el resultado de la operación
 */
export const removeFriend = async (friendId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`http://localhost:8080/friends/${friendId}`, {
  //   method: 'DELETE',
  // });

  // Simulación de eliminar amigo
  const friends = loadFriendsFromStorage();
  const filteredFriends = friends.filter(f => f.id !== friendId);

  if (filteredFriends.length === friends.length) {
    throw new Error(`Amigo con ID ${friendId} no encontrado`);
  }

  saveFriendsToStorage(filteredFriends);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};
