import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export function runQuery(db, sql, params = []) {
	return new Promise((resolve, reject) => {
		db.run(sql, params, function(err) {
			if (err) {
				console.error('Error running sql: ' + sql);
				console.error(err);
				reject(err);
			} else {
				resolve({ id: this.lastID });
			}
		});
	});
}

// Helper function to get data
export default function getData(db, sql, params = []) {
	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
			if (err) {
				console.error('Error running sql: ' + sql);
				console.error(err);
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}
