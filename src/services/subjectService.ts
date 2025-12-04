import { Subject } from '../types/subject';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con materias
 */

/**
 * Obtiene todas las materias disponibles del backend
 * @returns Promise con el listado de materias
 */
export const fetchSubjects = async (): Promise<Subject[]> => {
  try {
    return await apiFetch<Subject[]>('/subjects');
  } catch (error) {
    console.error('Error al cargar materias:', error);
    throw error;
  }
};
