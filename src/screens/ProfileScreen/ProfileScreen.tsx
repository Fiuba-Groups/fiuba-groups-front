import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.scss';
import AppShell from '../../components/Shell';
import { User, Shield, HelpCircle, BookOpen, GraduationCap } from 'lucide-react';
import { uploadAvatar } from '../../services/userService';

type Section = 'edit-profile';

export default function ProfileScreen() {
  const [activeSection, setActiveSection] = useState<Section>('edit-profile');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('/user.png');
  const [formData, setFormData] = useState({
    username: 'UserFiuba',
    nombre: 'Alumno de Turri',
    Apodo: '',
    bio: '',
    genero: 'Masculino'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar avatar desde localStorage al montar el componente
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setCurrentAvatarUrl(savedAvatar);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del perfil:', formData);
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
            <h2>{formData.nombre}</h2>
            <p>@{formData.username}</p>
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
        
        <h2 className={styles.profileTitle}>Editar Perfil</h2>
        
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formRow}>
            <label>Apodo</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="Apodo"
                value={formData.Apodo}
                onChange={handleChange}
                placeholder="Tu apodo público"
              />
              <p className={styles.helpText}>
                Este nombre será visible para otros usuarios en la aplicación.
              </p>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Biografía</label>
            <div className={styles.inputWrapper}>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Contanos un poco sobre vos..."
                rows={4}
                maxLength={150}
              />
              <p className={styles.charCount}>{formData.bio.length} / 150</p>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Género</label>
            <div className={styles.inputWrapper}>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className={styles.selectInput}
              >
                <option value="Male">Hombre</option>
                <option value="Female">Mujer</option>
                <option value="Other">Otro</option>
                <option value="PreferNotToSay">Prefiero no decirlo</option>
              </select>
              <p className={styles.helpText}>
                Esta información no será visible para otros usuarios.
              </p>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Visibilidad</label>
            <div className={styles.inputWrapper}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span>Permitir que otros usuarios te encuentren y te agreguen como amigo.</span>
              </label>
            </div>
          </div>

          <div className={styles.submitSection}>
            <button type="submit" className={styles.submitButton}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
      </div>
    </AppShell>
  );
}