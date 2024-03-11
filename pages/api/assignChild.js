import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import getData from "../../database/runsql"



export default async function handler(req, res) {
	const {token, task_id, child_id, unassign} = req.body;
	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
		
		let sql = "SELECT host FROM parents WHERE token = ?";
		let rows = await getData(db, sql, [token]);
		if (rows.length === 0) {

            res.status(400).json({ error: 'Invalid token' });
            return;
			// return parent tasks
			sql = "SELECT task_templates.*, rewards.title AS reward_title FROM task_templates LEFT JOIN rewards ON task_templates.reward = rewards.id WHERE host = ?"
			let tasksRows = await getData(db, sql, [rows[0].host]);

			sql = "SELECT id, name FROM children WHERE host = ?"
			let childrenRows = await getData(db, sql, [rows[0].host]);

			res.status(200).json({tasks: tasksRows, children: childrenRows});
		}
        console.log(unassign, task_id, child_id)
		if (unassign){
            sql = "SELECT id FROM scheduled_tasks WHERE template = ? AND assigned_child = ? LIMIT 1"
            console.log(await getData(db, sql, [task_id, child_id]))
            sql = "DELETE FROM scheduled_tasks WHERE id = (SELECT id FROM scheduled_tasks WHERE template = ? AND assigned_child = ? LIMIT 1)";
        } else{
            sql = "INSERT INTO scheduled_tasks (template, assigned_child) VALUES (?, ?)";
        }
        await getData(db, sql, [task_id, child_id]);

		res.status(200).json({success: true});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
