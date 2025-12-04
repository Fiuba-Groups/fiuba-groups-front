import { Course } from '../types/course';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con cursos/cátedras
 */

/**
 * Obtiene todas las cátedras disponibles del backend
 * @returns Promise con el listado de cátedras
 */
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    return await apiFetch<Course[]>('/courses');
  } catch (error) {
    console.error('Error al cargar cátedras:', error);
    throw error;
  }
};

/**
 * Obtiene las cátedras activas para una materia específica
 * @param subjectCode - Código de la materia
 * @returns Promise con el listado de cátedras activas para esa materia
 */
export const fetchCoursesBySubject = async (subjectCode: string): Promise<Course[]> => {
  try {
    const allCourses = await fetchCourses();
    return allCourses.filter(course => course.subjectCode === subjectCode && course.active);
  } catch (error) {
    console.error('Error al cargar cátedras para la materia:', error);
    throw error;
  }
};
