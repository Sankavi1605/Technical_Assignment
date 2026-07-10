const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

console.log('Seeding example reports...');

// Ensure there is at least one member user to assign reports to, or use the admin
let user = db.prepare('SELECT id FROM Users LIMIT 1').get();

if (!user) {
  console.log('No users found. Creating a test user...');
  const info = db.prepare('INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)').run('test@axion.studio', 'hash', 'MEMBER');
  user = { id: info.lastInsertRowid };
}

// Ensure there is at least one project
let project = db.prepare('SELECT id FROM Projects LIMIT 1').get();

const reportsToInsert = [
  {
    week_start_date: '2026-06-29',
    tasks_completed: '- Designed the new hero section\n- Implemented WebGL shaders for background\n- Fixed responsive layout issues on mobile',
    tasks_planned: '- Finalize navigation animations\n- Integrate backend API for user auth\n- Write unit tests for UI components',
    blockers: 'None so far, everything is on track.',
    hours: 42,
    notes: 'Great progress this week!'
  },
  {
    week_start_date: '2026-06-22',
    tasks_completed: '- Initial project setup with Vite and React\n- Created database schema in SQLite\n- Setup Express.js server and routing',
    tasks_planned: '- Begin frontend UI implementation\n- Add JWT authentication\n- Setup state management',
    blockers: 'Had some trouble configuring Tailwind CSS v4, but resolved it.',
    hours: 38,
    notes: 'Excited for this new project.'
  }
];

const insertReport = db.prepare(`
  INSERT INTO Reports (user_id, project_id, week_start_date, tasks_completed, tasks_planned, blockers, hours, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

db.transaction(() => {
  for (const r of reportsToInsert) {
    insertReport.run(user.id, project.id, r.week_start_date, r.tasks_completed, r.tasks_planned, r.blockers, r.hours, r.notes);
  }
})();

console.log('Successfully seeded 2 example reports!');
