import { GroupOffer } from '../types/groupOffer';
import { apiFetch } from './authService';

/**
 * Servicio para manejar las operaciones relacionadas con ofertas de grupos
 */

// Interfaz para el request de crear grupo
interface CreateGroupRequest {
  title: string;
  description: string;
  courseOfferingId: number;
  maxMembers: number;
  creatorStudentRegister: number;
}

// Interfaz para la respuesta del backend
interface GroupResponse {
  id: number;
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  creatorStudentRegister: number;
  courseOfferingId: number;
  courseOffering: {
    id: number;
    quarter: string;
    year: string;
    courseId: number;
    courseEntity: {
      id: number;
      commission: string;
      active: boolean;
      subjectCode: string;
      subject: {
        code: string;
        name: string;
        department: string;
      };
    };
    groups: string[];
  };
  members: {
    id: number;
    register: number;
    name: string;
    groups: string[];
  }[];
}

// Mapeo de courseOfferingId a datos de materia
const courseOfferingMap: Record<number, { subject: string; cathedra: string; semester: string }> = {
  1: { subject: 'Análisis Matemático II', cathedra: 'García', semester: '1C 2025' },
  2: { subject: 'Álgebra Lineal', cathedra: 'Rodríguez', semester: '1C 2025' },
  3: { subject: 'Física I', cathedra: 'López', semester: '1C 2025' },
  4: { subject: 'Química Orgánica', cathedra: 'Fernández', semester: '2C 2024' },
  5: { subject: 'Programación I', cathedra: 'Silva', semester: '1C 2025' },
  6: { subject: 'Estadística y Probabilidades', cathedra: 'Mendoza', semester: '2C 2024' },
  7: { subject: 'Cálculo Numérico', cathedra: 'Ramírez', semester: '1C 2025' },
  8: { subject: 'Economía Política', cathedra: 'Gutiérrez', semester: '2C 2024' },
  // Más mappings para otras cátedras
  9: { subject: 'Análisis Matemático II', cathedra: 'Pérez', semester: '2C 2024' },
  10: { subject: 'Álgebra Lineal', cathedra: 'Gómez', semester: '2C 2024' },
  11: { subject: 'Física I', cathedra: 'Martínez', semester: '2C 2024' },
  12: { subject: 'Química Orgánica', cathedra: 'Silva', semester: '1C 2025' },
  13: { subject: 'Programación I', cathedra: 'López', semester: '2C 2024' },
  14: { subject: 'Estadística y Probabilidades', cathedra: 'Vega', semester: '1C 2025' },
  15: { subject: 'Economía Política', cathedra: 'Moreno', semester: '1C 2025' },
};

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

const saveGroupsToStorage = (groups: GroupOffer[]): void => {
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error('Error guardando grupos en localStorage:', error);
  }
};

// Función para resetear datos a valores iniciales (útil para testing)
export const resetGroupsToInitial = (): void => {
  saveGroupsToStorage(mockGroupOffers);
};

