import React, { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

interface SidebarProps {
	collapsed?: boolean;
	onToggle?: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
	const asideRef = useRef<HTMLElement | null>(null);
	const btnRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		function positionToggle() {
			const aside = asideRef.current;
			const btn = btnRef.current;
			if (!aside || !btn) return;

			const sidebarRect = aside.getBoundingClientRect();

			// place button at the right edge of the sidebar (centered vertically on header)
			const left = sidebarRect.right - btn.offsetWidth / 2;
			btn.style.left = `${Math.round(left)}px`;

			// try to center vertically aligned with header if header exists
			const header = document.querySelector('header');
			if (header) {
				const headerRect = header.getBoundingClientRect();
				const top = headerRect.top + headerRect.height / 2 - btn.offsetHeight / 2;
				btn.style.top = `${Math.round(top)}px`;
			} else {
				// fallback: position relative to sidebar top
				const top = sidebarRect.top + 16;
				btn.style.top = `${Math.round(top)}px`;
			}
		}

		// initial position
		positionToggle();
		// reposition on resize and scroll
		window.addEventListener('resize', positionToggle);
		window.addEventListener('scroll', positionToggle, true);

		return () => {
			window.removeEventListener('resize', positionToggle);
			window.removeEventListener('scroll', positionToggle, true);
		};
	}, [collapsed]);

	return (
		<aside
			ref={asideRef as any}
			className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
			aria-hidden={collapsed}
		>
			{/* toggle button positioned by JS to avoid clipping */}
			<button ref={btnRef} className={styles.toggleButton} onClick={onToggle} aria-label="toggle sidebar">
				☰
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
