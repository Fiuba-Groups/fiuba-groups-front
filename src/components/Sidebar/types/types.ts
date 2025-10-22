// Interfaces para el componente Sidebar

export interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface Position {
  left: string;
  top: string;
}

export interface SidebarPosition {
  asideRef: React.RefObject<HTMLElement | null>;
  buttonPos: Position;
  logoPos: Position;
  titlePos: Position;
}

export interface NavigationItem {
  id: string;
  label: string;
  onClick?: () => void;
  icon?: string;
}

export interface SidebarNavigationProps {
  items: NavigationItem[];
  collapsed?: boolean;
}
