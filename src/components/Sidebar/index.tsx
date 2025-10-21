import React, { useRef, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import 'primeicons/primeicons.css';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
	const asideRef = useRef<HTMLElement | null>(null);
	const [pos, setPos] = useState({ left: '0px', top: '0px' });
	const buttonSize = 44;

	useEffect(() => {
		function update() {
			const aside = asideRef.current;
			const header = document.querySelector('header');
			if (!aside || !header) return;
			const aRect = aside.getBoundingClientRect();
			const hRect = header.getBoundingClientRect();

			// vertical: center inside header
			const top = Math.round(hRect.top + (hRect.height - buttonSize) / 2);

			// horizontal: when collapsed center in the small width; when expanded place slightly left of the right edge
			let leftNum: number;
			if (collapsed) {
				// slight left shift reduced to -4 to leave less space at the right
				leftNum = Math.round(aRect.left + aRect.width / 2 - buttonSize / 2);
			} else {
				leftNum = Math.round(aRect.right - buttonSize / 2 - 36); // push more left when expanded
			}

			setPos({ left: `${leftNum}px`, top: `${top}px` });
		}

		update();
		window.addEventListener('resize', update);
		window.addEventListener('scroll', update, true);
		return () => {
			window.removeEventListener('resize', update);
			window.removeEventListener('scroll', update, true);
		};
	}, [collapsed]);

	return (
		<aside ref={asideRef} className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`} aria-hidden={collapsed}>
			{/* toggle button positioned via inline styles computed from bounding rect */}
			<button
				className={`${styles.toggleButton} ${collapsed ? styles.rotated : ''}`}
				onClick={onToggle}
				aria-label="toggle sidebar"
				style={{ position: 'fixed', left: pos.left, top: pos.top }}
			>
				<i className="pi pi-angle-double-left" aria-hidden />
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
