'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  supabase,
  DBProfile,
  DBProject,
  DBExperience,
  DBEducation,
  DBSkill,
  DBCertificate,
  DBHighlight,
  DBStat,
  profileOperations,
  projectsOperations,
  experiencesOperations,
  educationOperations,
  skillsOperations,
  certificatesOperations,
  highlightsOperations,
  statsOperations,
} from '@/lib/supabase';
import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiMongodb,
  SiArduino,
  SiFirebase,
  SiCplusplus,
  SiEspressif,
  SiMqtt,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiPrisma,
  SiSupabase,
  SiVercel,
  SiGithub,
  SiHtml5,
  SiCss3,
  SiSass,
  SiBootstrap,
  SiExpress,
  SiNestjs,
  SiGraphql,
  SiRedis,
  SiAmazonwebservices,
  SiGooglecloud,
  SiLinux,
  SiNginx,
  SiJenkins,
  SiKubernetes,
  SiTerraform,
  SiFlutter,
  SiReact as SiReactNative,
  SiElectron,
  SiUnity,
  SiBlender,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiWordpress,
  SiShopify,
  SiStripe,
  SiTwilio,
  SiOpenai,
  SiTensorflow,
  SiPytorch,
  SiJupyter,
  SiNumpy,
  SiPandas,
  SiRaspberrypi,
  SiZigbee,
  SiHomeassistant,
} from 'react-icons/si';
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaFigma,
  FaCode,
  FaLaptopCode,
  FaRocket,
  FaGraduationCap,
  FaBriefcase,
  FaAward,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

// ==========================================
// Icon Mapping
// ==========================================
const iconMap: Record<string, IconType> = {
  // React ecosystem
  SiReact: FaReact,
  FaReact: FaReact,
  React: FaReact,
  SiNextdotjs: SiNextdotjs,
  'Next.js': SiNextdotjs,
  Nextjs: SiNextdotjs,

  // Languages
  SiTypescript: SiTypescript,
  TypeScript: SiTypescript,
  SiJavascript: SiJavascript,
  JavaScript: SiJavascript,
  SiPython: FaPython,
  FaPython: FaPython,
  Python: FaPython,
  SiCplusplus: SiCplusplus,
  'C++': SiCplusplus,
  Cpp: SiCplusplus,

  // Styling
  SiTailwindcss: SiTailwindcss,
  Tailwind: SiTailwindcss,
  TailwindCSS: SiTailwindcss,
  SiHtml5: SiHtml5,
  HTML: SiHtml5,
  SiCss3: SiCss3,
  CSS: SiCss3,
  SiSass: SiSass,
  Sass: SiSass,
  SCSS: SiSass,
  SiBootstrap: SiBootstrap,
  Bootstrap: SiBootstrap,

  // Backend
  SiNodedotjs: FaNodeJs,
  FaNodeJs: FaNodeJs,
  'Node.js': FaNodeJs,
  NodeJS: FaNodeJs,
  SiExpress: SiExpress,
  Express: SiExpress,
  SiNestjs: SiNestjs,
  NestJS: SiNestjs,
  SiGraphql: SiGraphql,
  GraphQL: SiGraphql,

  // Databases
  SiMongodb: SiMongodb,
  MongoDB: SiMongodb,
  SiPostgresql: SiPostgresql,
  PostgreSQL: SiPostgresql,
  Postgres: SiPostgresql,
  SiMysql: SiMysql,
  MySQL: SiMysql,
  SiRedis: SiRedis,
  Redis: SiRedis,
  SiPrisma: SiPrisma,
  Prisma: SiPrisma,
  SiSupabase: SiSupabase,
  Supabase: SiSupabase,
  SiFirebase: SiFirebase,
  Firebase: SiFirebase,

  // DevOps & Cloud
  SiDocker: SiDocker,
  Docker: SiDocker,
  SiKubernetes: SiKubernetes,
  Kubernetes: SiKubernetes,
  K8s: SiKubernetes,
  SiVercel: SiVercel,
  Vercel: SiVercel,
  SiAmazonwebservices: SiAmazonwebservices,
  AWS: SiAmazonwebservices,
  SiGooglecloud: SiGooglecloud,
  GCP: SiGooglecloud,
  SiLinux: SiLinux,
  Linux: SiLinux,
  SiNginx: SiNginx,
  Nginx: SiNginx,
  SiJenkins: SiJenkins,
  Jenkins: SiJenkins,
  SiTerraform: SiTerraform,
  Terraform: SiTerraform,

  // Tools
  SiGit: FaGitAlt,
  FaGitAlt: FaGitAlt,
  Git: FaGitAlt,
  SiGithub: SiGithub,
  GitHub: SiGithub,
  SiFigma: FaFigma,
  FaFigma: FaFigma,
  Figma: FaFigma,

  // IoT
  SiArduino: SiArduino,
  Arduino: SiArduino,
  SiEspressif: SiEspressif,
  ESP32: SiEspressif,
  ESP8266: SiEspressif,
  SiMqtt: SiMqtt,
  MQTT: SiMqtt,
  SiRaspberrypi: SiRaspberrypi,
  RaspberryPi: SiRaspberrypi,
  'Raspberry Pi': SiRaspberrypi,
  SiZigbee: SiZigbee,
  Zigbee: SiZigbee,
  SiHomeassistant: SiHomeassistant,
  HomeAssistant: SiHomeassistant,

  // Mobile & Desktop
  SiFlutter: SiFlutter,
  Flutter: SiFlutter,
  SiReactNative: SiReactNative,
  ReactNative: SiReactNative,
  'React Native': SiReactNative,
  SiElectron: SiElectron,
  Electron: SiElectron,

  // Design
  SiAdobephotoshop: SiAdobephotoshop,
  Photoshop: SiAdobephotoshop,
  SiAdobeillustrator: SiAdobeillustrator,
  Illustrator: SiAdobeillustrator,
  SiBlender: SiBlender,
  Blender: SiBlender,
  SiUnity: SiUnity,
  Unity: SiUnity,

  // AI/ML
  SiOpenai: SiOpenai,
  OpenAI: SiOpenai,
  SiTensorflow: SiTensorflow,
  TensorFlow: SiTensorflow,
  SiPytorch: SiPytorch,
  PyTorch: SiPytorch,
  SiJupyter: SiJupyter,
  Jupyter: SiJupyter,
  SiNumpy: SiNumpy,
  NumPy: SiNumpy,
  SiPandas: SiPandas,
  Pandas: SiPandas,

  // E-commerce
  SiWordpress: SiWordpress,
  WordPress: SiWordpress,
  SiShopify: SiShopify,
  Shopify: SiShopify,
  SiStripe: SiStripe,
  Stripe: SiStripe,
  SiTwilio: SiTwilio,
  Twilio: SiTwilio,

  // Generic
  FaCode: FaCode,
  Code: FaCode,
  FaLaptopCode: FaLaptopCode,
  FaRocket: FaRocket,
  FaGraduationCap: FaGraduationCap,
  FaBriefcase: FaBriefcase,
  FaAward: FaAward,
};

