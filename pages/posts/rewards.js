import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';

function RewardTaskComponent({ reward }) {
    return <div>{reward.name}</div>;
}

export default function FirstPost({isParent}) {
    //const [tasks, setTasks] = useState([]);
    //const [error, setError] = useState("");
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
        return
        async function fetchTasks() {
            try {
                const res = await fetch('/api/getTasks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
                <h1>Rewards</h1>
            </Layout>
        </>
    );
}
