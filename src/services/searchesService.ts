import { GroupOffer } from '../types/groupOffer';
import { fetchGroupOffers } from './groupOffersService';
import { fetchCurrentUser } from './currentUserService';

/**
 * Servicio para manejar las operaciones relacionadas con las búsquedas del usuario
 * Conecta con el backend usando el mismo endpoint /groups y filtra por creador
 */

/**
 * Obtiene todas las búsquedas (grupos) creadas por el usuario actual
 * @returns Promise con el listado de búsquedas del usuario
 */
export const fetchUserSearches = async (): Promise<GroupOffer[]> => {
  // Obtener el usuario actual
  const currentUser = await fetchCurrentUser();
  const userRegister = currentUser.student?.register;
  
  if (!userRegister) {
    console.warn('Usuario no tiene estudiante asociado');
    return [];
  }

  // Obtener todos los grupos del backend
  const allGroups = await fetchGroupOffers();
  
  // Filtrar solo los grupos creados por el usuario actual
  // El author.id contiene el creatorStudentRegister
  return allGroups.filter(group => group.author.id === userRegister.toString());
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
