import { apiFetch } from './authService';

const API_BASE_URL = 'http://localhost:8080';

/**
 * Resumen de calificación por grupo
 */
export interface GroupRatingSummary {
  groupId: number;
  groupTitle: string;
  averageRating: number;
  ratingCount: number;
}

/**
 * Resumen completo de calificaciones de un estudiante
 */
export interface StudentRatingSummary {
  studentId: number;
  studentName: string;
  studentRegister: number;
  averageRating: number;
  totalRatings: number;
  groupRatings: GroupRatingSummary[];
}

/**
 * Miembro pendiente de calificar
 */
export interface PendingRatingMember {
  id: number;
  register: number;
  name: string;
}

/**
 * Obtiene el resumen de calificaciones de un estudiante
 * @param studentId - ID del estudiante
 */
export const fetchStudentRatings = async (studentId: number): Promise<StudentRatingSummary> => {
  try {
    const response = await apiFetch<StudentRatingSummary>(
      `${API_BASE_URL}/students/${studentId}/ratings`
    );
    return response;
  } catch (error) {
    console.error('Error al obtener calificaciones del estudiante:', error);
    throw error;
  }
};

/**
 * Obtiene el resumen de calificaciones de un estudiante por su padrón (register)
 * @param register - Padrón del estudiante
 */
export const fetchStudentRatingsByRegister = async (register: number | string): Promise<StudentRatingSummary> => {
  try {
    const response = await apiFetch<StudentRatingSummary>(
      `${API_BASE_URL}/students/register/${register}/ratings`
    );
    return response;
  } catch (error) {
    console.error('Error al obtener calificaciones del estudiante por padrón:', error);
    throw error;
  }
};

/**
 * Obtiene los miembros pendientes de calificar en un grupo
 * @param groupId - ID del grupo
 */
export const fetchPendingRatings = async (groupId: string | number): Promise<PendingRatingMember[]> => {
  try {
    const response = await apiFetch<PendingRatingMember[]>(
      `${API_BASE_URL}/groups/${groupId}/ratings/pending`
    );
    return response;
  } catch (error) {
    console.error('Error al obtener miembros pendientes de calificar:', error);
    throw error;
  }
};

/**
 * Califica a un miembro del grupo
 * @param groupId - ID del grupo
 * @param toStudentId - ID del estudiante a calificar
 * @param rating - Calificación (1-5)
 */
export const rateGroupMember = async (
  groupId: string | number,
  toStudentId: number,
  rating: number
): Promise<void> => {
  try {
    await apiFetch(`${API_BASE_URL}/groups/${groupId}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ toStudentId, rating }),
    });
  } catch (error) {
    console.error('Error al calificar miembro:', error);
    throw error;
  }
};

/**
 * Termina un grupo (solo el owner puede hacerlo)
 * @param groupId - ID del grupo a terminar
 */
export const finishGroup = async (groupId: string | number): Promise<void> => {
  try {
    await apiFetch(`${API_BASE_URL}/groups/${groupId}/finish`, {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Error al terminar grupo:', error);
    throw error;
  }
};

/**
 * Componente de estrellas para mostrar calificación (helper)
 * @param rating - Calificación promedio
 * @returns String con estrellas
 */
export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '½';
  stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
  return stars;
};
