/**
 * Tipos relacionados con amigos
 */

/**
 * Información de un amigo
 */
export interface Friend {
  id: string;
  register: number; // Registro de estudiante
  name: string;
  surname: string;
  email: string;
  profileUrl?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: string;
  bio?: string;
}

/**
 * Estado del hook useUserFriends
 */
export interface UseUserFriendsResult {
  friends: Friend[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Respuesta del backend para amigos
 */
export interface FriendResponse {
  id: number;
  register: number;
  name: string;
  surname: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: string;
}
