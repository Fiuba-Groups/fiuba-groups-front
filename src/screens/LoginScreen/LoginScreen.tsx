import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginScreen.module.scss';
import { login } from "../../services/authService";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/fondo_login_2.jpg)`,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login(email, password);
      setSuccess('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        onLogin();
      }, 1500); // Esperar 1.5 segundos para mostrar el mensaje
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
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
            
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className={styles.registerLink}>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </div>
      </div>
    );
  } 