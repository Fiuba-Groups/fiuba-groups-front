import { useState, useEffect } from 'react';
import { Course } from '../types/course';
import { fetchCourses } from '../services/coursesService';

/**
 * Estado del hook useCourses
 */
export interface UseCoursesResult {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getCoursesBySubject: (subjectCode: string) => Course[];
}

/**
 * Hook personalizado para manejar las cátedras disponibles
 * @returns Estado y métodos para manejar las cátedras
 */
export const useCourses = (): UseCoursesResult => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await fetchCourses();
      setCourses(coursesData);
    } catch (err) {
      setError('Error al cargar las cátedras');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const refetch = async () => {
    await loadCourses();
  };

  const getCoursesBySubject = (subjectCode: string): Course[] => {
    return courses.filter(course => course.subjectCode === subjectCode && course.active);
  };

  return {
    courses,
    loading,
    error,
    refetch,
    getCoursesBySubject,
  };
};
