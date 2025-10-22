import React from 'react';
import styles from '../styles.module.scss';
import { Position } from '../types/types';

interface SidebarTitleProps {
  position: Position;
  collapsed?: boolean;
  text?: string;
}

/**
 * Componente del título del sidebar
 * Muestra el texto "FIUBA Groups" entre el logo y el botón toggle
 * Solo se muestra cuando el sidebar está desplegado
 */
export default function SidebarTitle({ 
  position, 
  collapsed = false,
  text = 'FIUBA Groups'
}: SidebarTitleProps) {
  // No renderizar si está colapsado
  if (collapsed) {
    return null;
  }

  return (
    <div
      className={styles.title}
      style={{ 
        position: 'fixed', 
        left: position.left, 
        top: position.top 
      }}
    >
      {text}
    </div>
  );
}
