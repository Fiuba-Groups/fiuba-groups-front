import { useState, useEffect } from 'react';
import { Subject } from '../types/subject';
import { fetchSubjects } from '../services/subjectsService';

/**
 * Estado del hook useSubjects
 */
export interface UseSubjectsResult {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook personalizado para manejar las materias disponibles
 * @returns Estado y métodos para manejar las materias
 */
export const useSubjects = (): UseSubjectsResult => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const subjectsData = await fetchSubjects();
      setSubjects(subjectsData);
    } catch (err) {
      setError('Error al cargar las materias');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const refetch = async () => {
    await loadSubjects();
  };

  return {
    subjects,
    loading,
    error,
    refetch,
  };
};
