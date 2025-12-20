import { createClient } from '@supabase/supabase-js';

// ==========================================
// Supabase Configuration
// ==========================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug log
console.log('=== SUPABASE INIT ===');
console.log('URL:', supabaseUrl ? supabaseUrl : 'MISSING!');
console.log(
  'Key:',
  supabaseKey ? supabaseKey.substring(0, 30) + '...' : 'MISSING!'
);
console.log('=====================');

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE ENV VARS MISSING! Check .env.local file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public',
  },
});

// ==========================================
// Database Types
// ==========================================

export interface DBProfile {
  id: string;
  name: string;
  role: string[];
  semester: string;
  university: string;
  bio: string[];
  email: string;
  phone: string;
  location: string;
  avatar: string | null;
  social: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  year?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBProject {
  id: string;
  title: string;
  description: string;
  full_description: string | null;
  image: string | null;
  gallery: string[];
  tech: string[];
  category: string;
  github: string | null;
  demo: string | null;
  featured: boolean;
  size: 'small' | 'medium' | 'large';
  features: string[];
  challenges: string | null;
  solutions: string | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface DBExperience {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  skills: string[];
  order_index: number;
  created_at?: string;
}

export interface DBEducation {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  achievements: string[];
  order_index: number;
  created_at?: string;
}

export interface DBSkill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order_index: number;
  created_at?: string;
}

export interface DBCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  image: string | null;
  credential_url: string | null;
  order_index: number;
  created_at?: string;
}

export interface DBHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
  order_index: number;
}

export interface DBStat {
  id: string;
  value: string;
  label: string;
  order_index: number;
}

// ==========================================
// Database Operations - CRUD Functions
// ==========================================

// Profile Operations
export const profileOperations = {
  async get() {
    console.log('profileOperations.get() called');
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();
      console.log('profileOperations.get() result:', { data, error });
      if (error) throw error;
      return data as DBProfile;
    } catch (err) {
      console.error('profileOperations.get() error:', err);
      throw err;
    }
  },

  async update(profile: Partial<DBProfile>) {
    const { data, error } = await supabase
      .from('profile')
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select()
      .single();
    if (error) throw error;
    return data as DBProfile;
  },
};

// Projects Operations
export const projectsOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as DBProject[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as DBProject;
  },

  async create(project: Omit<DBProject, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data as DBProject;
  },

  async update(id: string, project: Partial<DBProject>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DBProject;
  },

  async delete(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};

// Experiences Operations
export const experiencesOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as DBExperience[];
  },

  async create(experience: Omit<DBExperience, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('experiences')
      .insert(experience)
      .select()
      .single();
    if (error) throw error;
    return data as DBExperience;
  },

  async update(id: string, experience: Partial<DBExperience>) {
    const { data, error } = await supabase
      .from('experiences')
      .update(experience)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DBExperience;
  },

  async delete(id: string) {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
  },
};

// Education Operations
export const educationOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as DBEducation[];
  },

  async create(education: Omit<DBEducation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('education')
      .insert(education)
      .select()
      .single();
    if (error) throw error;
    return data as DBEducation;
  },

  async update(id: string, education: Partial<DBEducation>) {
    const { data, error } = await supabase
      .from('education')
      .update(education)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DBEducation;
  },

  async delete(id: string) {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
  },
};

// Skills Operations
export const skillsOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as DBSkill[];
  },

  async create(skill: Omit<DBSkill, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();
    if (error) throw error;
    return data as DBSkill;
  },

  async update(id: string, skill: Partial<DBSkill>) {
    const { data, error } = await supabase
      .from('skills')
      .update(skill)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DBSkill;
  },

  async delete(id: string) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },
};

// Certificates Operations
export const certificatesOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as DBCertificate[];
  },

  async create(certificate: Omit<DBCertificate, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single();
    if (error) throw error;
    return data as DBCertificate;
  },

  async update(id: string, certificate: Partial<DBCertificate>) {
    const { data, error } = await supabase
      .from('certificates')
      .update(certificate)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DBCertificate;
  },

  async delete(id: string) {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw error;
  },
};

// Highlights Operations
export const highlightsOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as DBHighlight[];
  },

  async create(highlight: Omit<DBHighlight, 'id'>) {
    const { data, error } = await supabase
      .from('highlights')
      .insert(highlight)
      .select()
      .single();
    if (error) throw error;
    return data as DBHighlight;
  },

  async update(id: string, highlight: Partial<DBHighlight>) {
    const { data, error } = await supabase
      .from('highlights')
      .update(highlight)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DBHighlight;
  },

  async delete(id: string) {
    const { error } = await supabase.from('highlights').delete().eq('id', id);
    if (error) throw error;
  },
};

// Stats Operations
export const statsOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as DBStat[];
  },

  async create(stat: Omit<DBStat, 'id'>) {
    const { data, error } = await supabase
      .from('stats')
      .insert(stat)
      .select()
      .single();
    if (error) throw error;
    return data as DBStat;
  },

  async update(id: string, stat: Partial<DBStat>) {
    const { data, error } = await supabase
      .from('stats')
      .update(stat)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as DBStat;
  },

  async delete(id: string) {
    const { error } = await supabase.from('stats').delete().eq('id', id);
    if (error) throw error;
  },
};
