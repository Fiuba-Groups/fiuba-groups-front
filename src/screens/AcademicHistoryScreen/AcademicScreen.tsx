import { useState } from "react";
import styles from './AcademicScreen.module.scss';
import AppShell from '../../components/Shell';

interface AcademicNote {
  id: string;
  title: string;
  date: string;
  type: string;
  file?: File;
}

interface Subject {
  id: string;
  name: string;
  grade: number;
  date: string;
  semester: string;
  credits: number;
}

export default function AcademicScreen() {
  const [notes, setNotes] = useState<AcademicNote[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    grade: '',
    semester: '',
    credits: ''
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newNotes: AcademicNote[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: file.name,
      date: new Date().toLocaleDateString('es-ES'),
      type: file.type || "document",
      file: file,
    }));
    setNotes([...notes, ...newNotes]);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.name && newSubject.grade && newSubject.semester) {
      const subject: Subject = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSubject.name,
        grade: parseFloat(newSubject.grade),
        date: new Date().toLocaleDateString('es-ES'),
        semester: newSubject.semester,
        credits: parseFloat(newSubject.credits) || 0
      };
      setSubjects([...subjects, subject]);
      setNewSubject({ name: '', grade: '', semester: '', credits: '' });
      setShowSubjectForm(false);
    }
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return '#22c55e'; // Verde para excelente
    if (grade >= 7) return '#3b82f6'; // Azul para bien
    if (grade >= 6) return '#f59e0b'; // Amarillo para aprobado
    return '#ef4444'; // Rojo para desaprobado
  };

  return (
    <AppShell>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Historial Académico</h1>
          <p className={styles.subtitle}>Sube y gestiona tus apuntes, tareas y documentos académicos</p>
        </div>

        <div className={styles.content}>
          {/* Sección de Materias Cursadas */}
          <div className={styles.subjectsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Materias Cursadas</h2>
              <button 
                className={styles.addButton}
                onClick={() => setShowSubjectForm(true)}
              >
                <i className="pi pi-plus" />
                Agregar Materia
              </button>
            </div>

            {showSubjectForm && (
              <div className={styles.formOverlay}>
                <form className={styles.subjectForm} onSubmit={handleSubjectSubmit}>
                  <div className={styles.formHeader}>
                    <h3>Agregar Nueva Materia</h3>
                    <button 
                      type="button" 
                      className={styles.closeFormButton}
                      onClick={() => setShowSubjectForm(false)}
                    >
                      <i className="pi pi-times" />
                    </button>
                  </div>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label>Nombre de la Materia *</label>
                      <input
                        type="text"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                        placeholder="ej. Análisis Matemático II"
                        required
                      />
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <label>Nota Final *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={newSubject.grade}
                        onChange={(e) => setNewSubject({...newSubject, grade: e.target.value})}
                        placeholder="ej. 8.5"
                        required
                      />
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <label>Cuatrimestre *</label>
                      <input
                        type="text"
                        value={newSubject.semester}
                        onChange={(e) => setNewSubject({...newSubject, semester: e.target.value})}
                        placeholder="ej. 2C 2024"
                        required
                      />
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <label>Créditos</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={newSubject.credits}
                        onChange={(e) => setNewSubject({...newSubject, credits: e.target.value})}
                        placeholder="ej. 6"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button type="button" onClick={() => setShowSubjectForm(false)} className={styles.cancelButton}>
                      Cancelar
                    </button>
                    <button type="submit" className={styles.submitButton}>
                      Agregar Materia
                    </button>
                  </div>
                </form>
              </div>
            )}

            {subjects.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="pi pi-graduation-cap" />
                <p>Aún no has agregado ninguna materia</p>
                <p>Comienza agregando las materias que ya cursaste</p>
              </div>
            ) : (
              <div className={styles.subjectsGrid}>
                {subjects.map((subject) => (
                  <div key={subject.id} className={styles.subjectCard}>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeSubject(subject.id)}
                      aria-label="Eliminar materia"
                    >
                      <i className="pi pi-times" />
                    </button>
                    
                    <div className={styles.subjectHeader}>
                      <i className="pi pi-book" style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />
                      <div 
                        className={styles.gradeCircle} 
                        style={{ backgroundColor: getGradeColor(subject.grade) }}
                      >
                        {subject.grade}
                      </div>
                    </div>
                    
                    <div className={styles.subjectContent}>
                      <h3 className={styles.subjectName}>{subject.name}</h3>
                      <div className={styles.subjectMeta}>
                        <div className={styles.metaItem}>
                          <i className="pi pi-calendar" />
                          <span>{subject.semester}</span>
                        </div>
                        {subject.credits > 0 && (
                          <div className={styles.metaItem}>
                            <i className="pi pi-star" />
                            <span>{subject.credits} créditos</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección de Documentos */}
          <div
            className={`${styles.uploadZone} ${dragActive ? styles.dragActive : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleChange}
              className={styles.fileInput}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className={styles.uploadLabel}>
              <i className="pi pi-cloud-upload" style={{ fontSize: '3rem', color: 'var(--primary-color)' }} />
              <span className={styles.uploadText}>
                Arrastra y suelta archivos aquí o <span className={styles.uploadLink}>explorar</span>
              </span>
              <span className={styles.uploadHint}>PDF, DOC, TXT, JPG, PNG hasta 10MB</span>
            </label>
          </div>

          <div className={styles.notesSection}>
            <h2 className={styles.sectionTitle}>Documentos y Archivos</h2>
            {notes.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="pi pi-file" />
                <p>Aún no has subido ningún documento</p>
              </div>
            ) : (
              <div className={styles.notesGrid}>
                {notes.map((note) => (
                  <div key={note.id} className={styles.noteCard}>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeNote(note.id)}
                      aria-label="Eliminar documento"
                    >
                      <i className="pi pi-times" />
                    </button>
                    <i className="pi pi-file-pdf" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
                    <div className={styles.noteContent}>
                      <h3 className={styles.noteTitle}>{note.title}</h3>
                      <div className={styles.noteMeta}>
                        <i className="pi pi-calendar" />
                        <span>{note.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}