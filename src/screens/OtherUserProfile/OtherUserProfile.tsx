import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserCheck, Mail } from 'lucide-react';
import styles from './OtherUserProfile.module.scss';
import AppShell from '../../components/Shell';
import RatingStars from '../../components/RatingStars';
import { useUserFriends } from '../../hooks/useUserFriends';
import { useUserProfile, UseUserProfileResult } from '../../hooks/useUserProfile';
import { isUserFriend, getTeammateEmail } from '../../services/userService';
import { fetchStudentRatings, StudentRatingSummary } from '../../services/ratingsService';
import ShowcasedGroupsList from '../../components/ShowcasedGroupsList/ShowcasedGroupsList';

export default function OtherUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { friends } = useUserFriends();
  const { user: userProfile, loading, error, sendRequest, cancelRequest, isRequesting, hasPendingRequest }: UseUserProfileResult = useUserProfile(userId);
  
  const [ratingSummary, setRatingSummary] = useState<StudentRatingSummary | null>(null);
  const [loadingRating, setLoadingRating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Determinar la ruta de retorno desde location.state o fallback
  const fromPath = (location.state as { from?: string })?.from || '/my-friends';

  // Verificar si el usuario es amigo
  const isFriend = userId ? isUserFriend(userId, friends) : false;

  // Cargar calificaciones del usuario
  useEffect(() => {
    const loadRatings = async () => {
      if (!userId) return;
      setLoadingRating(true);
      try {
        const ratings = await fetchStudentRatings(Number(userId));
        setRatingSummary(ratings);
      } catch (err) {
        console.error('Error cargando calificaciones:', err);
      } finally {
        setLoadingRating(false);
      }
    };
    loadRatings();
  }, [userId]);

  // Manejar envío de email
  const handleSendEmail = async () => {
    if (!userId) return;
    setSendingEmail(true);
    try {
      const email = await getTeammateEmail(userId);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error obteniendo email:', err);
      alert('No se pudo obtener el email. Solo puedes enviar emails a compañeros de grupo.');
    } finally {
      setSendingEmail(false);
    }
  };

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <AppShell>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Cargando perfil...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !userProfile) {
    return (
      <AppShell>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h2>Usuario no encontrado</h2>
            <p>No se pudo encontrar la información de este usuario.</p>
            <button onClick={() => navigate(fromPath)} className={styles.backButtonLarge}>
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const fullName = `${userProfile.name}${userProfile.surname ? ` ${userProfile.surname}` : ''}`;
  const username = userProfile.email ? userProfile.email.split('@')[0] : '';

  return (
    <AppShell>
      <div className={styles.settingsContainer}>
        {/* Sidebar interno del perfil (simulado para consistencia visual) */}
        <aside className={styles.sidebar}>
          <button onClick={() => navigate(fromPath)} className={styles.backButton}>
            <ArrowLeft size={16} />
            Volver
          </button>

          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionGroupTitle}>Información</h3>
            <div className={`${styles.sidebarOption} ${styles.active}`}>
              <UserCheck className={styles.icon} />
              Perfil de Usuario
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <div className={styles.profileContainer}>
          <div className={styles.photoSection}>
            <img
              src={userProfile.avatarUrl || '/user.png'}
              alt={fullName}
              className={styles.profilePhoto}
            />
            <div className={styles.photoInfo}>
              <h2>{fullName}</h2>
              {username && <p>@{username}</p>}
              
              {/* Calificaciones */}
              {loadingRating ? (
                <div className={styles.loadingRating}>
                  <i className="pi pi-spin pi-spinner" />
                </div>
              ) : ratingSummary && ratingSummary.totalRatings > 0 ? (
                <div className={styles.ratingSection}>
                  <RatingStars 
                    rating={ratingSummary.averageRating} 
                    totalRatings={ratingSummary.totalRatings}
                    showCount={true}
                    size="medium"
                  />
                </div>
              ) : (
                <div className={styles.noRatings}>
                  <i className="pi pi-star" />
                  Sin calificaciones aún
                </div>
              )}
            </div>
          </div>

          <h2 className={styles.profileTitle}>Perfil de Usuario</h2>

          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <label>Nombre completo</label>
              <div className={styles.infoValue}>
                <span>{fullName}</span>
              </div>
            </div>

            {username && (
              <div className={styles.infoRow}>
                <label>Usuario</label>
                <div className={styles.infoValue}>
                  <span>@{username}</span>
                </div>
              </div>
            )}

            {userProfile.email && (
              <div className={styles.infoRow}>
                <label>Email</label>
                <div className={styles.infoValue}>
                  <span>{userProfile.email}</span>
                </div>
              </div>
            )}

            {userProfile.register && (
              <div className={styles.infoRow}>
                <label>Padrón</label>
                <div className={styles.infoValue}>
                  <span>{userProfile.register}</span>
                </div>
              </div>
            )}
          </div>

          <ShowcasedGroupsList 
            groups={userProfile.showcasedGroups || []}
            isEditable={false}
          />

          {/* Botones de acción */}
          <div className={styles.actionButtons}>
            {isFriend ? (
              <button className={`${styles.actionButton} ${styles.isFriend}`} disabled>
                <UserCheck size={18} />
                Ya son amigos
              </button>
            ) : hasPendingRequest ? (
              <button
                className={`${styles.actionButton} ${styles.pending}`}
                onClick={async () => {
                  try {
                    await cancelRequest();
                  } catch (err) {
                    console.error('Error cancelando solicitud:', err);
                  }
                }}
                disabled={isRequesting}
              >
                <UserCheck size={18} />
                {isRequesting ? 'Cancelando...' : 'Solicitud enviada'}
              </button>
            ) : (
              <button
                className={`${styles.actionButton} ${styles.primary}`}
                onClick={async () => {
                  try {
                    await sendRequest();
                  } catch (err) {
                    console.error('Error enviando solicitud:', err);
                  }
                }}
                disabled={isRequesting}
              >
                <UserPlus size={18} />
                {isRequesting ? 'Enviando...' : 'Agregar amigo'}
              </button>
            )}

            <button
              className={`${styles.actionButton} ${styles.secondary}`}
              onClick={handleSendEmail}
              disabled={sendingEmail}
            >
              <Mail size={18} />
              {sendingEmail ? 'Abriendo...' : 'Enviar email'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
