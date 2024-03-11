import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import styles from '../../styles/Pprofile.module.css';
import Cookie from 'js-cookie';

const MemberRow = ({ name, points }) => {
	return (
	<div className={styles.childRow}>
		<div className={styles.childInfo}>
		<span className={styles.childName}>{name}</span>
		<span className={styles.childPoints}>Points: {points}</span>
		</div>
		<button className={styles.viewTasksButton}>view tasks</button>
		<img className={styles.childImage} src="/images/profile.jpg"></img>
	</div>
	);
};


export default function FirstPost() {
	const [family, setFamily] = useState([]);
	const [error, setError] = useState("");
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(true);
	const [loadinglc, setLoadinglc] = useState(false);
	const [hostId, setHostId] = useState("");
	
	useEffect(() => {
		async function fetchTasks() {
			try {
				const res = await fetch('/api/getChildProfileInfo', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token: Cookie.get('token')}),
				});

				if (!res.ok) {
					let data = await res.json()
					if (data && data.error) {
						throw new Error(data.error);
					}
					throw new Error(res.statusText);
				}

				const data = await res.json();
				console.log(data);
				setFamily(data.family);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		}

		fetchTasks();
	}, []);

	async function linkAccounts() {
		try {
			setLoadinglc(true);
			const res = await fetch('/api/linkAccounts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: Cookie.get('token'), code: document.getElementById('codeinp').value, isChild: true}),
			});

			if (!res.ok) {
				let data = await res.json()
				if (data && data.error) {
					throw new Error(data.error);
				}
				throw new Error(res.statusText);
			}

			const data = await res.json();
			console.log(data);
			setStatus("Success: Host_id: " + data.host_id);
			//location.reload();
		} catch (error) {
			setStatus("ERROR " + error.message);
		} finally {
			setLoadinglc(false);
		}
	}

	function logout(){
		Cookie.remove('token');
		location.reload();
	}

	return (
		<>
			<Layout pfp={"corner"} title={"Settings"}>
			</Layout>
			
			<h1>Family</h1>
			{loading ? <p>Loading...</p> : family.error || error ? <p>ERROR: {family.error||error}</p> : family.length !== 0 ? family.map((member, index) => (
					<MemberRow name={member.name} points={member.points}/>
			)) : <p>You are orphaned :&#40;</p>}
			<br></br>
			<h1>Join a family</h1>
			{status ? <p>{status}</p> : <></>}
			{loadinglc ? <p>Loading...</p> : <><input type="number" id="codeinp"></input><button className={styles.addChildButton} onClick={linkAccounts}>Join</button></>}
			<br></br>
			<button onClick={logout}>Logout (half works)</button>
		</>
	);
}
