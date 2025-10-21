import React from "react";
import styles from './styles.module.scss';

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1 className={styles.title}>FIUBA Groups Frontend</h1>
      <button className={styles.sideButton} aria-label="open sidebar">☰</button>
    </header>
  );
}