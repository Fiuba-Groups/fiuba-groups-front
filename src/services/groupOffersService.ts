import { GroupOffer } from '../types/groupOffer';

/**
 * Servicio para manejar las operaciones relacionadas con ofertas de grupos
 */

// Función para migrar datos existentes agregando currentMembers
const migrateGroupsData = () => {
  const groups = loadGroupsFromStorage();
  let needsMigration = false;

  const migratedGroups = groups.map(group => {
    if (!group.hasOwnProperty('currentMembers')) {
      needsMigration = true;
      // Calcular miembros actuales basados en slots ocupados
      const occupiedSlots = group.totalSlots - (group.availableSlots || group.totalSlots);
      return {
        ...group,
        currentMembers: Math.max(1, occupiedSlots + 1) // Al menos 1 (creador) + miembros que se unieron
      };
    }
    return group;
  });

  if (needsMigration) {
    saveGroupsToStorage(migratedGroups);
  }

  return migratedGroups;
};

// Interfaz para el request de crear grupo
interface CreateGroupRequest {
  title: string;
  description: string;
  courseOfferingId: number;
  maxMembers: number;
  creatorStudentRegister: number;
}


// Mapeo de courseOfferingId a datos de materia (vacío)
const courseOfferingMap: Record<number, { subject: string; cathedra: string; semester: string }> = {};

// Clave para localStorage
const GROUPS_STORAGE_KEY = 'fiuba_group_offers';

// Funciones de utilidad para localStorage
const loadGroupsFromStorage = (): GroupOffer[] => {
  try {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error cargando grupos desde localStorage:', error);
    return [];
  }
};

// Función para limpiar localStorage (útil para testing)
export const clearGroupsStorage = (): void => {
  try {
    localStorage.removeItem(GROUPS_STORAGE_KEY);
    console.log('Grupos eliminados del localStorage');
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

// Función para limpiar TODOS los datos mock (grupos y amigos)
export const clearAllMockData = (): void => {
  try {
    localStorage.removeItem(GROUPS_STORAGE_KEY);
    localStorage.removeItem('fiuba_user_friends');
    localStorage.removeItem('token');
    console.log('Todos los datos mock han sido eliminados del localStorage');
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
};

const saveGroupsToStorage = (groups: GroupOffer[]): void => {
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error('Error guardando grupos en localStorage:', error);
  }
};

// Función para resetear datos a valores iniciales (útil para testing)
/*
export const resetGroupsToInitial = (): void => {
  saveGroupsToStorage(mockGroupOffers);
};
*/



/**
 * Obtiene todas las ofertas de grupos disponibles
 * @returns Promise con el listado de ofertas
 */
export const fetchGroupOffers = async (): Promise<GroupOffer[]> => {
  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cargar grupos desde localStorage con migración
  return migrateGroupsData();
};

/**
 * Crea una nueva oferta de grupo
 * @param request - Datos de la nueva oferta de grupo
 * @returns Promise con la oferta creada
 */
export const createGroupOffer = async (request: CreateGroupRequest): Promise<GroupOffer> => {
  // Simulación de creación de grupo
  const courseData = courseOfferingMap[request.courseOfferingId];
  if (!courseData) {
    throw new Error(`Course offering ID ${request.courseOfferingId} no encontrado`);
  }

  // Generar ID único (máximo ID actual + 1)
  const allGroups = loadGroupsFromStorage();
  const maxId = allGroups.length > 0 ? Math.max(...allGroups.map((g: GroupOffer) => parseInt(g.id))) : 0;
  const newId = (maxId + 1).toString();

  // Crear el nuevo grupo
  const newGroup: GroupOffer = {
    id: newId,
    title: request.title,
    description: request.description,
    subject: courseData.subject,
    cathedra: courseData.cathedra,
    semester: courseData.semester,
    totalSlots: request.maxMembers,
    availableSlots: request.maxMembers, // Inicialmente todos los slots disponibles
    currentMembers: 1, // El creador cuenta como primer miembro
    author: {
      id: request.creatorStudentRegister.toString(),
      name: `Estudiante ${request.creatorStudentRegister}`, // Nombre mock
      profileUrl: `/profile/${request.creatorStudentRegister}`
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Cargar grupos actuales, agregar el nuevo y guardar
  const currentGroups = loadGroupsFromStorage();
  currentGroups.push(newGroup);
  saveGroupsToStorage(currentGroups);

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));

  return newGroup;
};

/**
 * Solicita unirse a una oferta de grupo
 * @param offerId - ID de la oferta a la que se quiere unir
 * @returns Promise con el resultado de la solicitud
 */
export const requestToJoinGroup = async (offerId: string): Promise<void> => {
  // Simulación de unirse a un grupo
  const allGroups = loadGroupsFromStorage();
  const group = allGroups.find(g => g.id === offerId);

  if (!group) {
    throw new Error(`Grupo con ID ${offerId} no encontrado`);
  }

  if (group.availableSlots <= 0) {
    throw new Error('No hay slots disponibles en este grupo');
  }

  // Reducir slots disponibles e incrementar miembros actuales
  group.availableSlots -= 1;
  group.currentMembers += 1;
  group.updatedAt = new Date().toISOString();

  // Actualizar localStorage
  const groupIndex = allGroups.findIndex(g => g.id === offerId);
  if (groupIndex !== -1) {
    allGroups[groupIndex] = group;
    saveGroupsToStorage(allGroups);
  }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 300));
};
