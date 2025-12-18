import React from 'react';
import styles from '../styles.module.scss';

interface SidebarFooterProps {
  collapsed?: boolean;
  onContactClick?: () => void;
}

/**
 * Componente del footer del sidebar
 * Muestra un botón de ayuda en la parte inferior
 * Solo se muestra cuando el sidebar está expandido
 */
export default function SidebarFooter({ 
  collapsed = false, 
  onContactClick 
}: SidebarFooterProps) {
  // No renderizar si está colapsado
  if (collapsed) {
    return null;
  }

  return (
    <div className={styles.footer}>
      <button 
        className={styles.contactButton}
        onClick={onContactClick}
        aria-label="Obtener ayuda"
      >
        <i className="pi pi-life-ring" aria-hidden="true" />
        <span>Ayuda</span>
      </button>
    </div>
  );
}
