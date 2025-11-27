import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Eye, EyeOff, GraduationCap } from 'lucide-react';
import styles from './PrivacyScreen.module.scss';
import AppShell from '../../components/Shell';

type VisibilityOption = 'Todos' | 'Solo amigos' | 'Nadie';

export default function PrivacyScreen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: 'Alumno de Turri',
    apellido: '',
    perfilVisibilidad: 'Todos' as VisibilityOption,
    academiaVisibilidad: 'Todos' as VisibilityOption,
  });

  const visibilityOptions: VisibilityOption[] = ['Todos', 'Solo amigos', 'Nadie'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de privacidad:', formData);
    // TODO: Implementar guardado de datos
  };

  const getVisibilityIcon = (option: VisibilityOption) => {
    switch (option) {
      case 'Todos':
        return <Eye className={styles.visibilityIcon} />;
      case 'Solo amigos':
        return <User className={styles.visibilityIcon} />;
      case 'Nadie':
        return <EyeOff className={styles.visibilityIcon} />;
    }
  };

  const getVisibilityDescription = (option: VisibilityOption) => {
    switch (option) {
      case 'Todos':
        return 'Visible para cualquier usuario de la plataforma';
      case 'Solo amigos':
        return 'Solo visible para tus amigos agregados';
      case 'Nadie':
        return 'No visible para ningún otro usuario';
    }
  };

  return (
    <AppShell>
      <div className={styles.privacyContainer}>
        {/* Header de navegación */}
        <div className={styles.header}>
          <button
            onClick={() => navigate('/profile')}
            className={styles.backButton}
          >
            <ArrowLeft size={16} />
            Volver a ajustes
          </button>
          <h1 className={styles.title}>Privacidad y Seguridad</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.privacyForm}>
          {/* Cambiar nombre y apellido */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <User className={styles.sectionIcon} />
              Información Personal
            </h2>

            <div className={styles.formRow}>
              <label>Nombre</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
                <p className={styles.helpText}>
                  Este será tu nombre público en la plataforma.
                </p>
              </div>
            </div>

            <div className={styles.formRow}>
              <label>Apellido</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                />
                <p className={styles.helpText}>
                  Tu apellido será visible según la configuración de privacidad.
                </p>
              </div>
            </div>
          </div>

          {/* Quién puede ver tu perfil */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Eye className={styles.sectionIcon} />
              Visibilidad del Perfil
            </h2>

            <div className={styles.formRow}>
              <label>Quién puede ver tu perfil</label>
              <div className={styles.inputWrapper}>
                <div className={styles.optionsGrid}>
                  {visibilityOptions.map(option => (
                    <label
                      key={option}
                      className={`${styles.optionCard} ${
                        formData.perfilVisibilidad === option ? styles.selected : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="perfilVisibilidad"
                        value={option}
                        checked={formData.perfilVisibilidad === option}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <div className={styles.optionContent}>
                        {getVisibilityIcon(option)}
                        <div>
                          <strong>{option}</strong>
                          <p className={styles.optionDescription}>
                            {getVisibilityDescription(option)}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* Quién puede ver información académica */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <GraduationCap className={styles.sectionIcon} />
              Visibilidad Académica
            </h2>

            <div className={styles.formRow}>
              <label>Quién puede ver tu información académica</label>
              <div className={styles.inputWrapper}>
                <div className={styles.optionsGrid}>
                  {visibilityOptions.map(option => (
                    <label
                      key={option}
                      className={`${styles.optionCard} ${
                        formData.academiaVisibilidad === option ? styles.selected : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="academiaVisibilidad"
                        value={option}
                        checked={formData.academiaVisibilidad === option}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      <div className={styles.optionContent}>
                        {getVisibilityIcon(option)}
                        <div>
                          <strong>{option}</strong>
                          <p className={styles.optionDescription}>
                            {getVisibilityDescription(option)}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className={styles.submitSection}>
            <button type="submit" className={styles.submitButton}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
