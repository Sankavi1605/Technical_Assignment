const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config(); // Load environment variables
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new Database(dbPath);
const JWT_SECRET = 'supersecret_axion_key_do_not_use_in_prod';

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isManager = (req, res, next) => {
  if (req.user.role !== 'MANAGER') return res.status(403).json({ error: 'Forbidden' });
  next();
};

// --- AUTHENTICATION ---
app.post('/api/auth/register', (req, res) => {
  const { email, password, role = 'MEMBER' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)');
    const info = stmt.run(email, hash, role);
    const token = jwt.sign({ id: info.lastInsertRowid, email, role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: info.lastInsertRowid, email, role } });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// --- PROJECTS ---
app.get('/api/projects', authenticate, (req, res) => {
  const projects = db.prepare('SELECT * FROM Projects').all();
  res.json(projects);
});

app.post('/api/projects', authenticate, isManager, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const info = db.prepare('INSERT INTO Projects (name) VALUES (?)').run(name);
    res.json({ id: info.lastInsertRowid, name });
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
});

app.put('/api/projects/:id', authenticate, isManager, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  db.prepare('UPDATE Projects SET name = ? WHERE id = ?').run(name, req.params.id);
  res.json({ success: true });
});

app.delete('/api/projects/:id', authenticate, isManager, (req, res) => {
  db.prepare('DELETE FROM Projects WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- REPORTS ---
// Member: Create report
app.post('/api/reports', authenticate, (req, res) => {
  const { week_start_date, project_id, tasks_completed, tasks_planned, blockers, hours, notes } = req.body;
  
  if (!week_start_date || !project_id || !tasks_completed || !tasks_planned) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare(`
    INSERT INTO Reports (user_id, project_id, week_start_date, tasks_completed, tasks_planned, blockers, hours, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(req.user.id, project_id, week_start_date, tasks_completed, tasks_planned, blockers || '', hours || 0, notes || '');
  res.json({ id: info.lastInsertRowid, message: 'Report created' });
});

// Member: Get own reports
app.get('/api/reports/me', authenticate, (req, res) => {
  const reports = db.prepare(`
    SELECT r.*, p.name as project_name 
    FROM Reports r 
    JOIN Projects p ON r.project_id = p.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `).all(req.user.id);
  res.json(reports);
});

// Manager: Get all reports
app.get('/api/reports', authenticate, isManager, (req, res) => {
  const reports = db.prepare(`
    SELECT r.*, p.name as project_name, u.email as user_email
    FROM Reports r 
    JOIN Projects p ON r.project_id = p.id
    JOIN Users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `).all();
  res.json(reports);
});

// --- DASHBOARD METRICS ---
app.get('/api/dashboard', authenticate, isManager, (req, res) => {
  const totalReports = db.prepare('SELECT count(*) as count FROM Reports').get().count;
  
  const userCount = db.prepare("SELECT count(*) as count FROM Users WHERE role='MEMBER'").get().count;
  const recentReports = db.prepare(`SELECT count(*) as count FROM Reports WHERE created_at >= date('now', '-7 days')`).get().count;
  
  const activeMembersThisWeek = db.prepare(`SELECT count(DISTINCT user_id) as count FROM Reports WHERE created_at >= date('now', '-7 days')`).get().count;
  const complianceRate = userCount > 0 ? Math.round((activeMembersThisWeek / userCount) * 100) : 0;
  
  const openBlockers = db.prepare("SELECT count(*) as count FROM Reports WHERE blockers != '' AND blockers IS NOT NULL").get().count;
  
  const projectStats = db.prepare(`
    SELECT p.name, count(r.id) as reportCount 
    FROM Projects p LEFT JOIN Reports r ON p.id = r.project_id 
    GROUP BY p.id
  `).all();

  // Tasks completed trend over time (simplified to count of reports per week-start-date for trend)
  const reportTrend = db.prepare(`
    SELECT week_start_date as date, count(id) as count
    FROM Reports
    GROUP BY week_start_date
    ORDER BY week_start_date ASC
    LIMIT 10
  `).all();

  res.json({
    metrics: { totalReports, userCount, recentReports, complianceRate, openBlockers },
    projectStats,
    reportTrend
  });
});

// --- AI CHAT MOCK / INTEGRATION ---
app.post('/api/chat', authenticate, isManager, async (req, res) => {
  const { message } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.json({ reply: "⚠️ API key is not configured. Please add GEMINI_API_KEY to your backend/.env file to use the AI Assistant." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fetch recent reports for context
    const recentReports = db.prepare(`
      SELECT r.tasks_completed, r.tasks_planned, r.blockers, p.name as project_name, u.email as member
      FROM Reports r 
      JOIN Projects p ON r.project_id = p.id
      JOIN Users u ON r.user_id = u.id
      WHERE r.created_at >= date('now', '-7 days')
    `).all();

    const systemPrompt = `You are the Workspace AI Assistant for managers. You answer questions about team activity concisely.
Context (Recent Reports from the last 7 days):
${JSON.stringify(recentReports, null, 2)}
    
Answer the user's question concisely based ONLY on the context provided. If the information isn't in the context, say so. Format your answer with markdown if appropriate (e.g. bolding names or projects).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + message }] }
      ]
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("AI Error details:", error?.status, error?.message || error);
    const errMsg = error?.message || 'Unknown error';
    res.json({ reply: `⚠️ AI service error: ${errMsg}. Please try again in a moment.` });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
