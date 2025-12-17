// ==========================================
// CMS Types
// ==========================================

export interface CMSProfile {
  name: string;
  role: string[];
  semester: string;
  year: string;
  university: string;
  bio: string[];
  email: string;
  location: string;
  avatar: string; // URL atau base64 image
  social: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
  };
}

export interface CMSProject {
  id: string;
  title: string;
  description: string;
  fullDescription?: string; // Detail lengkap project
  image: string; // URL atau base64 image
  gallery?: string[]; // Multiple images for detail page
  category: 'Web' | 'IoT' | 'Other';
  tech: string[];
  features?: string[]; // Fitur-fitur project
  challenges?: string; // Tantangan dalam pembuatan
  solutions?: string; // Solusi yang diterapkan
  github: string;
  demo: string;
  featured: boolean;
  size: 'small' | 'medium' | 'large';
  createdAt: string;
}

export interface CMSExperience {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  skills: string[];
  createdAt: string;
}

export interface CMSEducation {
  id: string;
  title: string;
  institution: string;
  period: string;
  description: string;
  achievements: string[];
  createdAt: string;
}

export interface CMSSkill {
  id: string;
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'iot' | 'tools';
  icon: string;
}

export interface CMSHighlight {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface CMSStat {
  id: string;
  value: string;
  label: string;
}

export interface CMSSettings {
  siteName: string;
  siteDescription: string;
}

// Certificate Type
export interface CMSCertificate {
  id: string;
  name: string;
  issuer: string; // Instansi penerbit
  image: string; // Gambar sertifikat
  date: string; // Tanggal diterbitkan
  credentialUrl?: string; // Link verifikasi (optional)
  createdAt: string;
}
