import React, { useState, useEffect } from 'react';
import { X, Check, Search } from 'lucide-react';
import styles from './SelectGroupsModal.module.scss';

interface GroupSummary {
  id: number;
  title: string;
  description: string;
}

interface SelectGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedGroupIds: number[]) => Promise<void>;
  availableGroups: GroupSummary[];
  initialSelectedGroups: GroupSummary[];
}

export default function SelectGroupsModal({
  isOpen,
  onClose,
  onSave,
  availableGroups,
  initialSelectedGroups,
}: SelectGroupsModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(initialSelectedGroups.map(g => g.id)));
      setSearchTerm('');
    }
  }, [isOpen, initialSelectedGroups]);

  if (!isOpen) return null;

  const handleToggle = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(Array.from(selectedIds));
      onClose();
    } catch (error) {
      console.error('Error saving groups:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredGroups = availableGroups.filter(group => 
    group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Seleccionar Grupos Destacados</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.list}>
          {filteredGroups.length === 0 ? (
            <p className={styles.emptyState}>No se encontraron grupos.</p>
          ) : (
            filteredGroups.map(group => (
              <div 
                key={group.id} 
                className={`${styles.item} ${selectedIds.has(group.id) ? styles.selected : ''}`}
                onClick={() => handleToggle(group.id)}
              >
                <div className={styles.checkbox}>
                  {selectedIds.has(group.id) && <Check size={14} />}
                </div>
                <div className={styles.info}>
                  <h4>{group.title}</h4>
                  <p>{group.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelButton} disabled={isSaving}>
            Cancelar
          </button>
          <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
