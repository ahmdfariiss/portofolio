-- ==========================================
-- SUPABASE DATABASE SCHEMA
-- Portfolio CMS Database
-- ==========================================
-- Jalankan SQL ini di Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ==========================================

-- 1. Profile Table (Single row for portfolio owner)
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Your Name',
  role TEXT[] DEFAULT ARRAY['Web Developer'],
  semester TEXT DEFAULT '5',
  year TEXT DEFAULT '2024',
  university TEXT DEFAULT 'University Name',
  bio TEXT[] DEFAULT ARRAY['Passionate about building web applications.'],
  email TEXT DEFAULT 'your@email.com',
  phone TEXT DEFAULT '+62 xxx xxxx xxxx',
  location TEXT DEFAULT 'Indonesia',
  avatar TEXT,
  social JSONB DEFAULT '{"github": "", "linkedin": "", "instagram": "", "twitter": ""}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  image TEXT,
  gallery TEXT[] DEFAULT '{}',
  tech TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Web',
  github TEXT,
  demo TEXT,
  featured BOOLEAN DEFAULT false,
  size TEXT DEFAULT 'small' CHECK (size IN ('small', 'medium', 'large')),
  features TEXT[] DEFAULT '{}',
  challenges TEXT,
  solutions TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT,
  period TEXT,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Education Table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT,
  period TEXT,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  category TEXT DEFAULT 'frontend',
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  image TEXT,
  credential_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Highlights Table (for About section)
CREATE TABLE IF NOT EXISTS highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0
);

-- 8. Stats Table (for About section)
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Create policies for PUBLIC READ access
CREATE POLICY "Allow public read on profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read on education" ON education FOR SELECT USING (true);
CREATE POLICY "Allow public read on skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read on highlights" ON highlights FOR SELECT USING (true);
CREATE POLICY "Allow public read on stats" ON stats FOR SELECT USING (true);

-- Create policies for authenticated WRITE access (for admin)
CREATE POLICY "Allow authenticated insert on profile" ON profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on profile" ON profile FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on profile" ON profile FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on experiences" ON experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on experiences" ON experiences FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on experiences" ON experiences FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on education" ON education FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on education" ON education FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on education" ON education FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on skills" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on skills" ON skills FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on skills" ON skills FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on certificates" ON certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on certificates" ON certificates FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on certificates" ON certificates FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on highlights" ON highlights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on highlights" ON highlights FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on highlights" ON highlights FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on stats" ON stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on stats" ON stats FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on stats" ON stats FOR DELETE USING (true);

-- ==========================================
-- INSERT DEFAULT DATA
-- ==========================================

-- Default Profile
INSERT INTO profile (name, role, semester, university, bio, email, location, social)
VALUES (
  'Ahmad Faris',
  'Web Developer & IoT Enthusiast',
  '5',
  'Politeknik Negeri Malang',
  ARRAY['Passionate about building web applications and IoT solutions.', 'Currently pursuing my degree while working on various projects.'],
  'afarisalaziz201@gmail.com',
  'Malang, Indonesia',
  '{"github": "https://github.com/ahmdfariiss", "linkedin": "https://linkedin.com", "instagram": "https://instagram.com", "twitter": "https://twitter.com"}'
);

-- Default Skills
INSERT INTO skills (name, level, category, icon, order_index) VALUES
('React', 90, 'frontend', 'FaReact', 1),
('Next.js', 85, 'frontend', 'SiNextdotjs', 2),
('TypeScript', 80, 'language', 'SiTypescript', 3),
('JavaScript', 90, 'language', 'SiJavascript', 4),
('Tailwind CSS', 85, 'frontend', 'SiTailwindcss', 5),
('Node.js', 75, 'backend', 'FaNodeJs', 6),
('Python', 70, 'language', 'FaPython', 7),
('Arduino', 80, 'iot', 'SiArduino', 8),
('ESP32', 75, 'iot', 'SiEspressif', 9),
('Git', 85, 'tools', 'FaGitAlt', 10);

-- Default Stats
INSERT INTO stats (value, label, order_index) VALUES
('10+', 'Projects', 1),
('2+', 'Years Exp', 2),
('3.8', 'GPA', 3);

-- Default Highlights
INSERT INTO highlights (icon, title, description, order_index) VALUES
('FaCode', 'Web Development', 'Building modern web apps', 1),
('FaRocket', 'IoT Projects', 'Smart devices & automation', 2);

-- ==========================================
-- INDEXES FOR BETTER PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(order_index);
CREATE INDEX IF NOT EXISTS idx_education_order ON education(order_index);
CREATE INDEX IF NOT EXISTS idx_certificates_order ON certificates(order_index);

-- ==========================================
-- DONE!
-- ==========================================
-- Setelah menjalankan SQL ini:
-- 1. Buka Project Settings > API
-- 2. Copy Project URL dan anon key
-- 3. Tambahkan ke .env.local:
--    NEXT_PUBLIC_SUPABASE_URL=your_url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
-- 4. Deploy ulang ke Vercel dengan env variables
-- ==========================================
