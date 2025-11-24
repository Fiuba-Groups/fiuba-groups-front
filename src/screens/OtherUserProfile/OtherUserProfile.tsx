import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, BookOpen, Trophy, MessageCircle, UserPlus } from 'lucide-react';
import styles from './OtherUserProfile.module.scss';
import AppShell from '../../components/Shell';
import { useUserFriends } from '../../hooks/useUserFriends';

export default function OtherUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { friends } = useUserFriends();

  // Encontrar el amigo por ID
  const userProfile = friends.find(friend => friend.id === userId);

  // Datos mock para el perfil (en producción vendrían del backend)
  const mockProfileData = {
    level: 15,
    joinDate: '2022-03-15',
    country: 'Argentina',
    favoriteSubject: 'Programación I',
    totalGroups: 8,
    completedSubjects: 12,
    achievements: 24,
    reputation: 4.8,
    lastActivity: '2024-11-24T10:30:00Z',
    bio: userProfile?.bio || 'Estudiante apasionado por la tecnología y las ciencias de la computación. Siempre dispuesto a ayudar en proyectos de grupo y compartir conocimientos.',
    recentActivity: [
      { type: 'group_join', description: 'Se unió al grupo "Proyecto Final - Desarrollo Web"', time: '2 días atrás' },
      { type: 'achievement', description: 'Obtuvo el logro "Colaborador Destacado"', time: '1 semana atrás' },
      { type: 'subject_complete', description: 'Completó la materia "Estructuras de Datos"', time: '2 semanas atrás' },
    ],
    commonGroups: [
      { id: '1', name: 'Grupo de Análisis Matemático II', subject: 'Análisis Matemático II' },
      { id: '2', name: 'Proyecto Final - Desarrollo Web', subject: 'Programación I' },
    ]
  };

  if (!userProfile) {
    return (
      <AppShell>
        <div className={styles.errorContainer}>
          <h2>Usuario no encontrado</h2>
          <p>No se pudo encontrar la información de este usuario.</p>
          <button onClick={() => navigate('/my-friends')} className={styles.backButton}>
            <ArrowLeft size={16} />
            Volver a mis amigos
          </button>
        </div>
      </AppShell>
    );
  }

  const profileData = { ...userProfile, ...mockProfileData };

  return (
    <AppShell>
      <div className={styles.profileContainer}>
        {/* Header de navegación */}
        <div className={styles.header}>
          <button
            onClick={() => navigate('/my-friends')}
            className={styles.backButton}
          >
            <ArrowLeft size={16} />
            Volver a mis amigos
          </button>
        </div>

        {/* Banner y Avatar Principal */}
        <div className={styles.profileHeader}>
          <div className={styles.banner}>
            <div className={styles.bannerGradient} />
          </div>

          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <img
                src={profileData.avatarUrl || '/user.png'}
                alt={`${profileData.name} ${profileData.surname}`}
                className={styles.mainAvatar}
              />
              {profileData.isOnline && <div className={styles.onlineIndicator} />}
            </div>

            <div className={styles.userInfo}>
              <div className={styles.nameSection}>
                <h1 className={styles.displayName}>
                  {profileData.name} {profileData.surname}
                </h1>
                <div className={styles.statusBadge}>
                  <div className={`${styles.statusDot} ${profileData.isOnline ? styles.online : styles.offline}`} />
                  <span>{profileData.isOnline ? 'En línea' : 'Desconectado'}</span>
                </div>
              </div>

              <div className={styles.levelSection}>
                <div className={styles.levelBadge}>
                  <Trophy size={16} />
                  <span>Nivel {profileData.level}</span>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.messageButton}>
                <MessageCircle size={16} />
                Enviar mensaje
              </button>
              <button className={styles.friendButton}>
                <UserPlus size={16} />
                Agregar amigo
              </button>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className={styles.contentGrid}>
          {/* Columna Izquierda */}
          <div className={styles.leftColumn}>
            {/* Información Personal */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Información Personal</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <MapPin size={16} />
                  <span>{profileData.country}</span>
                </div>
                <div className={styles.infoItem}>
                  <Calendar size={16} />
                  <span>Miembro desde {new Date(profileData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className={styles.infoItem}>
                  <BookOpen size={16} />
                  <span>Materia favorita: {profileData.favoriteSubject}</span>
                </div>
              </div>

              {profileData.bio && (
                <div className={styles.bioSection}>
                  <h3>Biografía</h3>
                  <p>{profileData.bio}</p>
                </div>
              )}
            </div>

            {/* Grupos en Común */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Users size={18} />
                Grupos en común ({profileData.commonGroups.length})
              </h2>
              <div className={styles.groupsList}>
                {profileData.commonGroups.map(group => (
                  <div key={group.id} className={styles.groupItem}>
                    <div className={styles.groupInfo}>
                      <h4>{group.name}</h4>
                      <span className={styles.subject}>{group.subject}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className={styles.rightColumn}>
            {/* Estadísticas */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Estadísticas Académicas</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{profileData.totalGroups}</div>
                  <div className={styles.statLabel}>Grupos activos</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{profileData.completedSubjects}</div>
                  <div className={styles.statLabel}>Materias completadas</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{profileData.achievements}</div>
                  <div className={styles.statLabel}>Logros obtenidos</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{profileData.reputation}</div>
                  <div className={styles.statLabel}>Reputación</div>
                </div>
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Actividad Reciente</h2>
              <div className={styles.activityList}>
                {profileData.recentActivity.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {activity.type === 'group_join' && <Users size={16} />}
                      {activity.type === 'achievement' && <Trophy size={16} />}
                      {activity.type === 'subject_complete' && <BookOpen size={16} />}
                    </div>
                    <div className={styles.activityContent}>
                      <p>{activity.description}</p>
                      <span className={styles.activityTime}>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
