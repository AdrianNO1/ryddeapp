import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import Cookie from 'js-cookie';
import styles from '../../styles/TaskComponent.module.css';
import { useRouter } from 'next/router';

export default function FirstPost({isParent}) {
	const [tasks, setTasks] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const [clickedTask, setClickedTask] = useState({});
	const [assignedChildren, setassignedChildren] = useState([]);
	const [acError, setACError] = useState("");
	const [acIsLoading, setACIsLoading] = useState(false);
	const [selectChild, setSelectChild] = useState(false);
	const [allChildren, setAllChildren] = useState([]);
	const router = useRouter();

	useEffect(() => {
		async function fetchTasks() {
			try {
				const res = await fetch('/api/getTasks', {
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
				setTasks(data.tasks);
				setAllChildren(data.children);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		}

		fetchTasks();
		console.log(tasks.error, error)
	}, []);

	const edit = (task, e) => {
		e.stopPropagation();

		router.push({
			pathname: '/posts/createTask',
			query: { overwrite: JSON.stringify(task) }
		});
	}

	const deleteTask = (e) => {
		e.stopPropagation();

		if (!confirm("Are you sure you want to delete this task?")){
			return;
		}

		e.target.parentNode.querySelectorAll('button').forEach((button) => {
			button.disabled = true;
		});

		async function deleteTas() {
			try {
				const res = await fetch('/api/deleteTask', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token: Cookie.get('token'), id: e.target.parentNode.id}),
				});

				if (!res.ok) {
					let data = await res.json()
					if (data && data.error) {
						throw new Error(data.error);
					}
					throw new Error(res.statusText);
				}

				const data = await res.json();
				router.reload();
			} catch (error) {
				setError(error.message);
			}
		}

		deleteTas();

		router.reload();
	}

	const taskClicked = (task, e) => {
		setClickedTask(task);
		setIsOpen(true)
		setSelectChild(false)
		async function getAssignedChildren() {
			try {
				setACIsLoading(true);
				const res = await fetch('/api/getAssignedChildren', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token: Cookie.get('token'), task_id: task.id}),
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
				setassignedChildren(data.children);
			} catch (error) {
				setACError(error.message);
				setassignedChildren([]);
			} finally {
				setACIsLoading(false)
			}
		}

		getAssignedChildren();
	}

	const newTask = () => {
		router.push({
			pathname: '/posts/createTask'
		});
	}

	const taskComponent = (task, index, isInModal=false) => {
		return (
			<div key={index} className={styles.template} id={task.id} onClick={isInModal ? null : (event) => taskClicked(task, event)}>
				<div className={styles.title}>{task.title}</div>
				{isInModal ? null : <button className={styles.editButton} onClick={(event) => edit(task, event)}>Edit</button>}
				{isInModal ? null : <button className={styles.deleteButton} onClick={(event) => deleteTask(event)}>Delete</button>}
				<div className={styles.description}>{task.description}</div>
				<div className={styles.rewards}>Rewards:<br></br> {task.reward_points} points<br></br>{task.reward_title}</div>
			</div>
		)
	}

	function assignChild(child, unassign=false) {
		console.log(child)
		async function getAssignedChildren() {
			try {
				setACIsLoading(true);
				const res = await fetch('/api/assignChild', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token: Cookie.get('token'), task_id: clickedTask.id, child_id: child.child_id ?? child.id, unassign: unassign}),
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
			} catch (error) {
				setACError(error.message);
			} finally {
				setACIsLoading(false)
				taskClicked(clickedTask);
			}
		}

		getAssignedChildren();
	}

	const Modal = ({ close }) => {
		if (!isOpen) return null;
	  
		return (
			<div className={styles.modalOverlay} onClick={close}>
				<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
					{taskComponent(clickedTask, 0, true)}
					{acIsLoading ? <></> : <div className={styles.modelAssignedTo}>
						<h3>Assigned To:</h3>
						<button className={styles.addButton} onClick={() => setSelectChild(!selectChild)}>+</button>
						{selectChild ? <div>
							{allChildren.map((child, index) => (<button key={index} onClick={() => assignChild(child)}>{child.name}</button>))}
						</div> : <></>}
					</div>}
					{acIsLoading ? <p>Loading...</p> : (assignedChildren.length === 0 ? <p>{acError ? acError : "No children assigned"}</p> : assignedChildren.map((child, index) => (
						<div key={index}>
							<p>{child.name}</p>
							<button onClick={() => assignChild(child, true)}>-</button>
						</div>
					)))}
				</div>
			</div>
		);
	};

	function closeModal() {
		setIsOpen(false);
	}


	return (
		<>
			<Layout pfp={"corner"}>
				<h1>Tasks</h1>
				<Modal close={closeModal} />
				<div className={styles.taskTemplate}>
					<div className={styles.header}>
						Task templates
						<button className={styles.addButton} onClick={newTask}>+</button>
					</div>
						{loading ? <p>Loading...</p> : (tasks.error || error ? <p>ERROR: {tasks.error||error}</p> : tasks.length !== 0 ? (tasks.map((task, index) => (
							taskComponent(task, index)
						))) : <p>You have no assigned tasks</p>)}
				</div>
			</Layout>
		</>
	);
}
