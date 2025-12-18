import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, X, Users, UserPlus } from 'lucide-react';
import styles from './UserRequests.module.scss';
import AppShell from '../../components/Shell';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import RatingStars from '../../components/RatingStars';
import { useUserRequests } from '../../hooks/useUserRequests';
import { useUserFriendRequests } from '../../hooks/useUserFriendRequests';
import { GroupRequest } from '../../types/requests';
import { FriendRequest } from '../../types/friends';
import { fetchStudentRatings, StudentRatingSummary } from '../../services/ratingsService';
import { UserProfileLink } from '../../components/UserProfileLink';
import { mapToUserSummary } from '../../types/users';

type RequestCategory = 'groups' | 'friends';
type TabType = 'sent' | 'received';

const buildGroupRequesterSummary = (request: GroupRequest) => {
  const requester = request.requester;
  return mapToUserSummary({
    id: requester.id,
    name: requester.name,
    surname: requester.surname,
    email: requester.email,
  });
};

const buildFriendSummary = (person?: FriendRequest['sender']) => {
  if (!person) return null;
  const [firstName, ...rest] = (person.name || '').split(' ');
  return mapToUserSummary({
    id: person.id,
    name: firstName || person.name,
    surname: rest.length ? rest.join(' ') : undefined,
    register: person.register,
    avatarUrl: person.avatarUrl,
  });
};

