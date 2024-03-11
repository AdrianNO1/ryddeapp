import sqlite3 from 'sqlite3';
import runQuery from "../../database/runsql"
import getData from '../../database/runsql';



export default async function handler(req, res) {
    const { token, title, description, points, extraReward, scheduleChecked, days, time, expiresAfterHours, id } = req.body;
	
    if (title === "" || points === "") {
        res.status(400).json({ error: "Title and points are required" });
        return;
    }
    else if (points < 2){
        res.status(400).json({ error: "Too few points :(" });
        return;
    }
    else if (scheduleChecked && days.length === 0) {
        res.status(400).json({ error: "At least one day must be selected" });
        return;
    }
    else if (scheduleChecked && time === "") {
        res.status(400).json({ error: "Time is required if the task is scheduled" });
        return;
    }
    
    const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
        let sql = "SELECT host FROM parents WHERE token = ?"
		let host = await getData(db, sql, [token]);
        if (host.length === 0) {
            res.status(400).json({ error: "Invalid token" });
            return;
        }
        console.log("NEW SCHEDULE")
        console.log(scheduleChecked ? days : "")
        let current_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (id) {
            sql = `UPDATE task_templates SET title = ?, description = ?, reward_points = ?, reward = ?, schedule = ?, time = ?, duration = ?, created = ?, host = ?  WHERE (id = ${id})`;
        } else{
            sql = `INSERT INTO task_templates (title, description, reward_points, reward, schedule, time, duration, created, host) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        }
		await runQuery(db, sql, [title, description, points, 0/*TODO make this a reference*/, scheduleChecked ? days : "", time, Math.ceil(expiresAfterHours*3600), current_datetime, host[0].host]);

		res.status(200).json({message: "Task created successfully"});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
