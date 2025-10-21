import React from 'react';
import styles from './styles.module.scss';

export default function Sidebar() {
	return (
		<aside className={styles.sidebar}>
			<nav>
				<ul>
					<li>Inicio</li>
					<li>Grupos</li>
					<li>Mi perfil</li>
				</ul>
			</nav>
		</aside>
	);
}