// Datos mock hardcodeados para desarrollo
const mockGroupOffers: GroupOffer[] = [
  // Análisis Matemático II - Más ofertas
  {
    id: '1',
    title: 'Grupo de estudio Análisis Matemático II',
    description: 'Buscamos estudiantes para formar un grupo de estudio intensivo de Análisis Matemático II. Nos reunimos los martes y jueves por la tarde para resolver problemas y preparar parciales.',
    subject: 'Análisis Matemático II',
    cathedra: 'García',
    semester: '1C 2025',
    totalSlots: 5,
    availableSlots: 2,
    author: {
      id: '12345',
      name: 'María González',
      profileUrl: '/profile/12345'
    },
    createdAt: '2024-11-15T10:30:00Z',
    updatedAt: '2024-11-15T10:30:00Z'
  },
  {
    id: '9',
    title: 'Análisis II - Grupo de resolución de problemas',
    description: 'Enfocados en resolver problemas complejos de límites, derivadas y integrales. Grupo avanzado para estudiantes que quieren profundizar.',
    subject: 'Análisis Matemático II',
    cathedra: 'García',
    semester: '1C 2025',
    totalSlots: 4,
    availableSlots: 1,
    author: {
      id: '77777',
      name: 'Javier Moreno',
      profileUrl: '/profile/77777'
    },
    createdAt: '2024-11-07T12:20:00Z',
    updatedAt: '2024-11-07T12:20:00Z'
  },
  {
    id: '10',
    title: 'Análisis Matemático II - Cátedra Pérez',
    description: 'Grupo para la cátedra del profesor Pérez. Repasamos teoría y practicamos con ejercicios de parciales anteriores.',
    subject: 'Análisis Matemático II',
    cathedra: 'Pérez',
    semester: '2C 2024',
    totalSlots: 6,
    availableSlots: 3,
    author: {
      id: '88888',
      name: 'Sofia Alvarez',
      profileUrl: '/profile/88888'
    },
    createdAt: '2024-11-06T14:45:00Z',
    updatedAt: '2024-11-06T14:45:00Z'
  },

  // Álgebra Lineal - Más ofertas
  {
    id: '2',
    title: 'Estudio conjunto Álgebra Lineal',
    description: 'Grupo pequeño para estudiar Álgebra Lineal. Somos 3 estudiantes que llevamos el mismo ritmo y queremos reforzar conceptos antes del primer parcial.',
    subject: 'Álgebra Lineal',
    cathedra: 'Rodríguez',
    semester: '1C 2025',
    totalSlots: 4,
    availableSlots: 1,
    author: {
      id: '67890',
      name: 'Carlos López',
      profileUrl: '/profile/67890'
    },
    createdAt: '2024-11-14T15:45:00Z',
    updatedAt: '2024-11-14T15:45:00Z'
  },
  {
    id: '11',
    title: 'Álgebra Lineal - Matrices y determinantes',
    description: 'Grupo enfocado en matrices, determinantes y espacios vectoriales. Perfecto para quienes quieren dominar los fundamentos.',
    subject: 'Álgebra Lineal',
    cathedra: 'Rodríguez',
    semester: '1C 2025',
    totalSlots: 5,
    availableSlots: 2,
    author: {
      id: '99999',
      name: 'Elena Castro',
      profileUrl: '/profile/99999'
    },
    createdAt: '2024-11-05T09:30:00Z',
    updatedAt: '2024-11-05T09:30:00Z'
  },
  {
    id: '12',
    title: 'Álgebra Lineal - Cátedra Gómez',
    description: 'Estudiamos Álgebra Lineal con la cátedra del profesor Gómez. Enfoque teórico-práctico con aplicaciones en física e ingeniería.',
    subject: 'Álgebra Lineal',
    cathedra: 'Gómez',
    semester: '2C 2024',
    totalSlots: 4,
    availableSlots: 0,
    author: {
      id: '10101',
      name: 'Fernando Vega',
      profileUrl: '/profile/10101'
    },
    createdAt: '2024-11-04T16:15:00Z',
    updatedAt: '2024-11-04T16:15:00Z'
  },

  // Física I - Más ofertas
  {
    id: '3',
    title: 'Preparación Física I - Cátedra López',
    description: '¡Hola! Estoy armando un grupo para Física I. La cátedra de López es bastante teórica, así que queremos hacer ejercicios prácticos juntos.',
    subject: 'Física I',
    cathedra: 'López',
    semester: '1C 2025',
    totalSlots: 6,
    availableSlots: 4,
    author: {
      id: '11111',
      name: 'Ana Martínez',
      profileUrl: '/profile/11111'
    },
    createdAt: '2024-11-13T09:20:00Z',
    updatedAt: '2024-11-13T09:20:00Z'
  },
  {
    id: '13',
    title: 'Física I - Mecánica y cinemática',
    description: 'Grupo dedicado al estudio de mecánica clásica, cinemática y dinámica. Resolvemos problemas de movimiento y fuerzas.',
    subject: 'Física I',
    cathedra: 'López',
    semester: '1C 2025',
    totalSlots: 5,
    availableSlots: 1,
    author: {
      id: '12121',
      name: 'Gabriel Rojas',
      profileUrl: '/profile/12121'
    },
    createdAt: '2024-11-03T11:00:00Z',
    updatedAt: '2024-11-03T11:00:00Z'
  },
  {
    id: '14',
    title: 'Física I - Cátedra Martínez',
    description: 'Estudiamos Física I con la cátedra Martínez. Enfoque en conceptos fundamentales y resolución de problemas.',
    subject: 'Física I',
    cathedra: 'Martínez',
    semester: '2C 2024',
    totalSlots: 4,
    availableSlots: 2,
    author: {
      id: '13131',
      name: 'Carmen Ortega',
      profileUrl: '/profile/13131'
    },
    createdAt: '2024-11-02T13:30:00Z',
    updatedAt: '2024-11-02T13:30:00Z'
  },

  // Química Orgánica - Más ofertas
  {
    id: '4',
    title: 'Grupo Química Orgánica Avanzada',
    description: 'Buscamos estudiantes avanzados de Química Orgánica. Nos enfocamos en mecanismos de reacción y síntesis orgánica. Reuniones semanales.',
    subject: 'Química Orgánica',
    cathedra: 'Fernández',
    semester: '2C 2024',
    totalSlots: 4,
    availableSlots: 0,
    author: {
      id: '22222',
      name: 'Diego Sánchez',
      profileUrl: '/profile/22222'
    },
    createdAt: '2024-11-12T14:10:00Z',
    updatedAt: '2024-11-12T14:10:00Z'
  },
  {
    id: '15',
    title: 'Química Orgánica - Reacciones y mecanismos',
    description: 'Grupo para estudiar mecanismos de reacción orgánica, isomería y síntesis. Ideal para estudiantes que quieren entender la química orgánica a fondo.',
    subject: 'Química Orgánica',
    cathedra: 'Fernández',
    semester: '2C 2024',
    totalSlots: 5,
    availableSlots: 3,
    author: {
      id: '14141',
      name: 'Valentina Peña',
      profileUrl: '/profile/14141'
    },
    createdAt: '2024-11-01T10:45:00Z',
    updatedAt: '2024-11-01T10:45:00Z'
  },
  {
    id: '16',
    title: 'Química Orgánica - Cátedra Silva',
    description: 'Estudiamos Química Orgánica con enfoque en química medicinal y farmacéutica. Grupo para estudiantes interesados en aplicaciones biológicas.',
    subject: 'Química Orgánica',
    cathedra: 'Silva',
    semester: '1C 2025',
    totalSlots: 4,
    availableSlots: 1,
    author: {
      id: '15151',
      name: 'Andrés Morales',
      profileUrl: '/profile/15151'
    },
    createdAt: '2024-10-31T15:20:00Z',
    updatedAt: '2024-10-31T15:20:00Z'
  },

  // Programación I - Más ofertas
  {
    id: '5',
    title: 'Programación I - Java básico',
    description: 'Grupo para principiantes en Programación I. Aprendemos Java desde cero, resolvemos ejercicios y preparamos trabajos prácticos.',
    subject: 'Programación I',
    cathedra: 'Silva',
    semester: '1C 2025',
    totalSlots: 5,
    availableSlots: 3,
    author: {
      id: '33333',
      name: 'Laura Torres',
      profileUrl: '/profile/33333'
    },
    createdAt: '2024-11-11T16:30:00Z',
    updatedAt: '2024-11-11T16:30:00Z'
  },
  {
    id: '17',
    title: 'Programación I - Estructuras de datos',
    description: 'Grupo avanzado de Programación I enfocado en arreglos, listas y algoritmos básicos. Para estudiantes que ya dominan lo fundamental.',
    subject: 'Programación I',
    cathedra: 'Silva',
    semester: '1C 2025',
    totalSlots: 4,
    availableSlots: 0,
    author: {
      id: '16161',
      name: 'Martín Acosta',
      profileUrl: '/profile/16161'
    },
    createdAt: '2024-10-30T12:10:00Z',
    updatedAt: '2024-10-30T12:10:00Z'
  },
  {
    id: '18',
    title: 'Programación I - Cátedra López',
    description: 'Aprendemos Programación I con la cátedra López. Enfoque en lógica de programación y resolución de problemas algorítmicos.',
    subject: 'Programación I',
    cathedra: 'López',
    semester: '2C 2024',
    totalSlots: 6,
    availableSlots: 4,
    author: {
      id: '17171',
      name: 'Lucía Medina',
      profileUrl: '/profile/17171'
    },
    createdAt: '2024-10-29T14:55:00Z',
    updatedAt: '2024-10-29T14:55:00Z'
  },

  // Estadística y Probabilidades - Más ofertas
  {
    id: '6',
    title: 'Estadística y Probabilidades',
    description: 'Formamos grupo para Estadística. Necesitamos ayuda con distribuciones de probabilidad y análisis de datos. Bienvenidos estudiantes de cualquier nivel.',
    subject: 'Estadística y Probabilidades',
    cathedra: 'Mendoza',
    semester: '2C 2024',
    totalSlots: 4,
    availableSlots: 2,
    author: {
      id: '44444',
      name: 'Roberto Díaz',
      profileUrl: '/profile/44444'
    },
    createdAt: '2024-11-10T11:15:00Z',
    updatedAt: '2024-11-10T11:15:00Z'
  },
  {
    id: '19',
    title: 'Estadística - Distribuciones y pruebas',
    description: 'Grupo especializado en distribuciones de probabilidad, pruebas estadísticas y análisis de varianza. Para estudiantes avanzados.',
    subject: 'Estadística y Probabilidades',
    cathedra: 'Mendoza',
    semester: '2C 2024',
    totalSlots: 3,
    availableSlots: 1,
    author: {
      id: '18181',
      name: 'Pablo Giménez',
      profileUrl: '/profile/18181'
    },
    createdAt: '2024-10-28T09:40:00Z',
    updatedAt: '2024-10-28T09:40:00Z'
  },
  {
    id: '20',
    title: 'Estadística y Probabilidades - Cátedra Vega',
    description: 'Estudiamos Estadística con aplicaciones en ciencias sociales. Enfoque en análisis de datos reales y estadística descriptiva.',
    subject: 'Estadística y Probabilidades',
    cathedra: 'Vega',
    semester: '1C 2025',
    totalSlots: 5,
    availableSlots: 3,
    author: {
      id: '19191',
      name: 'Isabella Flores',
      profileUrl: '/profile/19191'
    },
    createdAt: '2024-10-27T16:25:00Z',
    updatedAt: '2024-10-27T16:25:00Z'
  },

  // Cálculo Numérico - Más ofertas
  {
    id: '7',
    title: 'Cálculo Numérico - Métodos iterativos',
    description: 'Grupo especializado en métodos numéricos y algoritmos de cálculo. Perfecto para estudiantes que quieren profundizar en la parte computacional.',
    subject: 'Cálculo Numérico',
    cathedra: 'Ramírez',
    semester: '1C 2025',
    totalSlots: 3,
    availableSlots: 1,
    author: {
      id: '55555',
      name: 'Patricia Ruiz',
      profileUrl: '/profile/55555'
    },
    createdAt: '2024-11-09T13:45:00Z',
    updatedAt: '2024-11-09T13:45:00Z'
  },
  {
    id: '21',
    title: 'Cálculo Numérico - Interpolación y aproximación',
    description: 'Enfocados en métodos de interpolación, aproximación de funciones y resolución de ecuaciones no lineales.',
    subject: 'Cálculo Numérico',
    cathedra: 'Ramírez',
    semester: '1C 2025',
    totalSlots: 4,
    availableSlots: 2,
    author: {
      id: '20202',
      name: 'Raúl Navarro',
      profileUrl: '/profile/20202'
    },
    createdAt: '2024-10-26T11:50:00Z',
    updatedAt: '2024-10-26T11:50:00Z'
  },

  // Economía Política - Más ofertas
  {
    id: '8',
    title: 'Economía Política - Teoría keynesiana',
    description: 'Estudiamos Economía Política con enfoque en teoría keynesiana y política económica. Discutimos artículos y casos prácticos.',
    subject: 'Economía Política',
    cathedra: 'Gutiérrez',
    semester: '2C 2024',
    totalSlots: 5,
    availableSlots: 3,
    author: {
      id: '66666',
      name: 'Miguel Herrera',
      profileUrl: '/profile/66666'
    },
    createdAt: '2024-11-08T10:00:00Z',
    updatedAt: '2024-11-08T10:00:00Z'
  },
  {
    id: '22',
    title: 'Economía Política - Macroeconomía',
    description: 'Grupo para estudiar macroeconomía, política fiscal y monetaria. Analizamos indicadores económicos y políticas públicas.',
    subject: 'Economía Política',
    cathedra: 'Gutiérrez',
    semester: '2C 2024',
    totalSlots: 4,
    availableSlots: 1,
    author: {
      id: '21212',
      name: 'Natalia Campos',
      profileUrl: '/profile/21212'
    },
    createdAt: '2024-10-25T14:15:00Z',
    updatedAt: '2024-10-25T14:15:00Z'
  },
  {
    id: '23',
    title: 'Economía Política - Cátedra Moreno',
    description: 'Estudiamos Economía Política con perspectiva crítica. Discutimos teoría económica clásica y contemporánea.',
    subject: 'Economía Política',
    cathedra: 'Moreno',
    semester: '1C 2025',
    totalSlots: 5,
    availableSlots: 2,
    author: {
      id: '23232',
      name: 'Sebastián Luna',
      profileUrl: '/profile/23232'
    },
    createdAt: '2024-10-24T13:05:00Z',
    updatedAt: '2024-10-24T13:05:00Z'
  }
];

