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
  try {
    const response = await apiFetch<{
      id: number;
      email: string;
      student?: {
        id: number;
        register: number;
        name: string;
      };
    }>(`http://localhost:8080/users/${userId}`);
    
    if (!response.student) {
      return null;
    }

    // Transformar la respuesta del backend al formato Friend
    const nameParts = response.student.name.split(' ');
    const name = nameParts[0] || '';
    const surname = nameParts.slice(1).join(' ') || '';

    return {
      id: response.id.toString(),
      register: response.student.register,
      name,
      surname,
      email: response.email,
      bio: '', // El backend no tiene bio aún
      avatarUrl: '/user.png',
      isOnline: false,
      lastSeen: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error al cargar perfil de usuario:', error);
    return null;
  }
};

/**
 * Envía una solicitud de amistad a un usuario
 * @deprecated Usar friendsService.sendFriendRequest en su lugar
 * @param userId - ID del usuario al que enviar la solicitud
 * @returns Promise con el resultado de la operación
 */
export const sendFriendRequest = async (userId: string): Promise<void> => {
  const { sendFriendRequest: sendRequest } = await import('./friendsService');
  await sendRequest(userId);
};

/**
 * Cancela una solicitud de amistad enviada
 * @deprecated Usar friendsService.cancelFriendRequest en su lugar
 * @param requestId - ID de la solicitud a cancelar
 * @returns Promise con el resultado de la operación
 */
export const cancelFriendRequest = async (requestId: string): Promise<void> => {
  const { cancelFriendRequest: cancelRequest } = await import('./friendsService');
  await cancelRequest(requestId);
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

/**
 * Actualiza el perfil del estudiante actual
 * @param name - Nombre completo del estudiante
 * @param register - Padrón del estudiante
 * @returns Promise con los datos actualizados del estudiante
 */
export const updateStudentProfile = async (name: string, register: number): Promise<{ id: number; register: number; name: string }> => {
  return apiFetch<{ id: number; register: number; name: string }>(
    'http://localhost:8080/users/me/student',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, register }),
    }
  );
};
