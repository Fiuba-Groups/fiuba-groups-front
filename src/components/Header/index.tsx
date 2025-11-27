import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('/user.png');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Cargar avatar y cerrar dropdown al hacer clic fuera
  useEffect(() => {
    // Cargar avatar desde localStorage
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    // Escuchar cambios en localStorage para actualizar avatar
    function handleStorageChange(event: StorageEvent) {
      if (event.key === 'userAvatar' && event.newValue) {
        setAvatarUrl(event.newValue);
      }
    }

    // Escuchar evento personalizado de cambio de avatar
    function handleAvatarChange(event: CustomEvent<string>) {
      setAvatarUrl(event.detail);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarChanged', handleAvatarChange as EventListener);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarChanged', handleAvatarChange as EventListener);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleEditProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    logout();
    // Forzar recarga completa de la página para limpiar todo el estado
    window.location.href = '/login';
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
                src={avatarUrl}
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