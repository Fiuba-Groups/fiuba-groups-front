import React, { useState } from 'react';
import { Star, ArrowLeft, Send, User } from 'lucide-react';
import styles from './RankTeam.module.scss';
import AppShell from '../../components/Shell';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

interface Teammate {
  id: number;
  name: string;
  avatar?: string;
  career: string;
  rating: number;
}

export default function RankTeam() {
  const [teammates] = useState<Teammate[]>([
    { id: 1, name: "Sarah Johnson", avatar: "", career: "Ingeniería en Informática", rating: 0 },
    { id: 2, name: "Michael Chen", avatar: "", career: "Licenciatura en Análisis de Sistemas", rating: 0 },
    { id: 3, name: "Emily Rodriguez", avatar: "", career: "Ingeniería Industrial", rating: 0 },
    { id: 4, name: "David Park", avatar: "", career: "Ingeniería Electrónica", rating: 0 },
  ]);

  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [hoveredStars, setHoveredStars] = useState<{ [key: number]: number }>({});
  const [selectedTraits, setSelectedTraits] = useState<{ [key: number]: string[] }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const positiveTraits = [
    { id: 'sociable', label: 'Sociable' },
    { id: 'cumplidor', label: 'Cumplidor' },
    { id: 'puntual', label: 'Puntual' },
  ];

  const negativeTraits = [
    { id: 'impuntual', label: 'Impuntual' },
    { id: 'desorganizado', label: 'Desorganizado' },
    { id: 'poco-participativo', label: 'Poco Participativo' },
  ];

  const handleRating = (teammateId: number, rating: number) => {
    setRatings({ ...ratings, [teammateId]: rating });
  };

  const toggleTrait = (teammateId: number, traitId: string) => {
    const currentTraits = selectedTraits[teammateId] || [];
    const newTraits = currentTraits.includes(traitId)
      ? currentTraits.filter(t => t !== traitId)
      : [...currentTraits, traitId];
    setSelectedTraits({ ...selectedTraits, [teammateId]: newTraits });
  };

  const isTraitSelected = (teammateId: number, traitId: string) => {
    return (selectedTraits[teammateId] || []).includes(traitId);
  };

  const handleSubmit = async () => {
    const allRated = teammates.every(t => ratings[t.id] > 0);
    if (!allRated) {
      // En tu app podrías mostrar un toast o notificación
      alert("Por favor califica a todos los compañeros antes de enviar");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Aquí harías la llamada a tu API para enviar las calificaciones
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
      alert("¡Calificaciones enviadas exitosamente!");
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error sending ratings:', error);
      alert("Error al enviar las calificaciones. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <AppShell>
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={goBack}
            type="button"
          >
            <ArrowLeft className={styles.backIcon} />
          </button>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Calificar Compañeros</h1>
            <p className={styles.subtitle}>
              Comparte tu experiencia con los miembros de tu grupo de estudio
            </p>
          </div>
        </div>

        <div className={styles.teammatesList}>
          {teammates.map((teammate) => (
            <div key={teammate.id} className={styles.teammateCard}>
              <div className={styles.teammateInfo}>
                <div className={styles.avatar}>
                  {teammate.avatar ? (
                    <img src={teammate.avatar} alt={teammate.name} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <User className={styles.avatarIcon} />
                      <span className={styles.initials}>{getInitials(teammate.name)}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.teammateDetails}>
                  <h3 className={styles.teammateName}>{teammate.name}</h3>
                  <p className={styles.teammateCareer}>{teammate.career}</p>
                </div>
              </div>

              <div className={styles.ratingSection}>
                <label className={styles.ratingLabel}>Calificación</label>
                <div className={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(teammate.id, star)}
                      onMouseEnter={() => 
                        setHoveredStars({ ...hoveredStars, [teammate.id]: star })
                      }
                      onMouseLeave={() => 
                        setHoveredStars({ ...hoveredStars, [teammate.id]: 0 })
                      }
                      className={styles.starButton}
                    >
                      <Star
                        className={`${styles.star} ${
                          star <= (hoveredStars[teammate.id] || ratings[teammate.id] || 0)
                            ? styles.starFilled
                            : styles.starEmpty
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.traitsSection}>
                <label className={styles.traitsLabel}>Características (opcional)</label>
                
                <div className={styles.traitsGroup}>
                  <div className={styles.traitsSubgroup}>
                    <span className={styles.traitsGroupLabel}>Positivas</span>
                    <div className={styles.traitsGrid}>
                      {positiveTraits.map((trait) => (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => toggleTrait(teammate.id, trait.id)}
                          className={`${styles.traitButton} ${
                            isTraitSelected(teammate.id, trait.id)
                              ? styles.traitButtonSelectedPositive
                              : styles.traitButtonPositive
                          }`}
                        >
                          {trait.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.traitsSubgroup}>
                    <span className={styles.traitsGroupLabel}>Negativas</span>
                    <div className={styles.traitsGrid}>
                      {negativeTraits.map((trait) => (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => toggleTrait(teammate.id, trait.id)}
                          className={`${styles.traitButton} ${
                            isTraitSelected(teammate.id, trait.id)
                              ? styles.traitButtonSelectedNegative
                              : styles.traitButtonNegative
                          }`}
                        >
                          {trait.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className={styles.submitSection}>
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            <Send className={styles.submitIcon} />
            Enviar Calificaciones
          </button>
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmSubmit}
          title="Confirmar Envío"
          message="¿Estás seguro de que quieres enviar estas calificaciones? Esta acción no se puede deshacer."
          confirmText="Enviar"
          cancelText="Cancelar"
          isLoading={isSubmitting}
        />
      </div>
    </AppShell>
  );
}