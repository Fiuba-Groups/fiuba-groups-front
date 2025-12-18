import React, { useState } from 'react';
import { Briefcase, Plus, Calendar, BookOpen, Users } from 'lucide-react';
import styles from './ShowcasedGroupsList.module.scss';
import ShowcasedGroupModal from './ShowcasedGroupModal';

interface Member {
  id: number;
  name: string;
  register: number;
  avatarUrl?: string;
}

interface ShowcasedGroup {
  id: number;
  title: string;
  description: string;
  subject?: string;
  course?: string;
  semester?: string;
  members?: Member[];
}

interface ShowcasedGroupsListProps {
  groups: ShowcasedGroup[];
  isEditable?: boolean;
  onEdit?: () => void;
}

export default function ShowcasedGroupsList({ groups, isEditable = false, onEdit }: ShowcasedGroupsListProps) {
  const [selectedGroup, setSelectedGroup] = useState<ShowcasedGroup | null>(null);

  if (!groups || (groups.length === 0 && !isEditable)) {
    return null;
  }

  const renderDescription = (text: string) => {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <p className={styles.description}>
        {parts.map((part, i) => {
          if (part.match(urlRegex)) {
            return (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                {part}
              </a>
            );
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          <Briefcase size={20} />
          Grupos Destacados
        </h3>
        {isEditable && (
          <button className={styles.editButton} onClick={onEdit}>
            <Plus size={16} />
            Gestionar
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <p className={styles.emptyState}>No has destacado ningún grupo aún.</p>
      ) : (
        <div className={styles.grid}>
          {groups.map((group) => (
            <div 
              key={group.id} 
              className={styles.card}
              onClick={() => setSelectedGroup(group)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.cardHeader}>
                <h4>{group.title}</h4>
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
              
              {renderDescription(group.description)}
              
              {group.members && group.members.length > 0 && (
                <div className={styles.members}>
                  <div className={styles.membersHeader}>
                    <Users size={14} />
                    <span>Participantes:</span>
                  </div>
                  <div className={styles.membersList}>
                    {group.members.map(m => (
                      <span key={m.id} className={styles.memberName} title={`Padrón: ${m.register}`}>
                        {m.name}
                      </span>
                    )).reduce((prev, curr) => [prev, ', ', curr] as any)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedGroup && (
        <ShowcasedGroupModal
          isOpen={true}
          onClose={() => setSelectedGroup(null)}
          group={selectedGroup}
          mode="view"
        />
      )}
    </div>
  );
}
