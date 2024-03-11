import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import Cookie from 'js-cookie';
import styles from '../../styles/TaskComponent.module.css';

const TaskComponent = ({ title, description, points, extra}) => {
  return (
    <div className={styles.taskTemplate}>
      <div className={styles.header}>
        Task templates
        <button className={styles.addButton}>+</button>
      </div>
      <div className={styles.template}>
        <div className={styles.title}>Title</div>
        <button className={styles.editButton}>Edit</button>
        <button className={styles.deleteButton}>Delete</button>
        <div className={styles.description}>Description</div>
        <div className={styles.rewards}>Rewards: 60 points Ice cream</div>
      </div>
    </div>
  );
};

export default function FirstPost({isParent}) {
    const [tasks, setTasks] = useState([]);
    const [points, setPoints] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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
                setPoints(data.points);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
        console.log(tasks.error, error)
    }, []);

    return (
        <>
            <Layout pfp={"corner"} points={points}>
                <h1>Tasks</h1>
                
                {loading ? <p>Loading...</p> : (tasks.error || error ? <p>ERROR: {tasks.error||error}</p> : tasks.length !== 0 ? (tasks.map((task, index) => (
                    <TaskComponent key={index} task={task}/>
                ))) : <p>You have no assigned tasks</p>)}
            </Layout>
        </>
    );
}
