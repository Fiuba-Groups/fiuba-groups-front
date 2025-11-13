import { useState } from "react";
import { ArrowLeft, Users, DollarSign, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import  styles from "./createOffer.module.scss";

const CreateGroupOffer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    groupSize: "",
    duration: "",
    terms: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {

  };

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.groupSize) {

      return;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInner}>
            <div className={styles.leftSection}>
              <button
                className={styles.backButton}
                onClick={() => navigate("/home")}
              >
                <ArrowLeft />
              </button>
              <div className={styles.headerText}>
                <h1>Crear Grupo de Estudio</h1>
                <p>Publicá un nuevo grupo para encontrar compañeros</p>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.outline} ${styles.draftButton}`}
                onClick={handleSaveDraft}
              >
                Guardar Borrador
              </button>
              <button className={`${styles.button} ${styles.primary}`} onClick={handlePublish}>
                Publicar Grupo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Info />
                  Información Básica
                </h2>
                <p className={styles.cardDescription}>Contanos sobre el grupo de estudio</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Nombre de la Materia o Tema *</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g., Álgebra II - Práctica 3"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="description">Descripción *</label>
                  <textarea
                    id="description"
                    placeholder="Describí los temas a tratar, el objetivo del grupo, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Users />
                  Detalles del Grupo
                </h2>
                <p className={styles.cardDescription}>Definí los detalles de tu grupo</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.gridTwo}>
                  <div className={styles.formGroup}>
                    <label htmlFor="groupSize">Tamaño del Grupo *</label>
                    <input
                      id="groupSize"
                      type="number"
                      placeholder="10"
                      value={formData.groupSize}
                      onChange={(e) => handleInputChange("groupSize", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="duration">Duración o Frecuencia (Opcional)</label>
                    <input
                      id="duration"
                      type="text"
                      placeholder="e.g., Semanal, Lunes y Miércoles 19hs"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Calendar />
                  Términos y Requisitos
                </h2>
                <p className={styles.cardDescription}>Agregá cualquier detalle importante</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.formGroup}>
                  <label htmlFor="terms">Requisitos (Opcional)</label>
                  <textarea
                    id="terms"
                    placeholder="e.g., Tener conocimientos de análisis matemático I"
                    value={formData.terms}
                    onChange={(e) => handleInputChange("terms", e.target.value)}
                    style={{ minHeight: '100px' }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className={styles.mobileActions}>
              <button
                className={`${styles.button} ${styles.outline}`}
                onClick={handleSaveDraft}
              >
                Guardar Borrador
              </button>
              <button className={`${styles.button} ${styles.primary}`} onClick={handlePublish}>
                Publicar
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className={styles.previewSection}>
            <div className={`${styles.card} ${styles.previewCard}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Vista Previa</h2>
                <p className={styles.cardDescription}>Así se verá tu publicación</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.previewContent}>
                  {formData.title ? (
                    <h3>{formData.title}</h3>
                  ) : (
                    <div className={`${styles.skeleton} ${styles.title}`} />
                  )}

                  {formData.description ? (
                    <p className={styles.description}>{formData.description}</p>
                  ) : (
                    <div>
                      <div className={`${styles.skeleton} ${styles.text}`} />
                      <div className={`${styles.skeleton} ${styles.text}`} />
                    </div>
                  )}

                  <div className={styles.stats}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>
                        <Users />
                        <span>Tamaño del Grupo</span>
                      </div>
                      {formData.groupSize ? (
                        <p className={styles.statValue}>{formData.groupSize}</p>
                      ) : (
                        <div className={`${styles.skeleton} ${styles.price}`} />
                      )}
                    </div>
                  </div>

                  {formData.duration && (
                    <div className={styles.section}>
                      <div className={styles.sectionLabel}>
                        <Calendar />
                        <span>Duración</span>
                      </div>
                      <p className={styles.sectionValue}>{formData.duration}</p>
                    </div>
                  )}

                  {formData.terms && (
                    <div className={styles.section}>
                      <p className={styles.terms}>{formData.terms}</p>
                    </div>
                  )}

                  <div className={styles.previewActions}>
                    <button className={`${styles.button} ${styles.outline}`}>
                      Ver más
                    </button>
                    <button className={`${styles.button} ${styles.primary}`}>
                      Solicitar unirse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateGroupOffer;
