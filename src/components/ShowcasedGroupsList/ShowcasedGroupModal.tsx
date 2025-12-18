import React from 'react';
import { X, BookOpen, Calendar } from 'lucide-react';
import styles from './ShowcasedGroupModal.module.scss';

interface Member {
  id: number | string;
  name: string;
  register: number;
  avatarUrl?: string;
}

interface ShowcasedGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: {
    title: string;
    subject?: string;
    semester?: string;
    course?: string;
    description?: string; // User's description
    originalDescription?: string; // Group's description
    members?: Member[];
  };
  mode: 'view' | 'edit';
  editValue?: string;
  onEditChange?: (value: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export default function ShowcasedGroupModal({
  isOpen,
  onClose,
  group,
  mode,
  editValue,
  onEditChange,
  onSave,
  isSaving
}: ShowcasedGroupModalProps) {
  if (!isOpen) return null;

  const renderDescription = (text: string) => {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <>
        {parts.map((part, i) => {
          if (part.match(urlRegex)) {
            return (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
            );
          }
          return part;
        })}
      </>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3>{group.title}</h3>
            <div className={styles.meta}>
              {group.subject && (
                <span className={styles.tag}>
                  <BookOpen size={14} /> {group.subject}
                </span>
              )}
              {group.semester && (
                <span className={styles.tag}>
                  <Calendar size={14} /> {group.semester}
                </span>
              )}
              {group.course && (
                <span className={styles.tag}>
                  Com. {group.course}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {mode === 'edit' ? (
            <div className={styles.section}>
              <h4>Tu descripción (rol, logros, links)</h4>
              <textarea
                className={styles.descriptionInput}
                value={editValue}
                onChange={(e) => onEditChange?.(e.target.value)}
                placeholder="Describe tu participación en este proyecto..."
                autoFocus
              />
            </div>
          ) : (
            group.description && (
              <div className={styles.section}>
                <h4>Sobre mi participación</h4>
                <p>{renderDescription(group.description)}</p>
              </div>
            )
          )}

          {group.originalDescription && (
            <div className={styles.section}>
              <h4>Descripción del Grupo</h4>
              <p>{group.originalDescription}</p>
            </div>
          )}

          {group.members && group.members.length > 0 && (
            <div className={styles.section}>
              <h4>Integrantes</h4>
              <div className={styles.membersList}>
                {group.members.map(member => (
                  <div key={member.id} className={styles.memberItem}>
                    <div className={styles.memberAvatar}>
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} />
                      ) : (
                        <span>{member.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.memberRegister}>Padrón: {member.register}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {mode === 'edit' && (
          <div className={styles.footer}>
            <button 
              className={`${styles.button} ${styles.secondary}`} 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button 
              className={`${styles.button} ${styles.primary}`} 
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