/**
 * Obtiene todas las ofertas de grupos disponibles
 * @returns Promise con el listado de ofertas
 */
export const fetchGroupOffers = async (): Promise<GroupOffer[]> => {
  // TODO: Descomentar cuando esté disponible el backend
  // try {
  //   const groups: GroupResponse[] = await apiFetch('http://localhost:8080/groups');
  //
  //   // Mapear la respuesta del backend al formato esperado por el frontend
  //   return groups.map(group => ({
  //     id: group.id.toString(),
  //     title: group.title,
  //     description: group.description,
  //     subject: group.courseOffering.courseEntity.subject.name,
  //     cathedra: group.courseOffering.courseEntity.commission,
  //     semester: `${group.courseOffering.quarter} ${group.courseOffering.year}`,
  //     totalSlots: group.maxMembers,
  //     availableSlots: group.maxMembers - group.memberCount,
  //     author: {
  //       id: `${group.creatorStudentRegister}`,
  //       name: group.members.find(member => member.register === group.creatorStudentRegister)?.name || `Estudiante ${group.creatorStudentRegister}`,
  //       profileUrl: `/profile/${group.creatorStudentRegister}`
  //     },
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString()
  //   }));
  // } catch (error) {
  //   console.error('Error al cargar grupos:', error);
  //   throw error;
  // }

  // Simular delay de red para testing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cargar grupos desde localStorage
  return loadGroupsFromStorage();
};

