import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import 'primeicons/primeicons.css';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    console.log('Perfil clickeado');
    setIsDropdownOpen(false);
  };

  const handleEditProfileClick = () => {
    console.log('Editar perfil clickeado');
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    console.log('Cerrar sesión clickeado');
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          {/* Espacio para contenido del lado izquierdo si es necesario */}
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.userMenu} ref={dropdownRef}>
            <div 
              className={styles.userAvatar}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img 
                src="/user.png" 
                alt="Avatar del usuario" 
                className={styles.avatarImage}
              />
              <i 
                className={`pi pi-angle-down ${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`}
              />
            </div>
            
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button 
                  className={styles.dropdownItem}
                  onClick={handleProfileClick}
                >
                  <i className="pi pi-user" />
                  <span>Perfil</span>
                </button>
                <button 
                  className={styles.dropdownItem}
                  onClick={handleEditProfileClick}
                >
                  <i className="pi pi-user-edit" />
                  <span>Editar perfil</span>
                </button>
                <div className={styles.dropdownDivider} />
                <button 
                  className={styles.dropdownItem}
                  onClick={handleLogoutClick}
                >
                  <i className="pi pi-sign-out" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}