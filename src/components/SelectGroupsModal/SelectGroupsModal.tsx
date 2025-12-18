import React, { useState, useEffect } from 'react';
import { X, Check, Search } from 'lucide-react';
import styles from './SelectGroupsModal.module.scss';
import ShowcasedGroupModal from '../ShowcasedGroupsList/ShowcasedGroupModal';

interface GroupSummary {
  id: number;
  title: string;
  description: string;
  subject?: string;
  semester?: string;
  course?: string;
  members?: any[];
}

interface ShowcasedGroupData {
  id: number;
  description: string;
}

interface SelectGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedGroups: { groupId: number; description: string }[]) => Promise<void>;
  availableGroups: GroupSummary[];
  initialSelectedGroups: ShowcasedGroupData[];
}

export default function SelectGroupsModal({
  isOpen,
  onClose,
  onSave,
  availableGroups,
  initialSelectedGroups,
}: SelectGroupsModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<Map<number, string>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupSummary | null>(null);
  const [tempDescription, setTempDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      const initialMap = new Map<number, string>();
      initialSelectedGroups.forEach(g => {
        initialMap.set(g.id, g.description || '');
      });
      setSelectedGroups(initialMap);
      setSearchTerm('');
    }
  }, [isOpen, initialSelectedGroups]);

  if (!isOpen) return null;

  const handleToggle = (id: number) => {
    const newSelected = new Map(selectedGroups);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.set(id, '');
    }
    setSelectedGroups(newSelected);
  };

  const handleCardClick = (group: GroupSummary) => {
    setEditingGroup(group);
    setTempDescription(selectedGroups.get(group.id) || '');
  };

  const handleModalSave = () => {
    if (editingGroup) {
      const newSelected = new Map(selectedGroups);
      newSelected.set(editingGroup.id, tempDescription);
      setSelectedGroups(newSelected);
      setEditingGroup(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = Array.from(selectedGroups.entries()).map(([groupId, description]) => ({
        groupId,
        description
      }));
      await onSave(result);
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
            filteredGroups.map(group => {
              const isSelected = selectedGroups.has(group.id);
              return (
                <div 
                  key={group.id} 
                  className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleCardClick(group)}
                >
                  <div className={styles.itemHeader}>
                    <div 
                      className={styles.checkbox} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(group.id);
                      }}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                    <div className={styles.info}>
                      <h4>{group.title}</h4>
                      <p className={styles.originalDesc}>{group.description}</p>
                    </div>
                  </div>
                </div>
              );
            })
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

      {editingGroup && (
        <ShowcasedGroupModal
          isOpen={true}
          onClose={() => setEditingGroup(null)}
          group={{
            ...editingGroup,
            originalDescription: editingGroup.description,
            description: tempDescription
          }}
          mode="edit"
          editValue={tempDescription}
          onEditChange={setTempDescription}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
