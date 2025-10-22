import React from 'react';
import styles from '../styles.module.scss';
import { Position } from '../types/types';
import { LOGO_SRC, LOGO_SIZE } from '../constants';

interface SidebarLogoProps {
  position: Position;
  src?: string;
  alt?: string;
}

/**
 * Componente del logo del sidebar
 * Muestra el logo fijo en la posición calculada
 */
export default function SidebarLogo({ 
  position, 
  src = LOGO_SRC, 
  alt = 'Logo' 
}: SidebarLogoProps) {
  return (
    <img
      className={styles.logo}
      src={src}
      alt={alt}
      style={{ 
        position: 'fixed', 
        left: position.left, 
        top: position.top, 
        width: LOGO_SIZE, 
        height: LOGO_SIZE 
      }}
    />
  );
}
