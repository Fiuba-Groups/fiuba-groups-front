import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import styles from './ShowcasedGroupsList.module.scss';

interface GroupSummary {
  id: number;
  title: string;
  description: string;
}

interface ShowcasedGroupsListProps {
  groups: GroupSummary[];
  isEditable?: boolean;
  onEdit?: () => void;
}

export default function ShowcasedGroupsList({ groups, isEditable = false, onEdit }: ShowcasedGroupsListProps) {
  if (!groups || (groups.length === 0 && !isEditable)) {
    return null;
  }

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
            <div key={group.id} className={styles.card}>
              <h4>{group.title}</h4>
              <p>{group.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
