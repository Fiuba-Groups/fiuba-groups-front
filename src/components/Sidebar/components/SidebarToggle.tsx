import React from 'react';
import styles from '../styles.module.scss';
import { Position } from '../types/types';

interface SidebarToggleProps {
  collapsed?: boolean;
  onToggle?: () => void;
  position: Position;
}

/**
 * Componente del botón toggle del sidebar
 * Maneja la rotación y el posicionamiento del botón de colapsar/expandir
 */
export default function SidebarToggle({ collapsed, onToggle, position }: SidebarToggleProps) {
  return (
    <button
      className={`${styles.toggleButton} ${collapsed ? styles.rotated : ''}`}
      onClick={onToggle}
      aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      style={{ 
        position: 'fixed', 
        left: position.left, 
        top: position.top 
      }}
    >
      <i className="pi pi-angle-double-right" aria-hidden="true" />
    </button>
  );
}
