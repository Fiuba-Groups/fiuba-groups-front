/**
 * Tipos relacionados con solicitudes de unión a grupos
 */

/**
 * Estado de una solicitud
 */
export type RequestStatus = 'pending' | 'accepted' | 'rejected';

/**
 * Información de una solicitud de unión a grupo
 */
export interface GroupRequest {
  id: string;
  groupOfferId: string;
  groupOffer: {
    id: string;
    title: string;
    subject: string;
    cathedra: string;
    semester: string;
    author: {
      id: string;
      name: string;
    };
  };
  requesterId: string;
  requester: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
  status: RequestStatus;
  requestedAt: string;
  respondedAt?: string;
  message?: string; // Mensaje opcional del solicitante
}

/**
 * Estado del hook useUserRequests
 */
export interface UseUserRequestsResult {
  sentRequests: GroupRequest[];
  receivedRequests: GroupRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
}

/**
 * Respuesta del backend para solicitudes
 */
export interface GroupRequestResponse {
  id: number;
  groupOfferId: number;
  requesterId: number;
  status: RequestStatus;
  requestedAt: string;
  respondedAt?: string;
  message?: string;
}
