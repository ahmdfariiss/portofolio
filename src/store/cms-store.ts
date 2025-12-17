// ==========================================
// CMS Zustand Store
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CMSProfile,
  CMSProject,
  CMSExperience,
  CMSEducation,
  CMSSkill,
  CMSHighlight,
  CMSStat,
  CMSSettings,
  CMSCertificate,
} from '@/types/cms';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// ==========================================
// Default Data
// ==========================================

const defaultProfile: CMSProfile = {
  name: 'Your Name',
  role: ['Web Developer', 'IoT Enthusiast', 'Creative Coder'],
  semester: '5',
  year: '2024',
  university: 'Universitas Indonesia',
  bio: [
    'Saya adalah mahasiswa Ilmu Komputer semester 5 dengan passion yang mendalam dalam pengembangan web dan Internet of Things.',
    'Fokus saya adalah menciptakan solusi digital yang tidak hanya fungsional tetapi juga memberikan pengalaman pengguna yang luar biasa.',
  ],
  email: 'email@example.com',
  location: 'Jakarta, Indonesia',
  avatar: '',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
};

const defaultSettings: CMSSettings = {
  siteName: 'Portfolio',
  siteDescription: 'Personal Portfolio Website',
};

// Default Projects
const defaultProjects: CMSProject[] = [
  {
    id: 'p1',
    title: 'Smart Home IoT System',
    description:
      'Sistem otomasi rumah pintar menggunakan ESP32 dan sensor-sensor IoT. Dapat mengontrol lampu, suhu, dan keamanan rumah melalui aplikasi mobile.',
    image: '',
    tech: ['SiArduino', 'SiCplusplus', 'SiFirebase', 'SiReact'],
    github: 'https://github.com',
    demo: '',
    category: 'IoT',
    size: 'large',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce dengan fitur keranjang belanja, pembayaran, dan manajemen produk.',
    image: '',
    tech: ['SiNextdotjs', 'SiTypescript', 'SiTailwindcss', 'SiMongodb'],
    github: 'https://github.com',
    demo: 'https://demo.com',
    category: 'Web',
    size: 'medium',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    title: 'Weather Monitoring Station',
    description:
      'Stasiun pemantau cuaca real-time dengan sensor BME280 dan tampilan web dashboard.',
    image: '',
    tech: ['SiArduino', 'SiPython', 'SiMongodb'],
    github: 'https://github.com',
    demo: '',
    category: 'IoT',
    size: 'small',
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

// Default Experiences
const defaultExperiences: CMSExperience[] = [
  {
    id: 'e1',
    title: 'Frontend Developer Intern',
    organization: 'Tech Startup XYZ',
    period: 'Jun 2024 - Aug 2024',
    description:
      'Mengembangkan fitur-fitur baru untuk aplikasi web menggunakan React dan TypeScript.',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'e2',
    title: 'IoT Research Assistant',
    organization: 'Laboratorium Komputer',
    period: 'Feb 2024 - Present',
    description:
      'Melakukan riset dan pengembangan proyek IoT untuk smart campus.',
    skills: ['Arduino', 'ESP32', 'MQTT', 'Python'],
    createdAt: new Date().toISOString(),
  },
];

// Default Education
const defaultEducation: CMSEducation[] = [
  {
    id: 'edu1',
    title: 'S1 Ilmu Komputer',
    institution: 'Universitas Indonesia',
    period: '2022 - Present',
    description: 'Fokus pada pengembangan web dan Internet of Things.',
    achievements: ['IPK 3.75', 'Asisten Praktikum', 'Juara 2 Hackathon'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'edu2',
    title: 'SMA Jurusan IPA',
    institution: 'SMA Negeri 1',
    period: '2019 - 2022',
    description: 'Fokus pada matematika dan ilmu komputer dasar.',
    achievements: ['Nilai UN Tertinggi', 'Ketua OSIS'],
    createdAt: new Date().toISOString(),
  },
];

// Default Skills
const defaultSkills: CMSSkill[] = [
  { id: 's1', name: 'React', icon: 'SiReact', level: 90, category: 'frontend' },
  {
    id: 's2',
    name: 'Next.js',
    icon: 'SiNextdotjs',
    level: 85,
    category: 'frontend',
  },
  {
    id: 's3',
    name: 'TypeScript',
    icon: 'SiTypescript',
    level: 85,
    category: 'frontend',
  },
  {
    id: 's4',
    name: 'Tailwind CSS',
    icon: 'SiTailwindcss',
    level: 90,
    category: 'frontend',
  },
  {
    id: 's5',
    name: 'Node.js',
    icon: 'SiNodedotjs',
    level: 75,
    category: 'backend',
  },
  {
    id: 's6',
    name: 'MongoDB',
    icon: 'SiMongodb',
    level: 70,
    category: 'backend',
  },
  { id: 's7', name: 'Arduino', icon: 'SiArduino', level: 85, category: 'iot' },
  {
    id: 's8',
    name: 'Python',
    icon: 'SiPython',
    level: 80,
    category: 'backend',
  },
  {
    id: 's9',
    name: 'Firebase',
    icon: 'SiFirebase',
    level: 75,
    category: 'backend',
  },
  { id: 's10', name: 'Git', icon: 'SiGit', level: 85, category: 'tools' },
  { id: 's11', name: 'Figma', icon: 'SiFigma', level: 70, category: 'tools' },
  {
    id: 's12',
    name: 'C++',
    icon: 'SiCplusplus',
    level: 75,
    category: 'backend',
  },
];

// Default Highlights
const defaultHighlights: CMSHighlight[] = [
  {
    id: 'h1',
    icon: 'FaCode',
    title: 'Clean Code',
    desc: 'Menulis kode yang bersih dan mudah dipahami',
  },
  {
    id: 'h2',
    icon: 'FaLightbulb',
    title: 'Problem Solver',
    desc: 'Senang memecahkan masalah kompleks',
  },
  {
    id: 'h3',
    icon: 'FaRocket',
    title: 'Fast Learner',
    desc: 'Cepat beradaptasi dengan teknologi baru',
  },
  {
    id: 'h4',
    icon: 'FaUsers',
    title: 'Team Player',
    desc: 'Kolaboratif dalam tim dan komunikatif',
  },
];

// Default Stats
const defaultStats: CMSStat[] = [
  { id: 'st1', value: '10+', label: 'Projects' },
  { id: 'st2', value: '5', label: 'Semester' },
  { id: 'st3', value: '3.75', label: 'GPA' },
  { id: 'st4', value: '500+', label: 'Commits' },
];

// Default Certificates
const defaultCertificates: CMSCertificate[] = [
  {
    id: 'cert1',
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    image: '',
    date: '2024',
    credentialUrl: 'https://aws.amazon.com/verification',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cert2',
    name: 'React Developer Certificate',
    issuer: 'Meta',
    image: '',
    date: '2024',
    credentialUrl: 'https://coursera.org/verify',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cert3',
    name: 'IoT Fundamentals',
    issuer: 'Cisco Networking Academy',
    image: '',
    date: '2023',
    credentialUrl: '',
    createdAt: new Date().toISOString(),
  },
];

// ==========================================
// Store Interface
// ==========================================

interface CMSState {
  // Auth
  isAuthenticated: boolean;

  // Data
  profile: CMSProfile;
  projects: CMSProject[];
  experiences: CMSExperience[];
  education: CMSEducation[];
  skills: CMSSkill[];
  highlights: CMSHighlight[];
  stats: CMSStat[];
  certificates: CMSCertificate[];
  settings: CMSSettings;

  // Auth Actions
  login: (password: string) => boolean;
  logout: () => void;

  // Profile Actions
  updateProfile: (data: Partial<CMSProfile>) => void;

  // Project Actions
  addProject: (data: Omit<CMSProject, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, data: Partial<CMSProject>) => void;
  deleteProject: (id: string) => void;

  // Experience Actions
  addExperience: (data: Omit<CMSExperience, 'id' | 'createdAt'>) => void;
  updateExperience: (id: string, data: Partial<CMSExperience>) => void;
  deleteExperience: (id: string) => void;

  // Education Actions
  addEducation: (data: Omit<CMSEducation, 'id' | 'createdAt'>) => void;
  updateEducation: (id: string, data: Partial<CMSEducation>) => void;
  deleteEducation: (id: string) => void;

  // Skill Actions
  addSkill: (data: Omit<CMSSkill, 'id'>) => void;
  updateSkill: (id: string, data: Partial<CMSSkill>) => void;
  deleteSkill: (id: string) => void;

  // Highlight Actions
  updateHighlights: (highlights: CMSHighlight[]) => void;

  // Stat Actions
  updateStats: (stats: CMSStat[]) => void;

  // Certificate Actions
  addCertificate: (data: Omit<CMSCertificate, 'id' | 'createdAt'>) => void;
  updateCertificate: (id: string, data: Partial<CMSCertificate>) => void;
  deleteCertificate: (id: string) => void;

  // Settings Actions
  updateSettings: (data: Partial<CMSSettings>) => void;
}

// Admin password (ganti dengan password Anda)
const ADMIN_PASSWORD = 'admin123';

// ==========================================
// Create Store
// ==========================================

export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      // Initial State - With default data
      isAuthenticated: false,
      profile: defaultProfile,
      projects: defaultProjects,
      experiences: defaultExperiences,
      education: defaultEducation,
      skills: defaultSkills,
      highlights: defaultHighlights,
      stats: defaultStats,
      certificates: defaultCertificates,
      settings: defaultSettings,

      // Auth Actions
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      // Profile Actions
      updateProfile: (data) =>
        set((state) => ({ profile: { ...state.profile, ...data } })),

      // Project Actions
      addProject: (data) =>
        set((state) => ({
          projects: [
            { ...data, id: generateId(), createdAt: new Date().toISOString() },
            ...state.projects,
          ],
        })),

      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      // Experience Actions
      addExperience: (data) =>
        set((state) => ({
          experiences: [
            { ...data, id: generateId(), createdAt: new Date().toISOString() },
            ...state.experiences,
          ],
        })),

      updateExperience: (id, data) =>
        set((state) => ({
          experiences: state.experiences.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteExperience: (id) =>
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== id),
        })),

      // Education Actions
      addEducation: (data) =>
        set((state) => ({
          education: [
            { ...data, id: generateId(), createdAt: new Date().toISOString() },
            ...state.education,
          ],
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          education: state.education.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      deleteEducation: (id) =>
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        })),

      // Skill Actions
      addSkill: (data) =>
        set((state) => ({
          skills: [...state.skills, { ...data, id: generateId() }],
        })),

      updateSkill: (id, data) =>
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),

      // Highlight Actions
      updateHighlights: (highlights) => set({ highlights }),

      // Stat Actions
      updateStats: (stats) => set({ stats }),

      // Certificate Actions
      addCertificate: (data) =>
        set((state) => ({
          certificates: [
            { ...data, id: generateId(), createdAt: new Date().toISOString() },
            ...state.certificates,
          ],
        })),

      updateCertificate: (id, data) =>
        set((state) => ({
          certificates: state.certificates.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteCertificate: (id) =>
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id),
        })),

      // Settings Actions
      updateSettings: (data) =>
        set((state) => ({ settings: { ...state.settings, ...data } })),
    }),
    {
      name: 'portfolio-cms',
    }
  )
);
