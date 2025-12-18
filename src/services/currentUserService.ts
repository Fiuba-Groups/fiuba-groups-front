import { apiFetch } from './authService';

const API_BASE_URL = 'http://localhost:8080';

/**
 * Representa el usuario actual del sistema
 */
export interface CurrentUser {
  id: number;
  email: string;
  student?: {
    id: number;
    register: number;
    name: string; // Nombre completo del estudiante
  };
}

// Cache del usuario actual para evitar múltiples llamadas
let cachedUser: CurrentUser | null = null;

/**
 * Obtiene los datos del usuario actual desde el backend
 * Cachea el resultado para evitar llamadas repetidas
 */
export const fetchCurrentUser = async (forceRefresh = false): Promise<CurrentUser> => {
  if (cachedUser && !forceRefresh) {
    return cachedUser;
  }

  const user = await apiFetch<CurrentUser>(`${API_BASE_URL}/users/me`);
  cachedUser = user;
  return user;
};

/**
 * Obtiene el ID del estudiante del usuario actual
 * Útil para crear solicitudes de unión a grupos
 */
export const getCurrentStudentId = async (): Promise<number | null> => {
  try {
    const user = await fetchCurrentUser();
    return user.student?.id || null;
  } catch (error) {
    console.error('Error obteniendo estudiante actual:', error);
    return null;
  }
};

/**
 * Obtiene el register (padrón) del estudiante actual
 */
export const getCurrentStudentRegister = async (): Promise<number | null> => {
  try {
    const user = await fetchCurrentUser();
    return user.student?.register || null;
  } catch (error) {
    console.error('Error obteniendo padrón del estudiante:', error);
    return null;
  }
};

/**
 * Limpia la cache del usuario (útil al hacer logout)
 */
export const clearUserCache = (): void => {
  cachedUser = null;
};
