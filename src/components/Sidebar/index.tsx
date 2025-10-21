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
	const avatarSize = 40;
	const avatarSpacing = 8; // space between avatar and toggle
	const [avatarPos, setAvatarPos] = useState({ left: '0px', top: '0px' });

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
			let buttonLeftNum: number;
			let avatarLeftNum: number;
			const padding = 8; // padding inside the sidebar for tight cases
			const totalNeeded = avatarSize + avatarSpacing + buttonSize + padding * 2;

			if (collapsed && aRect.width < totalNeeded) {
				// not enough room to place avatar left of the button; pack them side-by-side inside the collapsed width
				// place avatar at left padding, and button just to its right
				avatarLeftNum = Math.round(aRect.left + padding);
				buttonLeftNum = Math.round(avatarLeftNum + avatarSize + avatarSpacing);
			} else if (collapsed) {
				// when collapsed but there's enough width, center the pair inside the sidebar area
				const center = Math.round(aRect.left + aRect.width / 2);
				buttonLeftNum = Math.round(center - buttonSize / 2 + avatarSize / 2);
				avatarLeftNum = Math.round(buttonLeftNum - avatarSize - avatarSpacing);
			} else {
				// expanded: keep the button near the right edge of the sidebar and avatar to its left
				buttonLeftNum = Math.round(aRect.right - buttonSize / 2 - 36); // push more left when expanded
				avatarLeftNum = Math.round(buttonLeftNum - avatarSize - avatarSpacing);
			}

			setPos({ left: `${buttonLeftNum}px`, top: `${top}px` });
			const avatarTopNum = Math.round(hRect.top + (hRect.height - avatarSize) / 2);
			setAvatarPos({ left: `${avatarLeftNum}px`, top: `${avatarTopNum}px` });
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
			{/* avatar fixed to the left of the toggle; visible in both collapsed and expanded */}
			<img
				className={styles.avatar}
				src="../../images/logo.png"
				alt="avatar"
				style={{ position: 'fixed', left: avatarPos.left, top: avatarPos.top, width: avatarSize, height: avatarSize }}
			/>

			{/* toggle button positioned via inline styles computed from bounding rect */}
			<button
				className={`${styles.toggleButton} ${collapsed ? styles.rotated : ''}`}
				onClick={onToggle}
				aria-label="toggle sidebar"
				style={{ position: 'fixed', left: pos.left, top: pos.top }}
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
