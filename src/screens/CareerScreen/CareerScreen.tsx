import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Plus, Edit, X, Check } from 'lucide-react';
import styles from './CareerScreen.module.scss';
import AppShell from '../../components/Shell';

interface Career {
  id: string;
  name: string;
  isMain: boolean;
}

export default function CareerScreen() {
  const navigate = useNavigate();

  // Estado para las carreras del usuario
  const [careers, setCareers] = useState<Career[]>([
    {
      id: '1',
      name: 'Ingeniería Informática',
      isMain: true
    }
  ]);

  // Estado para el formulario de agregar/editar carrera
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [formData, setFormData] = useState({
    name: ''
  });

  // Lista de carreras disponibles para agregar
  const availableCareers = [
    'Ingeniería Informática',
    'Ingeniería Electrónica',
    'Ingeniería Mecánica',
    'Ingeniería Civil',
    'Ingeniería Industrial',
    'Ingeniería en Petróleos',
    'Ingeniería Naval',
    'Ingeniería Química',
    'Ingeniería en Alimentos',
    'Licenciatura en Análisis de Sistemas'
  ];


  const handleAddCareer = () => {
    setFormData({
      name: ''
    });
    setEditingCareer(null);
    setShowAddForm(true);
  };

  const handleEditCareer = (career: Career) => {
    setFormData({
      name: career.name
    });
    setEditingCareer(career);
    setShowAddForm(true);
  };

  const handleSaveCareer = () => {
    if (!formData.name.trim()) {
      alert('Por favor selecciona una ingeniería');
      return;
    }

    if (editingCareer) {
      // Editando carrera existente
      setCareers(prev => prev.map(career =>
        career.id === editingCareer.id
          ? { ...career, name: formData.name }
          : career
      ));
    } else {
      // Agregando nueva carrera
      const newCareer: Career = {
        id: Date.now().toString(),
        name: formData.name,
        isMain: careers.length === 0 // Si es la primera carrera, es la principal
      };
      setCareers(prev => [...prev, newCareer]);
    }

    setShowAddForm(false);
    setEditingCareer(null);
    alert('Ingeniería guardada exitosamente');
  };

  const handleDeleteCareer = (careerId: string) => {
    if (careers.length === 1) {
      alert('Debes tener al menos una ingeniería');
      return;
    }

    setCareers(prev => prev.filter(career => career.id !== careerId));
    alert('Ingeniería eliminada');
  };

  const handleSetMainCareer = (careerId: string) => {
    setCareers(prev => prev.map(career => ({
      ...career,
      isMain: career.id === careerId
    })));
    alert('Ingeniería principal actualizada');
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCareer(null);
    setFormData({
      name: ''
    });
  };

  return (
    <AppShell>
      <div className={styles.careerContainer}>
        {/* Header de navegación */}
        <div className={styles.header}>
          <button
            onClick={() => navigate('/profile')}
            className={styles.backButton}
          >
            <ArrowLeft size={16} />
            Volver a ajustes
          </button>
          <h1 className={styles.title}>Mis Carreras - FIUBA</h1>
        </div>

        {/* Lista de carreras actuales */}
        <div className={styles.careersSection}>
          <div className={styles.sectionHeader}>
            <h2>Mis Ingenierías en FIUBA</h2>
            <button
              onClick={handleAddCareer}
              className={styles.addButton}
            >
              <Plus size={16} />
              Agregar Ingeniería
            </button>
          </div>

          <div className={styles.careersList}>
            {careers.map(career => (
              <div key={career.id} className={styles.careerCard}>
                <div className={styles.careerInfo}>
                  <div className={styles.careerHeader}>
                    <GraduationCap className={styles.careerIcon} />
                    <div>
                      <h3 className={styles.careerName}>
                        {career.name}
                        {career.isMain && (
                          <span className={styles.mainBadge}>Principal</span>
                        )}
                      </h3>
                      <p className={styles.facultyName}>FIUBA - Facultad de Ingeniería</p>
                    </div>
                  </div>
                </div>

                <div className={styles.careerActions}>
                  {!career.isMain && (
                    <button
                      onClick={() => handleSetMainCareer(career.id)}
                      className={styles.setMainButton}
                      title="Establecer como carrera principal"
                    >
                      Establecer Principal
                    </button>
                  )}
                  <button
                    onClick={() => handleEditCareer(career)}
                    className={styles.editButton}
                    title="Editar carrera"
                  >
                    <Edit size={16} />
                  </button>
                  {careers.length > 1 && (
                    <button
                      onClick={() => handleDeleteCareer(career.id)}
                      className={styles.deleteButton}
                      title="Eliminar carrera"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal/Formulario para agregar/editar carrera */}
        {showAddForm && (
          <div className={styles.modalOverlay} onClick={handleCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
              <h3>
                {editingCareer ? 'Editar Ingeniería' : 'Agregar Nueva Ingeniería'}
              </h3>
                <button onClick={handleCancel} className={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Ingeniería</label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={styles.selectInput}
                  >
                    <option value="">Seleccionar ingeniería...</option>
                    {availableCareers.map(career => (
                      <option key={career} value={career}>
                        {career}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className={styles.modalFooter}>
                <button onClick={handleCancel} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button onClick={handleSaveCareer} className={styles.saveButton}>
                  <Check size={16} />
                  {editingCareer ? 'Guardar Cambios' : 'Agregar Ingeniería'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h3>¿Por qué tener múltiples carreras?</h3>
              <p>
                Si estás cursando más de una ingeniería o especialización en FIUBA,
                puedes agregar todas tus formaciones académicas para que
                aparezcan en tu perfil y te ayuden a conectar con compañeros
                de diferentes áreas.
              </p>
              <p>
                <strong>Carrera Principal:</strong> Será la que aparezca
                destacada en tu perfil público.
              </p>
            </div>
          </div>
      </div>
    </AppShell>
  );
}
