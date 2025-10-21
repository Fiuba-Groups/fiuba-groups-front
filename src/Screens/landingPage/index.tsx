import styles from './styles.module.scss';
import AppShell from '../../components/Shell';

export default function LandingPage() {
  return (
    <AppShell>
      <div className={styles.landingContent}>
        <h1 className={styles.landingTitle}>TITULO</h1>
      </div>
    </AppShell>
  );
}