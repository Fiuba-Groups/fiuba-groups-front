import { GroupOffer } from '../types/groupOffer';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con las búsquedas del usuario
 */

// Clave para localStorage
const SEARCHES_STORAGE_KEY = 'fiuba_user_searches';

// Funciones de utilidad para localStorage
const loadSearchesFromStorage = (): GroupOffer[] => {
  try {
    const stored = localStorage.getItem(SEARCHES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando búsquedas desde localStorage:', error);
    return [];
  }
};

// Función para limpiar localStorage (útil para testing)
export const clearSearchesStorage = (): void => {
  try {
    localStorage.removeItem(SEARCHES_STORAGE_KEY);
    console.log('Búsquedas eliminadas del localStorage');
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

const saveSearchesToStorage = (searches: GroupOffer[]): void => {
  try {
    localStorage.setItem(SEARCHES_STORAGE_KEY, JSON.stringify(searches));
  } catch (error) {
    console.error('Error guardando búsquedas en localStorage:', error);
  }
};

// Función para inicializar datos de ejemplo si no existen
const initializeMockSearches = (): GroupOffer[] => {
  const existingSearches = loadSearchesFromStorage();
  if (existingSearches.length > 0) {
    return existingSearches;
  }

  const mockSearches: GroupOffer[] = [
    {
      id: 'search-1',
      title: 'Grupo de Análisis Matemático II',
      description: 'Buscamos estudiantes para formar un grupo de estudio para Análisis Matemático II. Nos juntamos los lunes y miércoles por la tarde.',
      subject: 'Análisis Matemático II',
      cathedra: 'García',
      semester: '1C 2025',
      totalSlots: 5,
      availableSlots: 3,
      author: {
        id: 'current-user',
        name: 'Tú',
      },
      createdAt: '2024-11-20T10:00:00Z',
      updatedAt: '2024-11-20T10:00:00Z',
    },
    {
      id: 'search-2',
      title: 'Estudio de Algebra Lineal',
      description: 'Necesito compañeros para estudiar Álgebra Lineal. Prefiero juntarnos en la facultad.',
      subject: 'Algebra Lineal',
      cathedra: 'Rodríguez',
      semester: '1C 2025',
      totalSlots: 3,
      availableSlots: 2,
      author: {
        id: 'current-user',
        name: 'Tú',
      },
      createdAt: '2024-11-15T14:30:00Z',
      updatedAt: '2024-11-15T14:30:00Z',
    },
    {
      id: 'search-3',
      title: 'Grupo de Física I - Cátedra López',
      description: 'Formemos un grupo para estudiar Física I. Tengo experiencia previa en la materia.',
      subject: 'Física I',
      cathedra: 'López',
      semester: '2C 2025',
      totalSlots: 4,
      availableSlots: 1,
      author: {
        id: 'current-user',
        name: 'Tú',
      },
      createdAt: '2024-11-10T16:45:00Z',
      updatedAt: '2024-11-10T16:45:00Z',
    },
  ];

  saveSearchesToStorage(mockSearches);
  return mockSearches;
};

/**
 * Obtiene todas las búsquedas creadas por el usuario actual
 * @returns Promise con el listado de búsquedas del usuario
 */
export const fetchUserSearches = async (): Promise<GroupOffer[]> => {
  // TODO: Descomentar cuando esté disponible el endpoint en el backend
  // try {
  //   const searches: GroupOffer[] = await apiFetch('/api/searches/user');
  //   return searches;
  // } catch (error) {
  //   console.error('Error al cargar búsquedas del usuario:', error);
  //   throw error;
  // }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cargar búsquedas desde localStorage con datos de ejemplo
  return initializeMockSearches();
};

/**
 * Elimina una búsqueda creada por el usuario
 * @param searchId - ID de la búsqueda a eliminar
 * @returns Promise con el resultado de la operación
 */
export const deleteUserSearch = async (searchId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`/api/searches/${searchId}`, {
  //   method: 'DELETE',
  // });

  // Simulación de eliminar búsqueda
  const searches = loadSearchesFromStorage();
  const filteredSearches = searches.filter(search => search.id !== searchId);

  if (filteredSearches.length === searches.length) {
    throw new Error(`Búsqueda con ID ${searchId} no encontrada`);
  }

  saveSearchesToStorage(filteredSearches);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};
