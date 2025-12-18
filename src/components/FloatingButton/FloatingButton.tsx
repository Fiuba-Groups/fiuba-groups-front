import React from 'react';
import styles from './FloatingButton.module.scss';

interface FloatingButtonProps {
  onClick?: () => void;
  icon?: string;
  label?: string;
}

export default function FloatingButton({ 
  onClick, 
  icon = "pi pi-plus", 
  label = "Crear" 
}: FloatingButtonProps) {
  return (
    <button 
      className={styles.floatingButton}
      onClick={onClick}
      title={label}
    >
      <i className={icon}></i>
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
