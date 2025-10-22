import { NavigationItem } from '../types/types';

/**
 * Datos de navegación del sidebar
 * Define los elementos del menú de navegación
 */
export const navigationItems: NavigationItem[] = [
  {
    id: 'search-groups',
    label: 'Buscar grupos',
    icon: 'pi pi-search'
  },
  {
    id: 'create-search',
    label: 'Crear búsqueda',
    icon: 'pi pi-plus'
  },
  {
    id: 'my-searches',
    label: 'Mis búsquedas',
    icon: 'pi pi-list'
  },
  {
    id: 'my-requests',
    label: 'Mis solicitudes',
    icon: 'pi pi-envelope'
  },
  {
    id: 'my-groups',
    label: 'Mis grupos',
    icon: 'pi pi-users'
  },
  {
    id: 'settings',
    label: 'Ajustes',
    icon: 'pi pi-cog'
  }
];
