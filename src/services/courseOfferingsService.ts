import { apiFetch } from './authService';

const API_BASE_URL = 'http://localhost:8080';

/**
 * Representa un Course Offering del backend
 */
export interface CourseOffering {
  id: number;
  quarter: string;
  year: string;
  courseId: number;
  courseEntity?: {
    id: number;
    commission: string;
    active: boolean;
    subjectCode: string;
    subject?: {
      code: string;
      name: string;
      department: string;
    };
  };
}

/**
 * Opción de materia para el selector del frontend
 */
export interface SubjectOption {
  value: string;  // courseOfferingId
  label: string;  // Nombre de la materia
  cathedra: string;  // Nombre de la cátedra
  semester: string;  // Cuatrimestre
}

/**
 * Obtiene todos los course offerings del backend
 */
export const fetchCourseOfferings = async (): Promise<CourseOffering[]> => {
  return apiFetch<CourseOffering[]>(`${API_BASE_URL}/courseOfferings`);
};

/**
 * Convierte los course offerings del backend a opciones para el selector
 */
export const mapCourseOfferingsToOptions = (offerings: CourseOffering[]): SubjectOption[] => {
  return offerings
    .filter(offering => offering.courseEntity?.subject)
    .map(offering => ({
      value: offering.id.toString(),
      label: offering.courseEntity!.subject!.name,
      cathedra: offering.courseEntity!.commission,
      semester: `${offering.quarter} ${offering.year}`,
    }));
};

/**
 * Agrupa las opciones por materia para mostrar en el selector
 */
export interface GroupedSubjectOption {
  subjectName: string;
  cathedras: { value: string; cathedra: string; semester: string }[];
}

export const groupOptionsBySubject = (options: SubjectOption[]): GroupedSubjectOption[] => {
  const grouped = new Map<string, GroupedSubjectOption>();

  for (const option of options) {
    if (!grouped.has(option.label)) {
      grouped.set(option.label, {
        subjectName: option.label,
        cathedras: [],
      });
    }
    grouped.get(option.label)!.cathedras.push({
      value: option.value,
      cathedra: option.cathedra,
      semester: option.semester,
    });
  }

  return Array.from(grouped.values());
};
