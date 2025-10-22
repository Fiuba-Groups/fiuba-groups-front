import React from 'react';
import styles from '../styles.module.scss';
import { SidebarNavigationProps, NavigationItem } from '../types/types';

/**
 * Componente de navegación del sidebar
 * Renderiza una lista de elementos de navegación cuando el sidebar está expandido
 */
export default function SidebarNavigation({ items, collapsed }: SidebarNavigationProps) {
  if (collapsed) {
    return null; // No renderizar cuando está colapsado
  }

  return (
    <nav className={styles.navigation} role="navigation" aria-label="Navegación principal">
      <ul className={styles.navigationList}>
        {items.map((item: NavigationItem) => (
          <li key={item.id} className={styles.navigationItem}>
            <button
              className={styles.navigationButton}
              onClick={item.onClick}
              aria-label={item.label}
            >
              {item.icon && <i className={item.icon} aria-hidden="true" />}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