// Helper to get icon component
export function getIconComponent(iconName: string): IconType | null {
  return iconMap[iconName] || null;
}

// ==========================================
// Default Data (Fallback)
// ==========================================
const defaultProfile: DBProfile = {
  id: 'default',
  name: 'Your Name',
  role: ['Web Developer', 'IoT Enthusiast'],
  semester: '5',
  university: 'Your University',
  bio: [
    'Passionate about building web applications and IoT solutions.',
    'Currently learning and exploring new technologies.',
  ],
  email: 'your@email.com',
  phone: '+62 xxx xxxx xxxx',
  location: 'Indonesia',
  avatar: null,
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  year: new Date().getFullYear().toString(),
};

// ==========================================
// React Hooks for Data Fetching
// ==========================================

// Profile Hook
export function useSupabaseProfile() {
  const [profile, setProfile] = useState<DBProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching profile from Supabase...');
      const data = await profileOperations.get();
      console.log('Profile fetched:', data);
      if (data) setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<DBProfile>) => {
    try {
      const updated = await profileOperations.update({
        ...updates,
        id: profile.id,
      });
      setProfile(updated);
      return updated;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}

// Projects Hook
export function useSupabaseProjects() {
  const [projects, setProjects] = useState<
    (DBProject & { techIcons: IconType[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsOperations.getAll();
      const projectsWithIcons = data.map((project) => ({
        ...project,
        techIcons: project.tech
          .map((techName) => getIconComponent(techName))
          .filter(Boolean) as IconType[],
      }));
      setProjects(projectsWithIcons);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (
    project: Omit<DBProject, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const created = await projectsOperations.create(project);
    await fetchProjects();
    return created;
  };

  const updateProject = async (id: string, updates: Partial<DBProject>) => {
    const updated = await projectsOperations.update(id, updates);
    await fetchProjects();
    return updated;
  };

  const deleteProject = async (id: string) => {
    await projectsOperations.delete(id);
    await fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
}

// Single Project Hook
export function useSupabaseProject(id: string) {
  const [project, setProject] = useState<
    (DBProject & { techIcons: IconType[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await projectsOperations.getById(id);
        if (data) {
          setProject({
            ...data,
            techIcons: data.tech
              .map((techName) => getIconComponent(techName))
              .filter(Boolean) as IconType[],
          });
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to fetch project');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  return { project, loading, error };
}

// Experiences Hook
export function useSupabaseExperiences() {
  const [experiences, setExperiences] = useState<DBExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await experiencesOperations.getAll();
      setExperiences(data);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const addExperience = async (
    experience: Omit<DBExperience, 'id' | 'created_at'>
  ) => {
    const created = await experiencesOperations.create(experience);
    await fetchExperiences();
    return created;
  };

  const updateExperience = async (
    id: string,
    updates: Partial<DBExperience>
  ) => {
    const updated = await experiencesOperations.update(id, updates);
    await fetchExperiences();
    return updated;
  };

  const deleteExperience = async (id: string) => {
    await experiencesOperations.delete(id);
    await fetchExperiences();
  };

  return {
    experiences,
    loading,
    error,
    addExperience,
    updateExperience,
    deleteExperience,
    refetch: fetchExperiences,
  };
}

// Education Hook
export function useSupabaseEducation() {
  const [education, setEducation] = useState<DBEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true);
      const data = await educationOperations.getAll();
      setEducation(data);
    } catch (err) {
      console.error('Error fetching education:', err);
      setError('Failed to fetch education');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const addEducation = async (edu: Omit<DBEducation, 'id' | 'created_at'>) => {
    const created = await educationOperations.create(edu);
    await fetchEducation();
    return created;
  };

  const updateEducation = async (id: string, updates: Partial<DBEducation>) => {
    const updated = await educationOperations.update(id, updates);
    await fetchEducation();
    return updated;
  };

  const deleteEducation = async (id: string) => {
    await educationOperations.delete(id);
    await fetchEducation();
  };

  return {
    education,
    loading,
    error,
    addEducation,
    updateEducation,
    deleteEducation,
    refetch: fetchEducation,
  };
}

// Skills Hook
export function useSupabaseSkills() {
  const [skills, setSkills] = useState<
    (DBSkill & { IconComponent: IconType | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await skillsOperations.getAll();
      const skillsWithIcons = data.map((skill) => ({
        ...skill,
        IconComponent: getIconComponent(skill.icon),
      }));
      setSkills(skillsWithIcons);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const addSkill = async (skill: Omit<DBSkill, 'id' | 'created_at'>) => {
    const created = await skillsOperations.create(skill);
    await fetchSkills();
    return created;
  };

  const updateSkill = async (id: string, updates: Partial<DBSkill>) => {
    const updated = await skillsOperations.update(id, updates);
    await fetchSkills();
    return updated;
  };

  const deleteSkill = async (id: string) => {
    await skillsOperations.delete(id);
    await fetchSkills();
  };

  return {
    skills,
    loading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    refetch: fetchSkills,
  };
}

// Certificates Hook
export function useSupabaseCertificates() {
  const [certificates, setCertificates] = useState<DBCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await certificatesOperations.getAll();
      setCertificates(data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const addCertificate = async (
    cert: Omit<DBCertificate, 'id' | 'created_at'>
  ) => {
    const created = await certificatesOperations.create(cert);
    await fetchCertificates();
    return created;
  };

  const updateCertificate = async (
    id: string,
    updates: Partial<DBCertificate>
  ) => {
    const updated = await certificatesOperations.update(id, updates);
    await fetchCertificates();
    return updated;
  };

  const deleteCertificate = async (id: string) => {
    await certificatesOperations.delete(id);
    await fetchCertificates();
  };

  return {
    certificates,
    loading,
    error,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    refetch: fetchCertificates,
  };
}

// Highlights Hook
export function useSupabaseHighlights() {
  const [highlights, setHighlights] = useState<
    (DBHighlight & { IconComponent: IconType | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHighlights = useCallback(async () => {
    try {
      setLoading(true);
      const data = await highlightsOperations.getAll();
      const highlightsWithIcons = data.map((highlight) => ({
        ...highlight,
        IconComponent: getIconComponent(highlight.icon),
      }));
      setHighlights(highlightsWithIcons);
    } catch (err) {
      console.error('Error fetching highlights:', err);
      setError('Failed to fetch highlights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return { highlights, loading, error, refetch: fetchHighlights };
}

// Stats Hook
export function useSupabaseStats() {
  const [stats, setStats] = useState<DBStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statsOperations.getAll();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// ==========================================
// Real-time Subscription Hooks (Optional)
// ==========================================
export function useRealtimeProjects() {
  const { projects, loading, error, refetch } = useSupabaseProjects();

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { projects, loading, error };
}
