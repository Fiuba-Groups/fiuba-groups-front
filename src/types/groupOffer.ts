/**
 * Tipos relacionados con las ofertas de grupos
 */

/**
 * Autor/creador de una oferta de grupo
 */
export interface GroupOfferAuthor {
  id: string;
  name: string;
  profileUrl?: string;
}

/**
 * Miembro de un grupo
 */
export interface GroupMember {
  id: string;
  register: number;
  name: string;
  rating?: {
    average: number;
    count: number;
  };
  avatarUrl?: string;
  profileUrl?: string;
}

/**
 * Oferta de grupo
 */
export interface GroupOffer {
  id: string;
  title: string;
  description: string;
  subject: string; // Materia a la que pertenece
  cathedra: string; // Nombre de la cátedra (apellido del profesor)
  semester: string; // Cuatrimestre (ej: 1C 2025)
  totalSlots: number;
  availableSlots: number;
  currentMembers: number; // Número actual de miembros en el grupo
  author: GroupOfferAuthor;
  members?: GroupMember[]; // Lista de miembros del grupo
  createdAt: string;
  updatedAt: string;
  status?: 'ACTIVE' | 'FINISHED'; // Estado del grupo
}

/**
 * Estado del hook useGroupOffers
 */
export interface UseGroupOffersResult {
  offers: GroupOffer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

