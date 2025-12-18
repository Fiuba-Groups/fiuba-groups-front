import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterScreen.module.scss';
import { register } from "../../services/authService";

interface RegisterScreenProps {
  onRegister: () => void;
}

export default function RegisterScreen({ onRegister }: RegisterScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [padron, setPadron] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const getPasswordRequirements = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const isPasswordValid = (password: string) => {
    const requirements = getPasswordRequirements(password);
    return Object.values(requirements).every(req => req);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('El nombre y apellido son obligatorios');
      return;
    }

    if (!padron.trim()) {
      setError('El padrón es obligatorio');
      return;
    }

    if (!isPasswordValid(password)) {
      setError('La contraseña no cumple con los requisitos mínimos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, firstName, lastName, parseInt(padron));
      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        onRegister();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.registerContent}>
      <div className={styles.registerForm}>
        <h1 className={styles.registerTitle}>Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.label}>
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.input}
                placeholder="Tu nombre"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.input}
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="padron" className={styles.label}>
              Padrón
            </label>
            <input
              type="number"
              id="padron"
              value={padron}
              onChange={(e) => setPadron(e.target.value)}
              className={styles.input}
              placeholder="Tu número de padrón"
              required
            />
          </div>

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
            <div className={styles.passwordContainer}>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
                className={styles.input}
                placeholder="Tu contraseña"
                required
              />
              {showPasswordRequirements && (
                <div className={styles.passwordRequirements}>
                  <div className={styles.requirementsTitle}>La contraseña debe tener:</div>
                  {Object.entries({
                    length: 'Al menos 8 caracteres',
                    uppercase: 'Una letra mayúscula',
                    number: 'Un número',
                    symbol: 'Un símbolo (!@#$%^&*...)'
                  }).map(([key, text]) => {
                    const isValid = getPasswordRequirements(password)[key as keyof ReturnType<typeof getPasswordRequirements>];
                    return (
                      <div key={key} className={`${styles.requirement} ${isValid ? styles.valid : styles.invalid}`}>
                        <span className={styles.checkmark}>{isValid ? '✓' : '✗'}</span>
                        {text}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="Confirma tu contraseña"
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
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className={styles.loginLink}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  ); 
}
