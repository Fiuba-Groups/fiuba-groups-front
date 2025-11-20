import { NavigationItem } from '../types/types';

/**
 * Datos de navegación del sidebar
 * Define los elementos del menú de navegación con sus rutas correspondientes
 */
export const navigationItems: NavigationItem[] = [
  {
    id: 'search-groups',
    label: 'Buscar grupos',
    icon: 'pi pi-search',
    route: '/home'
  },
  {
    id: 'create-search',
    label: 'Crear búsqueda',
    icon: 'pi pi-plus', 
    route: '/new-group-search'
  },
  {
    id: 'my-searches',
    label: 'Mis búsquedas',
    icon: 'pi pi-list',
    route: '/my-searches'
  },
  {
    id: 'my-requests',
    label: 'Mis solicitudes',
    icon: 'pi pi-envelope',
    route: '/my-requests'
  },
  {
    id: 'my-groups',
    label: 'Mis grupos',
    icon: 'pi pi-users',
    route: '/my-groups'
  },
  {
    id: 'my-friends',
    label: 'Mis amigos',
    icon: 'pi pi-user',
    route: '/my-friends'
  },
  {
    id: 'settings',
    label: 'Ajustes',
    icon: 'pi pi-cog',
    route: '/profile'
  }
];
