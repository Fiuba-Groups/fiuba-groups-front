import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, X } from 'lucide-react';
import styles from './UserRequests.module.scss';
import AppShell from '../../components/Shell';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import RatingStars from '../../components/RatingStars';
import { useUserRequests } from '../../hooks/useUserRequests';
import { GroupRequest } from '../../types/requests';
import { fetchStudentRatings, StudentRatingSummary } from '../../services/ratingsService';

type TabType = 'sent' | 'received';

export default function UserRequests() {
  const { sentRequests, receivedRequests, loading, error, refetch, acceptRequest, rejectRequest, cancelRequest } = useUserRequests();
  const [activeTab, setActiveTab] = useState<TabType>('sent');
  const [requesterRatings, setRequesterRatings] = useState<Record<string, StudentRatingSummary | null>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'cancel' | 'accept' | 'reject';
    request: GroupRequest | null;
  }>({
    isOpen: false,
    action: 'cancel',
    request: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Cargar calificaciones de los solicitantes cuando hay solicitudes recibidas
  useEffect(() => {
    const loadRequesterRatings = async () => {
      const ratingsMap: Record<string, StudentRatingSummary | null> = {};
      
      for (const request of receivedRequests) {
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

    if (receivedRequests.length > 0) {
      loadRequesterRatings();
    }
  }, [receivedRequests]);

  const currentRequests = (activeTab === 'sent' ? sentRequests : receivedRequests)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  const handleActionClick = (action: 'cancel' | 'accept' | 'reject', request: GroupRequest) => {
    setConfirmModal({
      isOpen: true,
      action,
      request,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.request) return;

    setIsProcessing(true);
    try {
      const { action, request } = confirmModal;

      switch (action) {
        case 'cancel':
          await cancelRequest(request.id);
          break;
        case 'accept':
          await acceptRequest(request.id);
          break;
        case 'reject':
          await rejectRequest(request.id);
          break;
      }

      setConfirmModal({ isOpen: false, action: 'cancel', request: null });
    } catch (error) {
      console.error('Error processing request action:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmModal({ isOpen: false, action: 'cancel', request: null });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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
    switch (status) {
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

    const { action, request } = confirmModal;
    const groupTitle = request.groupOffer.title;

    switch (action) {
      case 'cancel':
        return {
          title: 'Cancelar solicitud',
          message: `¿Quieres cancelar tu solicitud para unirte al grupo "${groupTitle}"?`,
        };
      case 'accept':
        return {
          title: 'Aceptar solicitud',
          message: `¿Quieres aceptar la solicitud de ${request.requester.name} para unirse al grupo "${groupTitle}"?`,
        };
      case 'reject':
        return {
          title: 'Rechazar solicitud',
          message: `¿Quieres rechazar la solicitud de ${request.requester.name} para unirse al grupo "${groupTitle}"?`,
        };
      default:
        return { title: '', message: '' };
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

  const sentCount = sentRequests.length;
  const receivedCount = receivedRequests.length;

  return (
    <AppShell>
      <div className={styles.requestsContainer}>
        <div className={styles.requestsHeader}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Mis Solicitudes</h1>
            <div className={styles.stats}>
              <span className={styles.totalCount}>
                {sentCount} enviadas • {receivedCount} recibidas
              </span>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'sent' ? styles.active : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Enviadas ({sentCount})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'received' ? styles.active : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Recibidas ({receivedCount})
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

        {!loading && !error && currentRequests.length === 0 && (
          <div className={styles.emptyState}>
            <i className="pi pi-inbox" />
            <h3>
              {activeTab === 'sent'
                ? 'No has enviado solicitudes'
                : 'No has recibido solicitudes'
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

        {!loading && !error && currentRequests.length > 0 && (
          <div className={styles.requestsList}>
            {currentRequests.map((request) => (
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
                      <strong>Solicitante:</strong> {request.requester.name} {request.requester.surname}
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
                      onClick={() => handleActionClick('cancel', request)}
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
                        onClick={() => handleActionClick('reject', request)}
                        disabled={isProcessing}
                      >
                        <X />
                        Rechazar
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.primary}`}
                        onClick={() => handleActionClick('accept', request)}
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