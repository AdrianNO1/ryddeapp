import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';

function TaskComponent({ task }) {
    return <div>{task.name}</div>;
}

export default function FirstPost() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Step 1: Add a loading state

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch('/api/getTasks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) { // It's better to check if response is ok
                    throw new Error(res.statusText);
                }

                const data = await res.json();
                console.log(data);
                setTasks(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    return (
        <>
            <Layout pfp={"corner"}>
                <h1>Tasks</h1>
                
                {loading ? <p>Loading...</p> : (tasks.error || error ? <p>ERROR: {tasks.error||error}</p> : tasks.length !== 0 ? (tasks.map((task, index) => (
                    <TaskComponent key={index} task={task}/>
                ))) : <p>You have no assigned tasks</p>)}
            </Layout>
        </>
    );
}
