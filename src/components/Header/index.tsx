import styles from './styles.module.scss';

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1 className={styles.title}>FIUBA Groups</h1>
    </header>
  );
}