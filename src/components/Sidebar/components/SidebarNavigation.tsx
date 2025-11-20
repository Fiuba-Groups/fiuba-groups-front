import React from 'react';
import styles from '../styles.module.scss';
import { SidebarNavigationProps, NavigationItem } from '../types/types';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de navegación del sidebar
 * Renderiza una lista de elementos de navegación cuando el sidebar está expandido
 */
export default function SidebarNavigation({ items, collapsed }: SidebarNavigationProps) {
  const navigate = useNavigate();

  if (collapsed) {
    return null; // No renderizar cuando está colapsado
  }

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case 'search-groups':
        navigate('/home');
        break;
      case 'create-search':
        navigate('/new-group-search');
        break;
      case 'my-searches':
        navigate('/my-searches');
        break;
      case 'my-requests':
        navigate('/my-requests');
        break;
      case 'my-groups':
        navigate('/my-groups');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        console.log(`Navegación no implementada para: ${itemId}`);
    }
  };

  return (
    <nav className={styles.navigation} role="navigation" aria-label="Navegación principal">
      <ul className={styles.navigationList}>
        {items.map((item: NavigationItem) => (
          <li key={item.id} className={styles.navigationItem}>
            <button
              className={styles.navigationButton}
              onClick={() => handleNavigation(item.id)}
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
