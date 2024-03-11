import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import runQuery, {getData} from "../../database/runsql"
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
	const { name, email, password, password2, isChild } = req.body;
	// validate the input
	if (!name || !email || !password || !password2) {
		res.status(400).json({ error: 'Please fill in all fields.' });
		return;
	}
	// validate the email using regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		res.status(400).json({ error: 'Invalid email' });
		return;
	}
	// TODO check if email is already in use

	// validate the password
	if (password !== password2) {
		res.status(400).json({ error: 'Passwords do not match' });
		return;
	}

	const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: 'Failed to connect to the database' });
			return;
		}
	});

	// Generate salt and token
	const salt = bcrypt.genSaltSync(10);
	const token = uuidv4();

	// Hash the password using the salt
	const hashedPassword = bcrypt.hashSync(password, salt);

	const datejoined = new Date().toISOString();

	try {
		let sql = `INSERT INTO ${isChild ? "children" : "parents"} (name, email, datejoined, password, salt, token) VALUES (?, ?, ?, ?, ?, ?);`
		await runQuery(db, sql, [name, email, datejoined, hashedPassword, salt, token]);
		if (!isChild) {
			sql = `SELECT last_insert_rowid();`
			let id = await getData(db, sql);
			sql = `UPDATE parents SET host = ${id} WHERE id = ${id};`
			await runQuery(db, sql);
		}

		res.status(200).json({ token: token });
	} catch (error) {
		res.status(500).json({ error: `Failed to process the request: ${error}` });
	} finally {
		db.close();
	}
}