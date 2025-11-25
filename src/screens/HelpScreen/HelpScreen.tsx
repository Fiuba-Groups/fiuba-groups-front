import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, HelpCircle } from 'lucide-react';
import styles from './HelpScreen.module.scss';
import AppShell from '../../components/Shell';

export default function HelpScreen() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className={styles.helpContainer}>
        {/* Header de navegación */}
        <div className={styles.header}>
          <button
            onClick={() => navigate('/profile')}
            className={styles.backButton}
          >
            <ArrowLeft size={16} />
            Volver a ajustes
          </button>
          <h1 className={styles.title}>Centro de Ayuda</h1>
        </div>

        {/* Contenido principal */}
        <div className={styles.content}>
          <div className={styles.helpCard}>
            <div className={styles.iconContainer}>
              <HelpCircle className={styles.helpIcon} size={48} />
            </div>

            <h2 className={styles.helpTitle}>¿Necesitas Ayuda?</h2>

            <p className={styles.helpText}>
              Por cualquier consulta, sugerencia o inconveniente que encuentres
              en la plataforma, no dudes en contactarnos.
            </p>

            <div className={styles.contactInfo}>
              <Mail className={styles.mailIcon} size={20} />
              <div>
                <strong>Envíanos un correo a:</strong>
                <a
                  href="mailto:fiubagroupsayuda@fi.uba.ar"
                  className={styles.emailLink}
                >
                  fiubagroupsayuda@fi.uba.ar
                </a>
              </div>
            </div>

            <div className={styles.additionalInfo}>
              <p>
                <strong>
                Nuestro equipo de soporte se pondrá en contacto contigo
                lo antes posible para resolver cualquier duda o problema.
                </strong>
              </p>
            </div>
          </div>

          <div className={styles.faqSection}>
            <h3>Preguntas Frecuentes</h3>

            <div className={styles.faqItem}>
              <h4>¿Cómo crear un grupo de estudio?</h4>
              <p>Ve a la página principal y haz clic en "Crear búsqueda". Completa el formulario con la información de tu grupo.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>¿Cómo unirme a un grupo existente?</h4>
              <p>Explora los grupos disponibles y haz clic en "Ver detalles" para solicitar unirte al grupo que te interese.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>¿Cómo cambiar mi información de perfil?</h4>
              <p>Ve a "Ajustes" desde el menú lateral y selecciona "Editar Perfil" para modificar tu información personal.</p>
            </div>

            <div className={styles.faqItem}>
              <h4>¿Cómo configurar mi privacidad?</h4>
              <p>En "Ajustes", selecciona "Privacidad" para controlar quién puede ver tu información y perfil.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
