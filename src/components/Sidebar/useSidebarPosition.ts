import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  AVATAR_SIZE,
  AVATAR_SPACING,
  BUTTON_SIZE,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_PADDING,
} from './constants';

export interface Position {
  left: string;
  top: string;
}

export default function useSidebarPosition(collapsed?: boolean) {
  const asideRef = useRef<HTMLElement | null>(null);
  const [buttonPos, setButtonPos] = useState<Position>({ left: '0px', top: '0px' });
  const [avatarPos, setAvatarPos] = useState<Position>({ left: '0px', top: '0px' });

  const updatePositions = useCallback(() => {
    const aside = asideRef.current;
    const header = document.querySelector('header');
    if (!aside || !header) return;
    const aRect = aside.getBoundingClientRect();
    const hRect = header.getBoundingClientRect();

    // vertical center inside header
    const top = Math.round(hRect.top + (hRect.height - BUTTON_SIZE) / 2);

    const collapsedAvatarLeft = Math.round(aRect.left + SIDEBAR_PADDING);
    let buttonLeftNum: number;

    if (collapsed) {
      buttonLeftNum = Math.round(aRect.left + SIDEBAR_COLLAPSED_WIDTH - BUTTON_SIZE - AVATAR_SPACING);
    } else {
      buttonLeftNum = Math.round(aRect.right - BUTTON_SIZE / 2 - 36);
    }

    setButtonPos({ left: `${buttonLeftNum}px`, top: `${top}px` });
    const avatarTopNum = Math.round(hRect.top + (hRect.height - AVATAR_SIZE) / 2);
    setAvatarPos({ left: `${collapsedAvatarLeft}px`, top: `${avatarTopNum}px` });
  }, [collapsed]);

  useLayoutEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions, true);
    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions, true);
    };
  }, [updatePositions]);

  return { asideRef, buttonPos, avatarPos } as const;
}
