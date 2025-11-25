import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Trash2, AlertTriangle } from 'lucide-react';
import styles from './SecurityScreen.module.scss';
import AppShell from '../../components/Shell';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

export default function SecurityScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'email' | 'password' | 'delete'>('email');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para cambiar email
  const [emailForm, setEmailForm] = useState({
    currentEmail: 'usuario@fi.uba.ar',
    newEmail: '',
    confirmNewEmail: '',
    password: ''
  });

  // Estados para cambiar contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailForm.newEmail !== emailForm.confirmNewEmail) {
      alert('Los correos electrónicos no coinciden');
      return;
    }
    console.log('Cambiando email:', emailForm);
    // TODO: Implementar cambio de email
    alert('Correo electrónico actualizado exitosamente');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    console.log('Cambiando contraseña:', passwordForm);
    // TODO: Implementar cambio de contraseña
    alert('Contraseña actualizada exitosamente');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implementar eliminación de cuenta
      console.log('Eliminando cuenta...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay
      alert('Cuenta eliminada exitosamente');
      navigate('/login');
    } catch (error) {
      alert('Error al eliminar la cuenta');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const tabs = [
    { id: 'email' as const, label: 'Cambiar Email', icon: Mail },
    { id: 'password' as const, label: 'Cambiar Contraseña', icon: Lock },
    { id: 'delete' as const, label: 'Eliminar Cuenta', icon: Trash2 }
  ];

  return (
    <AppShell>
      <div className={styles.securityContainer}>
        {/* Header de navegación */}
        <div className={styles.header}>
          <button
            onClick={() => navigate('/profile')}
            className={styles.backButton}
          >
            <ArrowLeft size={16} />
            Volver a ajustes
          </button>
          <h1 className={styles.title}>Contraseña y Seguridad</h1>
        </div>

        {/* Tabs de navegación */}
        <div className={styles.tabs}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenido de cada tab */}
        <div className={styles.content}>
          {activeTab === 'email' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Mail className={styles.sectionIcon} />
                Cambiar Correo Electrónico
              </h2>

              <form onSubmit={handleEmailSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Correo electrónico actual</label>
                  <input
                    type="email"
                    value={emailForm.currentEmail}
                    disabled
                    className={styles.disabledInput}
                  />
                  <p className={styles.helpText}>
                    Este es tu correo actual registrado
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label>Nuevo correo electrónico</label>
                  <input
                    type="email"
                    name="newEmail"
                    value={emailForm.newEmail}
                    onChange={handleEmailChange}
                    placeholder="nuevo@email.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Confirmar nuevo correo electrónico</label>
                  <input
                    type="email"
                    name="confirmNewEmail"
                    value={emailForm.confirmNewEmail}
                    onChange={handleEmailChange}
                    placeholder="nuevo@email.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Contraseña actual</label>
                  <input
                    type="password"
                    name="password"
                    value={emailForm.password}
                    onChange={handleEmailChange}
                    placeholder="Tu contraseña actual"
                    required
                  />
                  <p className={styles.helpText}>
                    Necesitamos verificar tu identidad
                  </p>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Actualizar Correo Electrónico
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Lock className={styles.sectionIcon} />
                Cambiar Contraseña
              </h2>

              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Contraseña actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Tu contraseña actual"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nueva contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nueva contraseña (mínimo 8 caracteres)"
                    required
                  />
                  <p className={styles.helpText}>
                    Debe tener al menos 8 caracteres
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label>Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    placeholder="Repite la nueva contraseña"
                    required
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Trash2 className={styles.sectionIcon} />
                Eliminar Cuenta
              </h2>

              <div className={styles.deleteSection}>
                <div className={styles.warningBox}>
                  <AlertTriangle className={styles.warningIcon} />
                  <h3>¿Estás seguro de que quieres eliminar tu cuenta?</h3>
                  <p>Esta acción no se puede deshacer. Se eliminarán permanentemente:</p>
                  <ul>
                    <li>Tu perfil y toda tu información personal</li>
                    <li>Todas tus búsquedas de grupos</li>
                    <li>Tu historial de solicitudes y amistades</li>
                    <li>Todos tus datos académicos</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={16} />
                  Eliminar Mi Cuenta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal de confirmación para eliminar cuenta */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          title="¿Eliminar cuenta permanentemente?"
          message="Esta acción no se puede deshacer. Tu cuenta y todos tus datos serán eliminados permanentemente."
          confirmText="Sí, eliminar mi cuenta"
          cancelText="Cancelar"
          isLoading={isDeleting}
        />
      </div>
    </AppShell>
  );
}
