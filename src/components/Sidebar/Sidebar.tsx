import React from 'react';
import styles from './styles.module.scss';
import 'primeicons/primeicons.css';
import useSidebarPosition from './hooks/useSidebarPosition';
import SidebarLogo from './components/SidebarLogo';
import SidebarTitle from './components/SidebarTitle';
import SidebarToggle from './components/SidebarToggle';
import SidebarNavigation from './components/SidebarNavigation';
import { navigationItems } from './data/navigationData';
import { SidebarProps } from './types/types';

/**
 * Componente principal del Sidebar
 * Maneja el estado colapsado/expandido y renderiza los subcomponentes
 */
export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const { asideRef, buttonPos, logoPos, titlePos } = useSidebarPosition(collapsed);

  return (
    <aside 
      ref={asideRef} 
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`} 
      aria-hidden={collapsed}
      aria-label="Panel de navegación lateral"
    >
      <SidebarLogo position={logoPos} />
      <SidebarTitle 
        position={titlePos} 
        collapsed={collapsed} 
      />
      <SidebarToggle 
        collapsed={collapsed} 
        onToggle={onToggle} 
        position={buttonPos} 
      />
      <SidebarNavigation 
        items={navigationItems} 
        collapsed={collapsed} 
      />
      <div className={`${styles.helpDivider} ${collapsed ? styles.collapsed : ''}`} />
      <button 
        className={`${styles.helpButton} ${collapsed ? styles.collapsed : ''}`}
        onClick={() => {
          console.log('Ayuda clickeada');
        }}
        aria-label="Obtener ayuda"
      >
        <i className="pi pi-megaphone" aria-hidden="true" />
        <span>Ayuda</span>
      </button>
    </aside>
  );
}
