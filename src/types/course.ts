import { Subject } from './subject';

/**
 * Tipo para representar un curso/cátedra
 */
export interface Course {
  id: number;
  commission: string;
  active: boolean;
  subjectCode: string;
  subject: Subject;
}