export default function UserRequests() {
  const { 
    sentRequests: sentGroupRequests, 
    receivedRequests: receivedGroupRequests, 
    loading: loadingGroups, 
    error: errorGroups, 
    refetch: refetchGroups, 
    acceptRequest: acceptGroupRequest, 
    rejectRequest: rejectGroupRequest, 
    cancelRequest: cancelGroupRequest 
  } = useUserRequests();
  
  const {
    sentRequests: sentFriendRequests,
    receivedRequests: receivedFriendRequests,
    loading: loadingFriends,
    error: errorFriends,
    refetch: refetchFriends,
    acceptRequest: acceptFriendRequest,
    rejectRequest: rejectFriendRequest,
    cancelRequest: cancelFriendRequest,
  } = useUserFriendRequests();

  const [activeCategory, setActiveCategory] = useState<RequestCategory>('groups');
  const [activeTab, setActiveTab] = useState<TabType>('sent');
  const [requesterRatings, setRequesterRatings] = useState<Record<string, StudentRatingSummary | null>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'cancel' | 'accept' | 'reject';
    request: GroupRequest | FriendRequest | null;
    type: 'group' | 'friend';
  }>({
    isOpen: false,
    action: 'cancel',
    request: null,
    type: 'group',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const loading = activeCategory === 'groups' ? loadingGroups : loadingFriends;
  const error = activeCategory === 'groups' ? errorGroups : errorFriends;

  // Cargar calificaciones de los solicitantes cuando hay solicitudes recibidas de grupos
  useEffect(() => {
    const loadRequesterRatings = async () => {
      const ratingsMap: Record<string, StudentRatingSummary | null> = {};
      
      for (const request of receivedGroupRequests) {
        const requesterId = request.requesterId;
        if (!ratingsMap[requesterId]) {
          try {
            const ratings = await fetchStudentRatings(Number(requesterId));
            ratingsMap[requesterId] = ratings;
          } catch {
            ratingsMap[requesterId] = null;
          }
        }
      }
      
      setRequesterRatings(ratingsMap);
    };

    if (receivedGroupRequests.length > 0) {
      loadRequesterRatings();
    }
  }, [receivedGroupRequests]);

  // Solicitudes actuales según categoría y pestaña
  const currentGroupRequests = (activeTab === 'sent' ? sentGroupRequests : receivedGroupRequests)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  
  const currentFriendRequests = (activeTab === 'sent' ? sentFriendRequests : receivedFriendRequests)
    .filter(req => req.status === 'PENDING' || activeTab === 'sent')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleActionClick = (action: 'cancel' | 'accept' | 'reject', request: GroupRequest | FriendRequest, type: 'group' | 'friend') => {
    setConfirmModal({
      isOpen: true,
      action,
      request,
      type,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.request) return;

    setIsProcessing(true);
    try {
      const { action, request, type } = confirmModal;

      if (type === 'group') {
        switch (action) {
          case 'cancel':
            await cancelGroupRequest(request.id);
            refetchGroups();
            break;
          case 'accept':
            await acceptGroupRequest(request.id);
            refetchGroups();
            break;
          case 'reject':
            await rejectGroupRequest(request.id);
            refetchGroups();
            break;
        }
      } else {
        switch (action) {
          case 'cancel':
            await cancelFriendRequest(request.id);
            break;
          case 'accept':
            await acceptFriendRequest(request.id);
            refetchFriends();
            break;
          case 'reject':
            await rejectFriendRequest(request.id);
            refetchFriends();
            break;
        }
      }

      setConfirmModal({ isOpen: false, action: 'cancel', request: null, type: 'group' });
    } catch (error) {
      console.error('Error processing request action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmModal({ isOpen: false, action: 'cancel', request: null, type: 'group' });
  };

  const refetch = () => {
    if (activeCategory === 'groups') {
      refetchGroups();
    } else {
      refetchFriends();
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
        return <Clock />;
      case 'accepted':
        return <CheckCircle />;
      case 'rejected':
        return <XCircle />;
      default:
        return <Clock />;
    }
  };

  const getStatusText = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
        return 'Pendiente';
      case 'accepted':
        return 'Aceptada';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  };

  const getConfirmModalContent = () => {
    if (!confirmModal.request) return { title: '', message: '' };

    const { action, request, type } = confirmModal;

    if (type === 'group') {
      const groupRequest = request as GroupRequest;
      const groupTitle = groupRequest.groupOffer.title;

      switch (action) {
        case 'cancel':
          return {
            title: 'Cancelar solicitud',
            message: `¿Quieres cancelar tu solicitud para unirte al grupo "${groupTitle}"?`,
          };
        case 'accept':
          return {
            title: 'Aceptar solicitud',
            message: `¿Quieres aceptar la solicitud de ${groupRequest.requester.name} para unirse al grupo "${groupTitle}"?`,
          };
        case 'reject':
          return {
            title: 'Rechazar solicitud',
            message: `¿Quieres rechazar la solicitud de ${groupRequest.requester.name} para unirse al grupo "${groupTitle}"?`,
          };
        default:
          return { title: '', message: '' };
      }
    } else {
      const friendRequest = request as FriendRequest;
      const senderName = friendRequest.sender?.name || 'Usuario';

      switch (action) {
        case 'cancel':
          return {
            title: 'Cancelar solicitud de amistad',
            message: `¿Quieres cancelar tu solicitud de amistad a ${friendRequest.receiver?.name || 'este usuario'}?`,
          };
        case 'accept':
          return {
            title: 'Aceptar solicitud de amistad',
            message: `¿Quieres aceptar la solicitud de amistad de ${senderName}?`,
          };
        case 'reject':
          return {
            title: 'Rechazar solicitud de amistad',
            message: `¿Quieres rechazar la solicitud de amistad de ${senderName}?`,
          };
        default:
          return { title: '', message: '' };
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sentGroupCount = sentGroupRequests.length;
  const receivedGroupCount = receivedGroupRequests.length;
  const sentFriendCount = sentFriendRequests.filter(r => r.status === 'PENDING').length;
  const receivedFriendCount = receivedFriendRequests.filter(r => r.status === 'PENDING').length;

  return (
    <AppShell>
      <div className={styles.requestsContainer}>
        <div className={styles.requestsHeader}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Mis Solicitudes</h1>
            <div className={styles.stats}>
              <span className={styles.totalCount}>
                Grupos: {sentGroupCount + receivedGroupCount} • Amistad: {sentFriendCount + receivedFriendCount}
              </span>
            </div>
          </div>
        </div>

        {/* Pestañas de categoría */}
        <div className={styles.categoryTabs}>
          <button
            className={`${styles.categoryTab} ${activeCategory === 'groups' ? styles.active : ''}`}
            onClick={() => setActiveCategory('groups')}
          >
            <Users size={18} />
            Grupos ({sentGroupCount + receivedGroupCount})
          </button>
          <button
            className={`${styles.categoryTab} ${activeCategory === 'friends' ? styles.active : ''}`}
            onClick={() => setActiveCategory('friends')}
          >
            <UserPlus size={18} />
            Amistad ({sentFriendCount + receivedFriendCount})
          </button>
        </div>

        {/* Pestañas de enviadas/recibidas */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'sent' ? styles.active : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Enviadas ({activeCategory === 'groups' ? sentGroupCount : sentFriendCount})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'received' ? styles.active : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Recibidas ({activeCategory === 'groups' ? receivedGroupCount : receivedFriendCount})
          </button>
        </div>

        {loading && (
          <div className={styles.loadingState}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Cargando solicitudes...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <i className="pi pi-exclamation-circle" />
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={refetch}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Renderizado de solicitudes de grupos */}
        {activeCategory === 'groups' && !loading && !error && currentGroupRequests.length === 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-inbox" />
            <h3>
              {activeTab === 'sent'
                ? 'No has enviado solicitudes de grupo'
                : 'No has recibido solicitudes de grupo'
              }
            </h3>
            <p>
              {activeTab === 'sent'
                ? 'Cuando solicites unirte a un grupo de estudio, aparecerán aquí.'
                : 'Cuando otros estudiantes soliciten unirse a tus grupos, aparecerán aquí.'
              }
            </p>
          </div>
        )}

        {activeCategory === 'groups' && !loading && !error && currentGroupRequests.length > 0 && (
          <div className={styles.requestsList}>
            {currentGroupRequests.map((request) => (
              <div
                key={request.id}
                className={`${styles.requestCard} ${styles[request.status]}`}
              >
                <div className={styles.requestHeader}>
                  <h3 className={styles.requestTitle}>{request.groupOffer.title}</h3>
                  <div className={`${styles.requestStatus} ${styles[request.status]}`}>
                    {getStatusIcon(request.status)}
                    <span>{getStatusText(request.status)}</span>
                  </div>
                </div>

                <div className={styles.requestInfo}>
                  <div className={styles.requestSubject}>
                    <strong>Materia:</strong> {request.groupOffer.subject} - {request.groupOffer.cathedra}
                  </div>
                  <div className={styles.requestSubject}>
                    <strong>Cuatrimestre:</strong> {request.groupOffer.semester}
                  </div>
                  {activeTab === 'sent' && (
                    <div className={styles.requestSubject}>
                      <strong>Creador:</strong> {request.groupOffer.author.name}
                    </div>
                  )}
                  {activeTab === 'received' && (
                    <div className={styles.requesterInfo}>
                      <strong>Solicitante:</strong>
                      <div className={styles.profileLinkWrapper}>
                        <UserProfileLink
                          user={buildGroupRequesterSummary(request)}
                          showRegister
                        />
                      </div>
                      {requesterRatings[request.requesterId] && (
                        <div className={styles.requesterRating}>
                          <RatingStars 
                            rating={requesterRatings[request.requesterId]!.averageRating} 
                            totalRatings={requesterRatings[request.requesterId]!.totalRatings}
                            showCount={true}
                            size="small"
                          />
                        </div>
                      )}
                      {!requesterRatings[request.requesterId] && (
                        <span className={styles.noRating}>Sin calificaciones previas</span>
                      )}
                    </div>
                  )}
                  <div className={styles.requestDate}>
                    Solicitado el {formatDate(request.requestedAt)}
                    {request.respondedAt && (
                      <> • Respondido el {formatDate(request.respondedAt)}</>
                    )}
                  </div>
                </div>

                {request.message && (
                  <div className={styles.requestMessage}>
                    <p>"{request.message}"</p>
                  </div>
                )}

                <div className={styles.requestActions}>
                  {activeTab === 'sent' && request.status === 'pending' && (
                    <button
                      className={`${styles.actionButton} ${styles.danger}`}
                      onClick={() => handleActionClick('cancel', request, 'group')}
                      disabled={isProcessing}
                    >
                      <X />
                      Cancelar solicitud
                    </button>
                  )}

                  {activeTab === 'received' && request.status === 'pending' && (
                    <>
                      <button
                        className={`${styles.actionButton} ${styles.danger}`}
                        onClick={() => handleActionClick('reject', request, 'group')}
                        disabled={isProcessing}
                      >
                        <X />
                        Rechazar
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.primary}`}
                        onClick={() => handleActionClick('accept', request, 'group')}
                        disabled={isProcessing}
                      >
                        <CheckCircle />
                        Aceptar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Renderizado de solicitudes de amistad */}
        {activeCategory === 'friends' && !loading && !error && currentFriendRequests.length === 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-inbox" />
            <h3>
              {activeTab === 'sent'
                ? 'No has enviado solicitudes de amistad'
                : 'No has recibido solicitudes de amistad'
              }
            </h3>
            <p>
              {activeTab === 'sent'
                ? 'Cuando envíes solicitudes de amistad, aparecerán aquí.'
                : 'Cuando otros estudiantes te envíen solicitudes de amistad, aparecerán aquí.'
              }
            </p>
          </div>
        )}

        {activeCategory === 'friends' && !loading && !error && currentFriendRequests.length > 0 && (
          <div className={styles.requestsList}>
            {currentFriendRequests.map((request) => {
              const person = activeTab === 'sent' ? request.receiver : request.sender;
              const isPending = request.status === 'PENDING';
              const personSummary = buildFriendSummary(person);
              
              return (
                <div
                  key={request.id}
                  className={`${styles.requestCard} ${styles[request.status.toLowerCase()]}`}
                >
                  <div className={styles.requestHeader}>
                    <div className={styles.friendRequestInfo}>
                      <div className={styles.profileLinkWrapper}>
                        {personSummary ? (
                          <UserProfileLink
                            user={personSummary}
                            showRegister
                            variant="full"
                          />
                        ) : (
                          <span>{person?.name || 'Usuario'}</span>
                        )}
                      </div>
                    </div>
                    <div className={`${styles.requestStatus} ${styles[request.status.toLowerCase()]}`}>
                      {getStatusIcon(request.status)}
                      <span>{getStatusText(request.status)}</span>
                    </div>
                  </div>

                  <div className={styles.requestInfo}>
                    <div className={styles.requestDate}>
                      {activeTab === 'sent' ? 'Enviada' : 'Recibida'} el {formatDate(request.createdAt)}
                      {request.respondedAt && (
                        <> • Respondida el {formatDate(request.respondedAt)}</>
                      )}
                    </div>
                  </div>

                  <div className={styles.requestActions}>
                    {activeTab === 'sent' && isPending && (
                      <button
                        className={`${styles.actionButton} ${styles.danger}`}
                        onClick={() => handleActionClick('cancel', request, 'friend')}
                        disabled={isProcessing}
                      >
                        <X />
                        Cancelar solicitud
                      </button>
                    )}

                    {activeTab === 'received' && isPending && (
                      <>
                        <button
                          className={`${styles.actionButton} ${styles.danger}`}
                          onClick={() => handleActionClick('reject', request, 'friend')}
                          disabled={isProcessing}
                        >
                          <X />
                          Rechazar
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.primary}`}
                          onClick={() => handleActionClick('accept', request, 'friend')}
                          disabled={isProcessing}
                        >
                          <CheckCircle />
                          Aceptar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmAction}
          {...getConfirmModalContent()}
          confirmText={
            confirmModal.action === 'cancel' ? 'Cancelar' :
            confirmModal.action === 'accept' ? 'Aceptar' :
            'Rechazar'
          }
          cancelText="No"
          isLoading={isProcessing}
        />
      </div>
    </AppShell>
  );
}