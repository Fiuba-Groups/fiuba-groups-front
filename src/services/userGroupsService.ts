import { GroupOffer } from '../types/groupOffer';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con los grupos del usuario
 */

// Clave para localStorage
const USER_GROUPS_STORAGE_KEY = 'fiuba_user_groups';

// Funciones de utilidad para localStorage
const loadUserGroupsFromStorage = (): GroupOffer[] => {
  try {
    const stored = localStorage.getItem(USER_GROUPS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando grupos del usuario desde localStorage:', error);
    return [];
  }
};

// Función para limpiar localStorage (útil para testing)
export const clearUserGroupsStorage = (): void => {
  try {
    localStorage.removeItem(USER_GROUPS_STORAGE_KEY);
    console.log('Grupos del usuario eliminados del localStorage');
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

const saveUserGroupsToStorage = (groups: GroupOffer[]): void => {
  try {
    localStorage.setItem(USER_GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error('Error guardando grupos del usuario en localStorage:', error);
  }
};

// Función para inicializar datos de ejemplo si no existen
const initializeMockUserGroups = (): GroupOffer[] => {
  const existingGroups = loadUserGroupsFromStorage();
  if (existingGroups.length > 0) {
    return existingGroups;
  }

  const mockGroups: GroupOffer[] = [
    {
      id: 'group-1',
      title: 'Grupo de Análisis Matemático II',
      description: 'Buscamos estudiantes para formar un grupo de estudio para Análisis Matemático II. Nos juntamos los lunes y miércoles por la tarde.',
      subject: 'Análisis Matemático II',
      cathedra: 'García',
      semester: '1C 2025',
      totalSlots: 5,
      availableSlots: 2,
      currentMembers: 4, // 5 - 2 + 1 = 4 miembros (incluyendo creador)
      author: {
        id: 'current-user',
        name: 'Tú',
      },
      createdAt: '2024-11-20T10:00:00Z',
      updatedAt: '2024-11-25T14:30:00Z',
    },
    {
      id: 'group-2',
      title: 'Estudio de Algebra Lineal',
      description: 'Necesito compañeros para estudiar Álgebra Lineal. Prefiero juntarnos en la facultad.',
      subject: 'Algebra Lineal',
      cathedra: 'Rodríguez',
      semester: '1C 2025',
      totalSlots: 4,
      availableSlots: 1,
      currentMembers: 4, // 4 - 1 + 1 = 4 miembros (incluyendo creador)
      author: {
        id: 'current-user',
        name: 'Tú',
      },
      createdAt: '2024-11-15T14:30:00Z',
      updatedAt: '2024-11-24T16:45:00Z',
    },
    {
      id: 'group-3',
      title: 'Grupo de Física I - Cátedra López',
      description: 'Formemos un grupo para estudiar Física I. Tengo experiencia previa en la materia.',
      subject: 'Física I',
      cathedra: 'López',
      semester: '2C 2025',
      totalSlots: 6,
      availableSlots: 3,
      currentMembers: 4, // 6 - 3 + 1 = 4 miembros (incluyendo creador)
      author: {
        id: 'current-user',
        name: 'Tú',
      },
      createdAt: '2024-11-10T16:45:00Z',
      updatedAt: '2024-11-23T11:20:00Z',
    },
  ];

  saveUserGroupsToStorage(mockGroups);
  return mockGroups;
};

/**
 * Obtiene todos los grupos a los que pertenece el usuario actual
 * @returns Promise con el listado de grupos del usuario
 */
export const fetchUserGroups = async (): Promise<GroupOffer[]> => {
  // TODO: Descomentar cuando esté disponible el endpoint en el backend
  // try {
  //   const groups: GroupOffer[] = await apiFetch('/api/groups/user');
  //   return groups;
  // } catch (error) {
  //   console.error('Error al cargar grupos del usuario:', error);
  //   throw error;
  // }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cargar grupos desde localStorage con datos de ejemplo
  return initializeMockUserGroups();
};

/**
 * Permite al usuario salir de un grupo
 * @param groupId - ID del grupo del que salir
 * @returns Promise con el resultado de la operación
 */
export const leaveUserGroup = async (groupId: string): Promise<void> => {
  // TODO: Descomentar cuando esté disponible el backend
  // await apiFetch(`/api/groups/${groupId}/leave`, {
  //   method: 'POST',
  // });

  // Simulación de salir de un grupo
  const groups = loadUserGroupsFromStorage();
  const filteredGroups = groups.filter(group => group.id !== groupId);

  if (filteredGroups.length === groups.length) {
    throw new Error(`Grupo con ID ${groupId} no encontrado`);
  }

  saveUserGroupsToStorage(filteredGroups);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};
