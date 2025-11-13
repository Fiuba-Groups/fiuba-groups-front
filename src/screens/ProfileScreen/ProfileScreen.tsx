import { useState } from 'react';
import styles from './Profile.module.scss';
import { User, Bell, Lock, Shield, HelpCircle, BookOpen, GraduationCap } from 'lucide-react';

type Section = 'edit-profile' | 'notifications' | 'privacy';

export default function ProfileScreen() {
  const [activeSection, setActiveSection] = useState<Section>('edit-profile');
  const [formData, setFormData] = useState({
    username: 'UserFiuba',
    nombre: 'Alumno de Turri',
    Apodo: '',
    bio: '',
    genero: 'Masculino'
  });

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
    console.log('Cambiar foto');
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Sidebar */}
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
          <button 
            className={`${styles.sidebarOption} ${activeSection === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <Bell className={styles.icon} />
            Notificaciones
          </button>
          <button 
            className={`${styles.sidebarOption} ${activeSection === 'privacy' ? styles.active : ''}`}
            onClick={() => setActiveSection('privacy')}
          >
            <Shield className={styles.icon} />
            Privacidad
          </button>
        </div>

        <div className={styles.sectionGroup}>
          <h3 className={styles.sectionGroupTitle}>Académico</h3>
          <button className={styles.sidebarOption}>
            <GraduationCap className={styles.icon} />
            Mi Carrera
          </button>
          <button className={styles.sidebarOption}>
            <BookOpen className={styles.icon} />
            Historial Académico
          </button>
        </div>

        <div className={styles.sectionGroup}>
          <h3 className={styles.sectionGroupTitle}>Soporte</h3>
          <button className={styles.sidebarOption}>
            <HelpCircle className={styles.icon} />
            Centro de Ayuda
          </button>
          <button className={styles.sidebarOption}>
            <Lock className={styles.icon} />
            Contraseña y Seguridad
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className={styles.profileContainer}>
        <div className={styles.photoSection}>
          <img 
            src="https://via.placeholder.com/150" 
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
            >
              Cambiar Avatar
            </button>
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
  );
}