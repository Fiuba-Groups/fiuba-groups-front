import { GroupOffer } from '../types/groupOffer';
import { fetchGroupOffers } from './groupOffersService';

/**
 * Servicio para manejar las operaciones relacionadas con las búsquedas del usuario
 * Conecta con el backend usando el mismo endpoint /groups y filtra por creador
 */

// ID del usuario actual (TODO: obtener del contexto de autenticación)
const CURRENT_USER_ID = '12345';

/**
 * Obtiene todas las búsquedas (grupos) creadas por el usuario actual
 * @returns Promise con el listado de búsquedas del usuario
 */
export const fetchUserSearches = async (): Promise<GroupOffer[]> => {
  // Obtener todos los grupos del backend
  const allGroups = await fetchGroupOffers();
  
  // Filtrar solo los grupos creados por el usuario actual
  return allGroups.filter(group => group.author.id === CURRENT_USER_ID);
};

/**
 * Elimina una búsqueda creada por el usuario
 * @param searchId - ID de la búsqueda a eliminar
 * @returns Promise con el resultado de la operación
 */
export const deleteUserSearch = async (searchId: string): Promise<void> => {
  // TODO: Implementar endpoint DELETE /groups/{id} en el backend
  console.log(`Eliminando grupo ${searchId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
};

// Función para limpiar localStorage (mantener por compatibilidad)
export const clearSearchesStorage = (): void => {
  console.log('clearSearchesStorage: Ya no se usa localStorage para búsquedas');
};
