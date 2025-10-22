import styles from './styles.module.scss';
import AppShell from '../../components/Shell';
import FloatingButton from '../../components/FloatingButton/FloatingButton';

export default function LandingPage() {
  const handleCreatePost = () => {
    console.log('Crear nueva publicación');
    // Aquí iría la lógica para abrir modal o navegar a crear publicación
  };

  return (
    <AppShell>
      <div className={styles.landingContent}> 
        <h1 className={styles.landingTitle}>TITULO</h1>
      </div>
      <FloatingButton 
        onClick={handleCreatePost}
        icon="pi pi-plus"
        label="Crear búsqueda"
      />
    </AppShell>
  );
}