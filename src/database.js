const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
// It's in the 'database' directory at the root of the project
const DB_PATH = path.join(__dirname, '..', 'database', 'hueneu.sqlite3');

let db;

// Function to initialize the database connection and create table if it doesn't exist
async function initDb() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        return reject(err);
      }
      console.log('Connected to the hueneu SQLite database.');

      // SQL statement to create the messages table if it doesn't exist
      const createTableSql = `
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      db.run(createTableSql, (err) => {
        if (err) {
          console.error('Error creating messages table:', err.message);
          return reject(err);
        }
        console.log('Messages table ensured.');
        resolve();
      });
    });
  });
}

// Function to add a new message to the database
async function addMessage(name, email, message) {
  return new Promise((resolve, reject) => {
    if (!db) {
      // This should ideally not happen if initDb is called on server start
      console.error('Database not initialized.');
      return reject(new Error('Database not initialized. Call initDb first.'));
    }

    const insertSql = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
    db.run(insertSql, [name, email, message], function(err) { // Use function keyword for this.lastID
      if (err) {
        console.error('Error inserting message:', err.message);
        return reject(err);
      }
      console.log(`A new message has been inserted with rowid ${this.lastID}`);
      resolve({ id: this.lastID });
    });
  });
}

module.exports = {
  initDb,
  addMessage,
};
