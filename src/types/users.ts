/**
 * Tipos relacionados con usuarios y perfiles
 */

/**
 * Resumen de un usuario - tipo común para representar usuarios en listados
 * Usado en FriendCard, GroupOfferDetailModal, UserRequests, etc.
 */
export interface UserSummary {
  id: string;
  name: string;
  surname?: string;
  register?: number;
  avatarUrl?: string;
  email?: string;
  rating?: {
    average: number;
    count: number;
  };
  isOnline?: boolean;
}

/**
 * Helper para convertir diferentes estructuras de respuesta a UserSummary
 */
export const mapToUserSummary = (data: {
  id: string | number;
  name?: string;
  surname?: string;
  register?: number;
  avatarUrl?: string;
  email?: string;
  rating?: { average: number; count: number } | null;
  isOnline?: boolean;
  student?: {
    id?: number;
    name?: string;
    register?: number;
  };
}): UserSummary => {
  // Si tiene student anidado, extraer de ahí
  if (data.student) {
    const nameParts = data.student.name?.split(' ') || [];
    return {
      id: String(data.id),
      name: nameParts[0] || data.name || '',
      surname: nameParts.slice(1).join(' ') || data.surname,
      register: data.student.register || data.register,
      avatarUrl: data.avatarUrl,
      email: data.email,
      rating: data.rating || undefined,
      isOnline: data.isOnline,
    };
  }

  return {
    id: String(data.id),
    name: data.name || '',
    surname: data.surname,
    register: data.register,
    avatarUrl: data.avatarUrl,
    email: data.email,
    rating: data.rating || undefined,
    isOnline: data.isOnline,
  };
};

/**
 * Obtiene el nombre completo de un UserSummary
 */
export const getFullName = (user: UserSummary): string => {
  return user.surname ? `${user.name} ${user.surname}` : user.name;
};

/**
 * Obtiene las iniciales de un usuario para mostrar como avatar placeholder
 */
export const getInitials = (user: UserSummary): string => {
  const name = user.name || '';
  const surname = user.surname || '';
  
  if (surname) {
    return (name.charAt(0) + surname.charAt(0)).toUpperCase();
  }
  
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  
  return name.substring(0, 2).toUpperCase();
};
