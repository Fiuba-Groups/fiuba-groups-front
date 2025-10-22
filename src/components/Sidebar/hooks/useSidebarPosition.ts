import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  LOGO_SIZE,
  LOGO_SPACING,
  BUTTON_SIZE,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_PADDING,
} from '../constants';
import { Position, SidebarPosition } from '../types/types';

/**
 * Hook personalizado para manejar el posicionamiento del sidebar
 * Calcula las posiciones del botón toggle y logo basándose en el estado colapsado
 */
export default function useSidebarPosition(collapsed?: boolean): SidebarPosition {
  const asideRef = useRef<HTMLElement | null>(null);
  const [buttonPos, setButtonPos] = useState<Position>({ left: '0px', top: '0px' });
  const [logoPos, setLogoPos] = useState<Position>({ left: '0px', top: '0px' });
  const [titlePos, setTitlePos] = useState<Position>({ left: '0px', top: '0px' });

  const updatePositions = useCallback(() => {
    const aside = asideRef.current;
    const header = document.querySelector('header');
    
    if (!aside || !header) {
      console.warn('Sidebar: No se encontraron elementos aside o header para calcular posiciones');
      return;
    }

    const asideRect = aside.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();

    // Centrar verticalmente dentro del header
    const buttonTop = Math.round(headerRect.top + (headerRect.height - BUTTON_SIZE) / 2);
    
    // Calcular posición del logo (siempre a la izquierda con padding)
    const logoLeft = Math.round(asideRect.left + SIDEBAR_PADDING);
    const logoTop = Math.round(headerRect.top + (headerRect.height - LOGO_SIZE) / 2);

    // Calcular posición del título (entre el logo y el botón)
    const titleLeft = Math.round(logoLeft + LOGO_SIZE + 12); // 12px de separación del logo
    const titleTop = Math.round(headerRect.top + (headerRect.height - 20) / 2); // Altura aproximada del texto

    // Calcular posición del botón según el estado
    let buttonLeft: number;
    if (collapsed) {
      // Cuando está colapsado: centrar en el área visible
      buttonLeft = Math.round(asideRect.left + SIDEBAR_COLLAPSED_WIDTH - BUTTON_SIZE - LOGO_SPACING);
    } else {
      // Cuando está expandido: cerca del borde derecho
      buttonLeft = Math.round(asideRect.right - BUTTON_SIZE / 2 - 36);
    }

    setButtonPos({ left: `${buttonLeft}px`, top: `${buttonTop}px` });
    setLogoPos({ left: `${logoLeft}px`, top: `${logoTop}px` });
    setTitlePos({ left: `${titleLeft}px`, top: `${titleTop}px` });
  }, [collapsed]);

  useLayoutEffect(() => {
    updatePositions();
    
    // Agregar listeners para actualizar posiciones en cambios de ventana
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions, true);
    
    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions, true);
    };
  }, [updatePositions]);

  return { asideRef, buttonPos, logoPos, titlePos };
}
