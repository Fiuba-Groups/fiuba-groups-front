import { useState, useEffect } from "react";
import { ArrowLeft, Users, Calendar, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createGroupOffer } from "../../services/groupOffersService";
import  styles from "./CreateGroupOffer.module.scss";

const CreateGroupOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editMode, offerData } = location.state || {};

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    cathedra: "",
    groupSize: "",
    duration: "",
    terms: "",
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (editMode && offerData) {
      setFormData({
        title: offerData.title || "",
        description: offerData.description || "",
        subject: offerData.subject || "",
        cathedra: offerData.cathedra || "",
        groupSize: offerData.totalSlots?.toString() || "",
        duration: "1", // Default duration, could be enhanced
        terms: "", // Could be enhanced with stored terms
      });
    }
  }, [editMode, offerData]);

  // Opciones de materias disponibles
  const subjectOptions = [
    { value: "1", label: "Análisis Matemático II", cathedras: ["García", "Pérez"] },
    { value: "2", label: "Álgebra Lineal", cathedras: ["Rodríguez", "Gómez"] },
    { value: "3", label: "Física I", cathedras: ["López", "Martínez"] },
    { value: "4", label: "Química Orgánica", cathedras: ["Fernández", "Silva"] },
    { value: "5", label: "Programación I", cathedras: ["Silva", "López"] },
    { value: "6", label: "Estadística y Probabilidades", cathedras: ["Mendoza", "Vega"] },
    { value: "7", label: "Cálculo Numérico", cathedras: ["Ramírez"] },
    { value: "8", label: "Economía Política", cathedras: ["Gutiérrez", "Moreno"] },
  ];

  // Función para mapear materia+cátedra a courseOfferingId
  const getCourseOfferingId = (subject: string, cathedra: string): number => {
    const subjectOption = subjectOptions.find(s => s.value === subject);
    if (!subjectOption) return 1; // default

    const cathedraIndex = subjectOption.cathedras.indexOf(cathedra);
    if (cathedraIndex === -1) return parseInt(subject); // default to first cathedra

    // Map to courseOfferingId (1-15 as defined in the service)
    return parseInt(subject) + cathedraIndex;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {

  };

  const handlePublish = async () => {
    if (!formData.title || !formData.description || !formData.groupSize || !formData.subject) {
      setPublishError("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      const courseOfferingId = getCourseOfferingId(formData.subject, formData.cathedra);

      if (editMode && offerData) {
        // Modo edición: actualizar la oferta existente
        const GROUPS_STORAGE_KEY = 'fiuba_group_offers';
        const allGroups = JSON.parse(localStorage.getItem(GROUPS_STORAGE_KEY) || '[]');
        const groupIndex = allGroups.findIndex((g: any) => g.id === offerData.id);

        if (groupIndex !== -1) {
          // Actualizar la oferta existente
          allGroups[groupIndex] = {
            ...allGroups[groupIndex],
            title: formData.title,
            description: formData.description,
            subject: subjectOptions.find(s => s.value === formData.subject)?.label || formData.subject,
            cathedra: formData.cathedra,
            totalSlots: parseInt(formData.groupSize),
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(allGroups));
        }
      } else {
        // Modo creación: crear nueva oferta
        await createGroupOffer({
          title: formData.title,
          description: formData.description,
          courseOfferingId: courseOfferingId,
          maxMembers: parseInt(formData.groupSize),
          creatorStudentRegister: 12345, // TODO: Obtener del contexto de autenticación
        });
      }

      // Navegar de vuelta a la lista de búsquedas
      navigate("/my-searches");
    } catch (error) {
      console.error("Error al publicar grupo:", error);
      setPublishError("Error al publicar el grupo. Inténtalo de nuevo.");
    } finally {
      setIsPublishing(false);
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
                onClick={() => navigate(editMode ? "/my-searches" : "/home")}
              >
                <ArrowLeft />
              </button>
              <div className={styles.headerText}>
                <h1>{editMode ? 'Editar Grupo de Estudio' : 'Crear Grupo de Estudio'}</h1>
                <p>{editMode ? 'Modificá los detalles de tu grupo' : 'Publicá un nuevo grupo para encontrar compañeros'}</p>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? (editMode ? "Actualizando..." : "Publicando...") : (editMode ? "Actualizar Grupo" : "Publicar Grupo")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {publishError && (
        <div className={styles.errorBanner}>
          <p>{publishError}</p>
        </div>
      )}

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Info />
                  Información del Grupo
                </h2>
                <p className={styles.cardDescription}>Seleccioná la materia y contanos sobre el grupo de estudio</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.gridTwo}>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Materia *</label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                    >
                      <option value="">Seleccionar materia</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="cathedra">Cátedra</label>
                    <select
                      id="cathedra"
                      value={formData.cathedra}
                      onChange={(e) => handleInputChange("cathedra", e.target.value)}
                      disabled={!formData.subject}
                    >
                      <option value="">Seleccionar cátedra</option>
                      {formData.subject && subjectOptions
                        .find(s => s.value === formData.subject)
                        ?.cathedras.map((cathedra) => (
                          <option key={cathedra} value={cathedra}>
                            {cathedra}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Nombre del Grupo *</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g., Grupo de práctica Álgebra Lineal"
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
                className={`${styles.button} ${styles.primary}`}
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? (editMode ? "Actualizando..." : "Publicando...") : (editMode ? "Actualizar" : "Publicar")}
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
