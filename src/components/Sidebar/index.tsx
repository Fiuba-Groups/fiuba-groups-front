import React from 'react';
import styles from './styles.module.scss';
import 'primeicons/primeicons.css';
import useSidebarPosition from './useSidebarPosition';
import { LOGO_SRC, AVATAR_SIZE } from './constants';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}
 

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
	const { asideRef, buttonPos, avatarPos } = useSidebarPosition(collapsed);

	return (
		<aside ref={asideRef} className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`} aria-hidden={collapsed}>
			{/* avatar fixed to the left of the toggle; visible in both collapsed and expanded */}
			<img
				className={styles.avatar}
				src={LOGO_SRC}
				alt="logo"
				// use a stable style object so React doesn't recreate it every render
				style={{ position: 'fixed', left: avatarPos.left, top: avatarPos.top, width: AVATAR_SIZE, height: AVATAR_SIZE }}
			/>

			{/* toggle button positioned via inline styles computed from bounding rect */}
			<button
				className={`${styles.toggleButton} ${collapsed ? styles.rotated : ''}`}
				onClick={onToggle}
				aria-label="toggle sidebar"
				style={{ position: 'fixed', left: buttonPos.left, top: buttonPos.top }}
			>
				<i className="pi pi-angle-double-right" aria-hidden />
			</button>

			{!collapsed && (
				<nav>
					<ul>
						<li>Inicio</li>
						<li>Grupos</li>
						<li>Mi perfil</li>
					</ul>
				</nav>
			)}
		</aside>
	);
}
