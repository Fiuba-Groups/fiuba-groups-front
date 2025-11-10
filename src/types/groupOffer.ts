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
  author: GroupOfferAuthor;
  createdAt: string;
  updatedAt: string;
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

