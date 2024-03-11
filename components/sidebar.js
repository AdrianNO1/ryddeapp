import React, { useState } from 'react';
import styles from './sidebar.module.css';
import Link from 'next/link';

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => setIsOpen(!isOpen);

	return (
		<>
			<div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
				<ul>
					<li><Link href="/">Home</Link></li>
					<li><Link href="/posts/Ptasks">Tasks (parent)</Link></li>
					<li><Link href="/posts/rewards">Rewards (WIP)</Link></li>
					<li><Link href="/posts/Pprofile">Profile (parent)</Link></li>
					<li><Link href="/posts/Cprofile">Profile (child)</Link></li>
					<li><Link href="/posts/createTask">createTask (parent)</Link></li>
				</ul>
			</div>
			<button className={styles.hamburger} onClick={toggleSidebar}>
				&#9776;
			</button>
		</>
	);
};

export default Sidebar;
