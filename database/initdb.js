const fs = require('fs');
const path = require('path');

// database/init-db.js
const sqlite3 = require('sqlite3').verbose();

// Open a database connection
let db = new sqlite3.Database('./database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the local SQLite database.');
});

const sql = fs.readFileSync(`C:\\Users\\adria\\Desktop\\Coding\\ryddeapp\\database\\initdb.sql`/*path.join(process.cwd(), 'sql', 'initdb.sql')*/, 'utf-8')

// Create a sample table
db.exec(sql, (err) => {
	if (err) {
		console.error("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERORRORORR:");
		console.error(err.message);
	}
	console.log('Table created or already exists.');
});

// Close the database connection
db.close((err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Closed the database connection.');
});
