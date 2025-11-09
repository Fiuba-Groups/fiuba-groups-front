import { useState } from 'react';
import styles from './UserProfile.module.scss';

type Section = 'edit-profile' | 'password' | 'notifications' | 'privacy';

export default function UserProfile() {
  const [activeSection, setActiveSection] = useState<Section>('edit-profile');
  const [formData, setFormData] = useState({
    username: 'UserFiuba',
    nombre: 'Franco Bossi',
    Apodo: '',
    bio: '',
    email: '',
    telefono: '',
    genero: 'Male'
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
      <div className={styles.profileContainer}>
        {/* TÍTULO CORREGIDO */}
        <h1 className={styles.profileTitle}>Editar Perfil</h1>
        
        <div className={styles.profileContent}>
          {/* Sección de foto de perfil */}
          <div className={styles.photoSection}>
            <div className={styles.photoContainer}>
              <img 
                src="https://via.placeholder.com/150" 
                alt="Profile" 
                className={styles.profilePhoto}
              />
            </div>
            <div className={styles.photoInfo}>
              <h2 className={styles.username}>{formData.username}</h2>
              <p className={styles.displayName}>{formData.nombre}</p>
              <button 
                type="button" 
                className={styles.changePhotoBtn}
                onClick={handlePhotoChange}
              >
                Cambiar Avatar
              </button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formRow}>
              <label>Nombre</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="Apodo"
                  value={formData.Apodo}
                  onChange={handleChange}
                  placeholder="Perfil publico"
                />
                <p className={styles.helpText}>
                  Poder editar desde la App o Web.
                </p>
              </div>
            </div>

            <div className={styles.formRow}>
              {/* LABEL CORREGIDO */}
              <label>Descripción</label>
              <div className={styles.inputWrapper}>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Contanos quien sos"
                  rows={3}
                  maxLength={150}
                />
                <p className={styles.charCount}>{formData.bio.length} / 150</p>
              </div>
            </div>

            <div className={styles.formRow}>
              {/* LABEL CORREGIDO */}
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
                </select>
                <p className={styles.helpText}>
                  Solo vos veras esta informacion
                </p>
              </div>
            </div>

            <div className={styles.formRow}>
              {/* LABEL CORREGIDO */}
              <label>Mostrar amigos</label>
              <div className={styles.inputWrapper}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span>Aparecerle a gente para que te agregue como amigo</span>
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

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Ajustes</h2>
        
        <div className={styles.sectionGroup}>
          <h3 className={styles.sectionGroupTitle}>Centro de ayuda</h3>
          <p className={styles.sectionGroupDesc}>
            Contacta al numero xxxxx
          </p>
          <div className={styles.metaOptions}>
            <button className={styles.metaOption}>
              <span className={styles.icon}>👤</span>
              Personal details
            </button>
            <button className={styles.metaOption}>
              <span className={styles.icon}>🔒</span>
              Password and security
            </button>
            <button className={styles.metaOption}>
              <span className={styles.icon}>📢</span>
              University
            </button>
          </div>
          
        </div>

        <div className={styles.sectionGroup}>
          <h3 className={styles.sectionGroupTitle}>Edita Perfil</h3>
          <button 
            className={`${styles.sidebarOption} ${activeSection === 'edit-profile' ? styles.active : ''}`}
            onClick={() => setActiveSection('edit-profile')}
          >
            <span className={styles.icon}>👤</span>
            Editar Perfil
          </button>
          <button 
            className={`${styles.sidebarOption} ${activeSection === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <span className={styles.icon}>🔔</span>
            Notificaciones
          </button>
        </div>

        <div className={styles.sectionGroup}>
          <h3 className={styles.sectionGroupTitle}>Para Facultad</h3>
          <button className={styles.sidebarOption}>
            <span className={styles.icon}>💼</span>
            Fiuba Cuenta
          </button>
          <button className={styles.sidebarOption}>
            <span className={styles.icon}>📊</span>
            Notas e historial
          </button>
        </div>

        <div className={styles.sectionGroup}>
          <h3 className={styles.sectionGroupTitle}>Quienes pueden acceder a tu contenido</h3>
          <button 
            className={`${styles.sidebarOption} ${activeSection === 'privacy' ? styles.active : ''}`}
            onClick={() => setActiveSection('privacy')}
          >
            <span className={styles.icon}>🔐</span>
            Privacidad
          </button>
        </div>
      </aside>
    </div>
  );
}