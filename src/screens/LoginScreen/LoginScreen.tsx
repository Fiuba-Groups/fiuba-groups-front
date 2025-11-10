import React, { useState } from 'react';
import styles from './LoginScreen.module.scss';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de login
    console.log('Login attempt:', { email, password });
    
    // Simular login exitoso (aquí iría la validación real)
    if (email && password) {
      onLogin(); // Llama a la función para cambiar el estado de login
    }
  };

  return (
      <div className={styles.loginContent}>
        <div className={styles.loginForm}>
          <h1 className={styles.loginTitle}>Iniciar Sesión</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Tu contraseña"
                required
              />
            </div>
            
            <button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
  );
}