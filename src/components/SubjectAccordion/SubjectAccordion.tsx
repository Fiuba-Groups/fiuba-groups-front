import React, { useState } from 'react';
import styles from './styles.module.scss';

interface SubjectAccordionProps {
  subject: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * Componente Accordion para agrupar ofertas por materia
 */
const SubjectAccordion: React.FC<SubjectAccordionProps> = ({ 
  subject, 
  children,
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.accordion}>
      <div className={styles.dividerContainer}>
        <button 
          className={styles.subjectButton} 
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
        >
          <i className={`pi ${isExpanded ? 'pi-chevron-down' : 'pi-chevron-right'}`} />
          <span className={styles.subjectName}>{subject}</span>
        </button>
        <div className={styles.line} />
      </div>
      
      {isExpanded && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SubjectAccordion;

