import React, { useState } from 'react';
import styles from './styles.module.scss';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
}

/**
 * Componente barra de búsqueda
 * Permite buscar y filtrar contenido
 */
const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder, 
  onSearch,
  onChange 
}) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.searchContainer}>
        <i className="pi pi-search" />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
        />
        {searchValue && (
          <button 
            type="button" 
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            <i className="pi pi-times" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

