import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "./server/db.ts";
import * as aiService from "./server/aiService.ts";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

app.use(express.json());

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// --- Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const stmt = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    const result = stmt.run(name, email, hashedPassword, role || "job_seeker");
    res.status(201).json({ id: result.lastInsertRowid, name, email, role });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// --- Job Routes ---
app.get("/api/jobs", (req, res) => {
  const jobs = db.prepare("SELECT * FROM jobs ORDER BY created_at DESC").all();
  res.json(jobs);
});

app.post("/api/jobs", authenticateToken, (req: any, res) => {
  if (req.user.role !== "recruiter" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Only recruiters can post jobs" });
  }
  const { title, company, location, salary, description, requirements } = req.body;
  const stmt = db.prepare("INSERT INTO jobs (title, company, location, salary, description, requirements, recruiter_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const result = stmt.run(title, company, location, salary, description, requirements, req.user.id);
  res.status(201).json({ id: result.lastInsertRowid, title, company });
});

app.post("/api/jobs/apply", authenticateToken, (req: any, res) => {
  const { job_id, resume_url } = req.body;
  const stmt = db.prepare("INSERT INTO applications (job_id, user_id, resume_url) VALUES (?, ?, ?)");
  const result = stmt.run(job_id, req.user.id, resume_url);
  res.status(201).json({ id: result.lastInsertRowid, job_id, user_id: req.user.id });
});

app.get("/api/applications/my", authenticateToken, (req: any, res) => {
  const applications = db.prepare(`
    SELECT a.*, j.title, j.company 
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id 
    WHERE a.user_id = ?
  `).all(req.user.id);
  res.json(applications);
});

// --- AI Resume Analysis ---
app.post("/api/resume/analyze", authenticateToken, upload.single("resume"), async (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const data = await pdf(req.file.buffer);
    const analysis = await aiService.analyzeResume(data.text);
    
    const stmt = db.prepare("INSERT INTO resumes (user_id, content, analysis, score) VALUES (?, ?, ?, ?)");
    stmt.run(req.user.id, data.text, JSON.stringify(analysis), analysis.score);
    
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/resume/my", authenticateToken, (req: any, res) => {
  const resume: any = db.prepare("SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(req.user.id);
  if (resume) {
    resume.analysis = JSON.parse(resume.analysis);
  }
  res.json(resume || null);
});

// --- AI Chatbot ---
app.post("/api/chat", authenticateToken, async (req: any, res) => {
  const { message } = req.body;
  const history: any = db.prepare("SELECT role, content FROM chat_history WHERE user_id = ? ORDER BY created_at ASC").all(req.user.id);
  
  try {
    const response = await aiService.getCareerAdvice(message, history);
    
    const stmt = db.prepare("INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)");
    stmt.run(req.user.id, "user", message);
    stmt.run(req.user.id, "assistant", response);
    
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/chat/history", authenticateToken, (req: any, res) => {
  const history = db.prepare("SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at ASC").all(req.user.id);
  res.json(history);
});

// --- Interview Simulator ---
app.post("/api/interview/start", authenticateToken, async (req: any, res) => {
  const { type } = req.body;
  const resume: any = db.prepare("SELECT analysis FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(req.user.id);
  
  if (!resume) return res.status(400).json({ error: "Please analyze your resume first" });

  const analysis = JSON.parse(resume.analysis);
  const question = await aiService.generateInterviewQuestion(analysis, type, []);
  
  const stmt = db.prepare("INSERT INTO interview_sessions (user_id, type, status) VALUES (?, ?, ?)");
  const result = stmt.run(req.user.id, type, "in_progress");
  
  res.json({ sessionId: result.lastInsertRowid, question });
});

app.post("/api/interview/answer", authenticateToken, async (req: any, res) => {
  const { question, answer } = req.body;
  try {
    const evaluation = await aiService.evaluateInterviewAnswer(question, answer);
    res.json(evaluation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
