import { Friend } from '../types/friends';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con usuarios
 */

// Clave para localStorage
const USERS_STORAGE_KEY = 'fiuba_users';

// Funciones de utilidad para localStorage
const loadUsersFromStorage = (): Friend[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando usuarios desde localStorage:', error);
    return [];
  }
};

const saveUsersToStorage = (users: Friend[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error guardando usuarios en localStorage:', error);
  }
};

// Función para inicializar datos de ejemplo si no existen
const initializeMockUsers = (): Friend[] => {
  const existingUsers = loadUsersFromStorage();
  if (existingUsers.length > 0) {
    return existingUsers;
  }

  const mockUsers: Friend[] = [
    {
      id: 'user1',
      register: 12345,
      name: 'Juan',
      surname: 'Pérez',
      email: 'juan.perez@fi.uba.ar',
      bio: 'Estudiante de Ingeniería Informática. Apasionado por el desarrollo web y la inteligencia artificial.',
      avatarUrl: '/user.png',
      isOnline: true,
      lastSeen: '2024-11-25T10:30:00Z',
    },
    {
      id: 'user2',
      register: 12346,
      name: 'María',
      surname: 'García',
      email: 'maria.garcia@fi.uba.ar',
      bio: 'Estudiante de Ingeniería Electrónica. Me encanta resolver problemas matemáticos.',
      avatarUrl: '/user.png',
      isOnline: false,
      lastSeen: '2024-11-24T18:45:00Z',
    },
    {
      id: 'user3',
      register: 12347,
      name: 'Carlos',
      surname: 'Rodríguez',
      email: 'carlos.rodriguez@fi.uba.ar',
      bio: 'Futuro ingeniero en sistemas. Interesado en ciberseguridad y redes.',
      avatarUrl: '/user.png',
      isOnline: true,
      lastSeen: '2024-11-25T09:15:00Z',
    },
    {
      id: 'user4',
      register: 12348,
      name: 'Ana',
      surname: 'Martínez',
      email: 'ana.martinez@fi.uba.ar',
      bio: 'Estudiante de Ingeniería Mecánica. Me apasiona la física aplicada.',
      avatarUrl: '/user.png',
      isOnline: false,
      lastSeen: '2024-11-23T16:20:00Z',
    },
  ];

  saveUsersToStorage(mockUsers);
  return mockUsers;
};

/**
 * Obtiene la información de un usuario específico por ID
 * @param userId - ID del usuario a obtener
 * @returns Promise con la información del usuario
 */
export const fetchUserProfile = async (userId: string): Promise<Friend | null> => {
  // TODO: Descomentar cuando esté disponible el endpoint en el backend
  // try {
  //   const user: Friend = await apiFetch(`/api/users/${userId}`);
  //   return user;
  // } catch (error) {
  //   console.error('Error al cargar perfil de usuario:', error);
  //   return null;
  // }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));

  // Buscar usuario en datos mock
  const users = initializeMockUsers();
  return users.find(user => user.id === userId) || null;
};

/**
 * Envía una solicitud de amistad a un usuario
 * @param userId - ID del usuario al que enviar la solicitud
 * @returns Promise con el resultado de la operación
 */
export const sendFriendRequest = async (userId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`/api/friends/request/${userId}`, {
  //   method: 'POST',
  // });

  // Simulación de enviar solicitud de amistad
  console.log(`Solicitud de amistad enviada a usuario ${userId}`);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));
};

/**
 * Cancela una solicitud de amistad enviada
 * @param userId - ID del usuario cuya solicitud cancelar
 * @returns Promise con el resultado de la operación
 */
export const cancelFriendRequest = async (userId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`/api/friends/request/${userId}`, {
  //   method: 'DELETE',
  // });

  // Simulación de cancelar solicitud de amistad
  console.log(`Solicitud de amistad cancelada para usuario ${userId}`);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};

/**
 * Verifica si un usuario es amigo del usuario actual
 * @param userId - ID del usuario a verificar
 * @param friends - Lista de amigos del usuario actual
 * @returns boolean indicando si es amigo
 */
export const isUserFriend = (userId: string, friends: Friend[]): boolean => {
  return friends.some(friend => friend.id === userId);
};

/**
 * Sube una nueva imagen de avatar para el usuario
 * @param file - Archivo de imagen a subir
 * @returns Promise con la URL de la imagen subida
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiFetch<{ avatarUrl: string }>('http://localhost:8080/users/me/avatar', {
    method: 'POST',
    body: formData,
  });

  return response.avatarUrl;
};

/**
 * Obtiene el email de un compañero de grupo
 * Solo funciona si el usuario actual comparte un grupo con el estudiante solicitado
 * @param studentId - ID del estudiante
 * @returns Promise con el email del estudiante
 */
export const getTeammateEmail = async (studentId: string): Promise<string> => {
  const response = await apiFetch<{ email: string }>(
    `http://localhost:8080/users/students/${studentId}/email`
  );
  return response.email;
};
