import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import getData from "../../database/runsql"



export default async function handler(req, res) {
	const token = req.body.token;
	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	try {
		
		let sql = "SELECT points FROM children WHERE token = ?";
		let rows = await getData(db, sql, [token]);
		if (rows.length === 0) {
			sql = "SELECT host FROM parents WHERE token = ?";
			rows = await getData(db, sql, [token]);
			if (rows.length === 0){
				res.status(400).json({ error: 'Invalid token' });
				return;
			}
			// return parent tasks
			sql = "SELECT task_templates.*, rewards.title AS reward_title FROM task_templates LEFT JOIN rewards ON task_templates.reward = rewards.id WHERE host = ?"
			let tasksRows = await getData(db, sql, [rows[0].host]);

			sql = "SELECT id, name FROM children WHERE host = ?"
			let childrenRows = await getData(db, sql, [rows[0].host]);

			res.status(200).json({tasks: tasksRows, children: childrenRows});
		}
		// return child tasks

		sql = "SELECT * FROM tasks";
		const TasksRows = await getData(db, sql);

		res.status(200).json({tasks: TasksRows, points: rows[0].points});
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}
