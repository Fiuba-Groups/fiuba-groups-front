import styles from './styles.module.scss';
import AppShell from '../../components/Shell';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import SearchBar from '../../components/SearchBar/index';

/**
 * Función para crear una nueva publicación
 * Maneja la lógica para abrir modal o navegar a crear publicación
 */
const handleCreatePost = () => {
  console.log('Crear nueva publicación');
  // Aquí iría la lógica para abrir modal o navegar a crear publicación
};

/**
 * Función para manejar la búsqueda
 * @param value - Valor ingresado en el buscador
 */
const handleSearch = (value: string) => {
  console.log('Buscando:', value);
  // TODO: lógica para filtrar/buscar grupos
};

/**
 * Función para manejar el filtrado
 */
const handleFilter = () => {
  console.log('Filtrar');
  // TODO: lógica para abrir modal de filtros
};

/**
 * Componente principal de la pantalla de ofertas de grupos
 * Maneja la lógica de la pantalla y renderiza los componentes
 */
export default function GroupOffers() {
  return (
    <AppShell>
      <div className={styles.searchGroupOffersContent}> 
        <div className={styles.searchGroupOffersContentHeader}>
          <SearchBar placeholder="Buscar grupos" onSearch={handleSearch} />
          <button className={styles.filterButton} onClick={handleFilter}>
            <i className="pi pi-filter" />
            <span>Filtrar</span>
          </button>
        </div>
        <FloatingButton 
          onClick={handleCreatePost}
          icon="pi pi-plus"
          label="Crear búsqueda"
        />
      </div>
    </AppShell>
  );
}