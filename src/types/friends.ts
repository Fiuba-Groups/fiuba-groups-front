/**
 * Tipos relacionados con amigos y solicitudes de amistad
 */

/**
 * Información de un amigo
 */
export interface Friend {
  id: string;
  register: number; // Registro de estudiante
  name: string;
  surname?: string;
  email?: string;
  profileUrl?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: string;
  bio?: string;
  showcasedGroups?: {
    id: number;
    title: string;
    description: string;
  }[];
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
 * Respuesta del backend para amigos (Student)
 */
export interface FriendResponse {
  id: number;
  register: number;
  name: string;
  avatarUrl?: string;
}

/**
 * Estado de una solicitud de amistad
 */
export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/**
 * Información de un estudiante en una solicitud
 */
export interface StudentInfo {
  id: number;
  register: number;
  name: string;
  avatarUrl?: string;
}

/**
 * Solicitud de amistad
 */
export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  sender?: StudentInfo;
  receiver?: StudentInfo;
  status: FriendRequestStatus;
  createdAt: string;
  respondedAt?: string;
}

/**
 * Estado del hook useUserFriendRequests
 */
export interface UseUserFriendRequestsResult {
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  sendFriendRequest: (receiverId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
}

/**
 * Estado de la relación de amistad
 */
export type FriendshipStatus = 'FRIENDS' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'NONE';