/**
 * Crea una nueva oferta de grupo
 * @param request - Datos de la nueva oferta de grupo
 * @returns Promise con la oferta creada
 */
export const createGroupOffer = async (request: CreateGroupRequest): Promise<GroupOffer> => {
  // TODO: Descomentar cuando esté disponible el backend
  // try {
  //   const response = await apiFetch('http://localhost:8080/groups', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(request),
  //   });
  //   return response;
  // } catch (error) {
  //   console.error('Error al crear grupo:', error);
  //   throw error;
  // }

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
  // TODO: Descomentar cuando esté disponible el backend
  // const URL = 'http://localhost:8080/groups';
  // let response = await fetch(URL, { method: 'GET' });
  // return response.json();

  // Simulación de unirse a un grupo
  const allGroups = loadGroupsFromStorage();
  const group = allGroups.find(g => g.id === offerId);

  if (!group) {
    throw new Error(`Grupo con ID ${offerId} no encontrado`);
  }

  if (group.availableSlots <= 0) {
    throw new Error('No hay slots disponibles en este grupo');
  }

  // Reducir slots disponibles
  group.availableSlots -= 1;
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

// Inicializar localStorage con datos mock si no existen (después de definir mockGroupOffers)
const initializeStorageIfEmpty = (): void => {
  const existing = loadGroupsFromStorage();
  if (existing.length === 0) {
    saveGroupsToStorage(mockGroupOffers);
  }
};

// Llamar inicialización al cargar el módulo
initializeStorageIfEmpty();