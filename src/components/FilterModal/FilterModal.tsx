import React from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  slotFilter: 'all' | 'available' | 'full';
  onSlotFilterChange: (filter: 'all' | 'available' | 'full') => void;
  subjectFilter: string;
  onSubjectFilterChange: (filter: string) => void;
  semesterFilter: string;
  onSemesterFilterChange: (filter: string) => void;
  cathedraFilter: string;
  onCathedraFilterChange: (filter: string) => void;
  availableSubjects: string[];
  availableSemesters: string[];
  availableCathedras: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onClear,
  onApply,
  slotFilter,
  onSlotFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  cathedraFilter,
  onCathedraFilterChange,
  availableSubjects,
  availableSemesters,
  availableCathedras,
}) => {
  if (!isOpen) return null;

  const portalTarget = document.getElementById('modal-root') || document.body;

  const content = (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Filtrar ofertas de grupo</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.filterSection}>
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>Disponibilidad:</span>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="slotFilter"
                    value="all"
                    checked={slotFilter === 'all'}
                    onChange={(e) => onSlotFilterChange(e.target.value as 'all' | 'available' | 'full')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>Todo</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="slotFilter"
                    value="available"
                    checked={slotFilter === 'available'}
                    onChange={(e) => onSlotFilterChange(e.target.value as 'all' | 'available' | 'full')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>Con cupo</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="slotFilter"
                    value="full"
                    checked={slotFilter === 'full'}
                    onChange={(e) => onSlotFilterChange(e.target.value as 'all' | 'available' | 'full')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>Llenos</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>Materia:</span>
              <select
                value={subjectFilter}
                onChange={(e) => onSubjectFilterChange(e.target.value)}
                className={styles.selectInput}
              >
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'Todas las materias' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>Cuatrimestre:</span>
              <select
                value={semesterFilter}
                onChange={(e) => onSemesterFilterChange(e.target.value)}
                className={styles.selectInput}
              >
                {availableSemesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester === 'all' ? 'Todos los cuatrimestres' : semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>Cátedra:</span>
              <select
                value={cathedraFilter}
                onChange={(e) => onCathedraFilterChange(e.target.value)}
                className={styles.selectInput}
              >
                {availableCathedras.map((cathedra) => (
                  <option key={cathedra} value={cathedra}>
                    {cathedra === 'all' ? 'Todas las cátedras' : cathedra}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.clearButton}
            onClick={onClear}
          >
            Limpiar
          </button>
          <button
            className={styles.applyButton}
            onClick={onApply}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalTarget);
};

export default FilterModal;
