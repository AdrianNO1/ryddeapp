import React, { useState } from 'react';
import styles from '../../styles/TaskForm.module.css';
import Layout from '../../components/layout';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';


const TaskForm = (submit, error, overwrite) => {
	const [scheduleChecked, setScheduleChecked] = useState(overwrite?.schedule !== "");
	console.log(overwrite)

	const handleScheduleChange = (e) => {
		setScheduleChecked(e.target.checked);
	};

	const createTask = () => {
		const title = document.getElementById('title').value;
		const description = document.getElementById('description').value;
		const points = document.getElementById('points').value;
		const extraReward = document.getElementById('extraReward').value;
		const scheduleChecked = document.getElementById('scheduleChecked').checked;
		const days = Array.from(document.querySelectorAll(`.${styles.dayButtonOn}`)).map((button) => button.id).join("");
		const time = document.getElementById('time').value;
		const expiresAfterHours = document.getElementById('expiresAfterHours').value;
		const id = overwrite?.id;
		submit(title, description, points, extraReward, scheduleChecked, days, time, expiresAfterHours, id);
	
	}

	const dayClicked = (e) => {
		console.log(e.target)
		if (e.target.classList.contains(styles.dayButtonOn)) {
			e.target.classList.remove(styles.dayButtonOn);
			e.target.classList.add(styles.dayButtonOff);
		} else {
			e.target.classList.remove(styles.dayButtonOff);
			e.target.classList.add(styles.dayButtonOn);
		}
	}

	return (
		<div className={styles.taskForm}>
			<div className={styles.field}>
				<label htmlFor="title">Title</label>
				<input type="text" id="title" defaultValue={overwrite?.title} required />
			</div>
			<div className={styles.field}>
				<label htmlFor="description">Description (optional)</label>
				<textarea defaultValue={overwrite?.description} id="description" />
			</div>
			<div className={styles.field}>
				<label htmlFor="points">Points reward</label>
				<input defaultValue={overwrite?.reward_points} type="number" id="points" required />
			</div>
			<div className={styles.field}>
				<label htmlFor="extraReward">Extra reward</label>
				<select id="extraReward">
					<option value="">None</option>
					<option value="volvo">Volvo</option> {/*TODO set default value here*/}
				</select>
			</div>
			<div className={styles.field}>
				<label>
					<input id="scheduleChecked"
						type="checkbox"
						checked={scheduleChecked}
						onChange={handleScheduleChange}
					/>
					Schedule
				</label>
				<div className={scheduleChecked ? '' : styles.disabled}>
					{/* Map over days of the week */}
					{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
						<button key={index} id={index} className={overwrite?.schedule ? (overwrite?.schedule.includes(String(index)) ? styles.dayButtonOn : styles.dayButtonOff) : styles.dayButtonOff} onClick={dayClicked}>
							{day}
						</button>
					))}
					<div className={styles.field}>
						<label htmlFor="time">Time</label>
						<input defaultValue={overwrite?.time} type="time" id="time" required />
					</div>
				</div>
			</div>
			<div className={styles.field}>
				<label htmlFor="expiresAfterHours">Expires after hours (optional)</label>
				<input defaultValue={overwrite?.expiresAfterHours} type="number" id="expiresAfterHours" />
			</div>
			<p className={styles.error}>{error}</p>
			<button className={styles.createTaskButton} onClick={createTask}>{Object.keys(overwrite).length !== 0 ? "Edit Task" : "Create Task"}</button>
		</div>
	);
};


export default function FirstPost() {
	const [error, setError] = useState("");
	const router = useRouter();

	let overwrite = router.query;
	if (overwrite.overwrite) {
		overwrite = JSON.parse(overwrite.overwrite);
	}

	console.log("OVERFWRITE: ");
	console.log(overwrite);
	console.log(typeof overwrite)


	async function submit(title, description, points, extraReward, scheduleChecked, days, time, expiresAfterHours, id){
		console.log("title: " + title);
		console.log("description: " + description);
		console.log("points: " + points);
		console.log("extraReward: " + extraReward);
		console.log("scheduleChecked: " + scheduleChecked);
		console.log("days: " + days);
		console.log("time: " + time);
		console.log("expiresAfterHours: " + expiresAfterHours);

		try {
			const res = await fetch('/api/createTask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: Cookie.get('token'),
					title,
					description,
					points,
					extraReward,
					scheduleChecked,
					days,
					time,
					expiresAfterHours,
					id,
				}),
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
			setError("")
			router.push("/posts/Ptasks");
		} catch (error) {
			setError(error.message);
		}
	}

	return (
		<>
			<Layout pfp={"corner"} title={"Create Task"}>
				{TaskForm(submit, error, overwrite)}
			</Layout>
		</>
	);
}
