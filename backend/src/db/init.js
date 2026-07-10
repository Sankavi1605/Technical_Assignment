const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

console.log('Initializing database...');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'MEMBER'
  );

  CREATE TABLE IF NOT EXISTS Projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS Reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    week_start_date TEXT NOT NULL,
    tasks_completed TEXT NOT NULL,
    tasks_planned TEXT NOT NULL,
    blockers TEXT,
    hours INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
  );
`);

// Seed Admin/Manager
const adminEmail = 'admin@axion.studio';
const existingAdmin = db.prepare('SELECT id FROM Users WHERE email = ?').get(adminEmail);
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)').run(adminEmail, hash, 'MANAGER');
  console.log('Seeded admin account: admin@axion.studio / admin123');
}

// Seed Projects
const projects = [
  { name: 'Narrativ', description: 'Interactive 3D showcase' },
  { name: 'Luminar', description: 'Conversion-focused brand experience' },
  { name: 'Internal Tooling', description: 'Agency internal tools' }
];

const existingProjects = db.prepare('SELECT count(*) as count FROM Projects').get();
if (existingProjects.count === 0) {
  const insertProject = db.prepare('INSERT INTO Projects (name, description) VALUES (?, ?)');
  const insertMany = db.transaction((projs) => {
    for (const p of projs) insertProject.run(p.name, p.description);
  });
  insertMany(projects);
  console.log('Seeded initial projects.');
}

console.log('Database initialization complete.');
