import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('job_portal.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('job_seeker', 'recruiter', 'admin')) DEFAULT 'job_seeker',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    salary TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    recruiter_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    user_id INTEGER,
    status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    resume_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    analysis TEXT,
    score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    role TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS interview_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    status TEXT,
    feedback TEXT,
    score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Seed initial jobs
  INSERT OR IGNORE INTO jobs (title, company, location, salary, description, requirements) VALUES 
  ('Senior Frontend Engineer', 'TechFlow Solutions', 'San Francisco, CA', '$140k - $180k', 'We are looking for a React expert to lead our dashboard team. Experience with Tailwind and Framer Motion is a plus.', 'React, TypeScript, Tailwind CSS'),
  ('AI Research Scientist', 'NeuralCore AI', 'Remote', '$160k - $220k', 'Join our core AI team to build next-gen LLM applications. PhD in CS or equivalent experience required.', 'Python, PyTorch, LLMs, NLP'),
  ('Product Designer', 'CreativePulse', 'New York, NY', '$110k - $150k', 'Help us design the future of job portals. We value clean aesthetics and user-centric design.', 'Figma, UI/UX, Design Systems'),
  ('Full Stack Developer', 'StartupHub', 'Austin, TX', '$120k - $160k', 'Join a fast-growing startup to build scalable web applications. You will work on both frontend and backend.', 'Node.js, React, PostgreSQL'),
  ('DevOps Engineer', 'CloudScale', 'Seattle, WA', '$130k - $170k', 'Manage our AWS infrastructure and CI/CD pipelines. Experience with Kubernetes is required.', 'AWS, Kubernetes, Docker, Terraform');
`);

export default db;
