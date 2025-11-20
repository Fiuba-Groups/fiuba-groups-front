import React, { useState } from 'react';
import styles from './LoginScreen.module.scss';
import { login } from "../../services/authService";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/fondo_login_2.jpg)`,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onLogin();
    } catch {
      alert("Credenciales inválidas");
    }
  }

  return (
      <div className={styles.loginContent} style={backgroundStyle}>
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