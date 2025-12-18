import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.scss';
import AppShell from '../../components/Shell';
import RatingStars from '../../components/RatingStars';
import { User, Shield, HelpCircle, BookOpen, GraduationCap, Pencil, Check, X } from 'lucide-react';
import { uploadAvatar, updateStudentProfile } from '../../services/userService';
import { fetchCurrentUser, CurrentUser, clearUserCache } from '../../services/currentUserService';
import { fetchStudentRatings, StudentRatingSummary } from '../../services/ratingsService';

type Section = 'edit-profile';

export default function ProfileScreen() {
  const [activeSection, setActiveSection] = useState<Section>('edit-profile');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('/user.png');
  const [ratingSummary, setRatingSummary] = useState<StudentRatingSummary | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derivar datos del usuario
  const fullName = currentUser?.student?.name || 'Cargando...';
  
  const username = currentUser?.email 
    ? currentUser.email.split('@')[0] 
    : 'usuario';

  const studentRegister = currentUser?.student?.register;

  // Cargar avatar desde localStorage al montar el componente
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setCurrentAvatarUrl(savedAvatar);
    }
  }, []);

  // Cargar datos del usuario actual y calificaciones
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const user = await fetchCurrentUser();
        setCurrentUser(user);
        
        if (user.student?.id) {
          const ratings = await fetchStudentRatings(user.student.id);
          setRatingSummary(ratings);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleStartEditName = () => {
    setEditedName(fullName);
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || !studentRegister) return;
    
    try {
      setIsSavingName(true);
      await updateStudentProfile(editedName.trim(), studentRegister);
      // Limpiar cache y recargar usuario
      clearUserCache();
      const updatedUser = await fetchCurrentUser(true);
      setCurrentUser(updatedUser);
      setIsEditingName(false);
    } catch (error) {
      console.error('Error al guardar nombre:', error);
      alert('Error al guardar el nombre. Por favor intenta de nuevo.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handlePhotoChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen (incluyendo GIF)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor selecciona un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validar tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const avatarUrl = await uploadAvatar(file);

      // Actualizar el estado local con la nueva URL del avatar
      setCurrentAvatarUrl(avatarUrl);

      // Guardar en localStorage para persistencia
      localStorage.setItem('userAvatar', avatarUrl);

      // Emitir evento personalizado para actualizar otros componentes
      window.dispatchEvent(new CustomEvent('avatarChanged', { detail: avatarUrl }));

      console.log('Avatar subido exitosamente:', avatarUrl);

      // Mostrar mensaje de éxito
      alert('Avatar actualizado exitosamente');

    } catch (error) {
      console.error('Error al subir avatar:', error);
      alert('Error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      setIsUploadingAvatar(false);
      // Limpiar el input para permitir seleccionar la misma imagen nuevamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <AppShell>
      <div className={styles.settingsContainer}>
        {/* Sidebar interno del perfil */}
        <aside className={styles.sidebar}>
          <h1 className={styles.sidebarTitle}>Ajustes</h1>

          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionGroupTitle}>Cuenta</h3>
            <button
              className={`${styles.sidebarOption} ${activeSection === 'edit-profile' ? styles.active : ''}`}
              onClick={() => setActiveSection('edit-profile')}
            >
              <User className={styles.icon} />
              Editar Perfil
            </button>
            <Link
              to="/profile/privacy"
              className={styles.sidebarOption}
            >
              <Shield className={styles.icon} />
              Privacidad
            </Link>
          </div>

          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionGroupTitle}>Académico</h3>
            <Link
              to="/profile/career"
              className={styles.sidebarOption}
            >
              <GraduationCap className={styles.icon} />
              Mi Carrera
            </Link>
            <Link to="/academic-history" className={styles.sidebarOption}>
              <BookOpen className={styles.icon} />
              Historial Académico
            </Link>
          </div>

          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionGroupTitle}>Soporte</h3>
            <Link
              to="/profile/help"
              className={styles.sidebarOption}
            >
              <HelpCircle className={styles.icon} />
              Centro de Ayuda
            </Link>
            <Link
              to="/profile/security"
              className={styles.sidebarOption}
            >
              <Shield className={styles.icon} />
              Contraseña y Seguridad
            </Link>
          </div>
        </aside>

        {/* Contenido Principal */}
        <div className={styles.profileContainer}>
        <div className={styles.photoSection}>
          <img
            src={currentAvatarUrl}
            alt="Profile"
            className={styles.profilePhoto}
          />
          <div className={styles.photoInfo}>
            <h2>{fullName}</h2>
            <p>@{username}</p>
            {ratingSummary && ratingSummary.totalRatings > 0 && (
              <div className={styles.ratingSection}>
                <RatingStars 
                  rating={ratingSummary.averageRating} 
                  totalRatings={ratingSummary.totalRatings}
                  showCount={true}
                  size="medium"
                />
              </div>
            )}
            {ratingSummary && ratingSummary.totalRatings === 0 && (
              <div className={styles.noRatings}>
                <i className="pi pi-star" />
                Sin calificaciones aún
              </div>
            )}
            <button
              type="button"
              className={styles.changePhotoBtn}
              onClick={handlePhotoChange}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? 'Subiendo...' : 'Cambiar Avatar'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        <h2 className={styles.profileTitle}>Mi Perfil</h2>
        
        {isLoading ? (
          <div className={styles.loadingState}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Cargando información...</p>
          </div>
        ) : (
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <label>Nombre completo</label>
              <div className={styles.infoValueEditable}>
                {isEditingName ? (
                  <div className={styles.editNameContainer}>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className={styles.editNameInput}
                      placeholder="Tu nombre completo"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName || !editedName.trim()}
                      className={styles.saveButton}
                      title="Guardar"
                    >
                      {isSavingName ? <i className="pi pi-spin pi-spinner" /> : <Check size={18} />}
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      disabled={isSavingName}
                      className={styles.cancelButton}
                      title="Cancelar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{fullName}</span>
                    <button
                      onClick={handleStartEditName}
                      className={styles.editButton}
                      title="Editar nombre"
                    >
                      <Pencil size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.infoRow}>
              <label>Usuario</label>
              <div className={styles.infoValue}>
                <span>@{username}</span>
              </div>
            </div>

            <div className={styles.infoRow}>
              <label>Email</label>
              <div className={styles.infoValue}>
                <span>{currentUser?.email || 'No disponible'}</span>
              </div>
            </div>

            {studentRegister && (
              <div className={styles.infoRow}>
                <label>Padrón</label>
                <div className={styles.infoValue}>
                  <span>{studentRegister}</span>
                </div>
              </div>
            )}

            <p className={styles.helpText}>
              Para modificar tu información personal, contacta a la administración de FIUBA.
            </p>
          </div>
        )}
      </div>
      </div>
    </AppShell>
  );
}