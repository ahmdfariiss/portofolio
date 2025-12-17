'use client';

import { useMemo } from 'react';
import { useCMSStore } from '@/store/cms-store';
import { FaCode, FaLightbulb, FaRocket, FaUsers } from 'react-icons/fa';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiArduino,
  SiPython,
  SiFirebase,
  SiGit,
  SiFigma,
  SiCplusplus,
} from 'react-icons/si';

// Default fallback data
const defaultSkillsData = [
  { name: 'React', icon: SiReact, level: 90, category: 'frontend' },
  { name: 'Next.js', icon: SiNextdotjs, level: 85, category: 'frontend' },
  { name: 'TypeScript', icon: SiTypescript, level: 85, category: 'frontend' },
  {
    name: 'Tailwind CSS',
    icon: SiTailwindcss,
    level: 90,
    category: 'frontend',
  },
  { name: 'Node.js', icon: SiNodedotjs, level: 75, category: 'backend' },
  { name: 'MongoDB', icon: SiMongodb, level: 70, category: 'backend' },
  { name: 'Arduino', icon: SiArduino, level: 85, category: 'iot' },
  { name: 'Python', icon: SiPython, level: 80, category: 'backend' },
  { name: 'Firebase', icon: SiFirebase, level: 75, category: 'backend' },
  { name: 'Git', icon: SiGit, level: 85, category: 'tools' },
  { name: 'Figma', icon: SiFigma, level: 70, category: 'tools' },
  { name: 'C++', icon: SiCplusplus, level: 75, category: 'backend' },
];

const defaultProjectsData = [
  {
    title: 'Smart Home IoT System',
    description:
      'Sistem otomasi rumah pintar menggunakan ESP32 dan sensor-sensor IoT.',
    image: '',
    tech: [SiArduino, SiCplusplus, SiFirebase, SiReact],
    github: 'https://github.com',
    demo: '',
    category: 'IoT',
    size: 'large' as const,
    featured: true,
  },
  {
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce dengan fitur keranjang belanja dan pembayaran.',
    image: '',
    tech: [SiNextdotjs, SiTypescript, SiTailwindcss, SiMongodb],
    github: 'https://github.com',
    demo: 'https://demo.com',
    category: 'Web',
    size: 'medium' as const,
    featured: true,
  },
  {
    title: 'Weather Monitoring Station',
    description: 'Stasiun pemantau cuaca real-time dengan sensor BME280.',
    image: '',
    tech: [SiArduino, SiPython, SiMongodb],
    github: 'https://github.com',
    demo: '',
    category: 'IoT',
    size: 'small' as const,
    featured: false,
  },
];

const defaultExperiencesData = [
  {
    title: 'Frontend Developer Intern',
    organization: 'Tech Startup XYZ',
    period: 'Jun 2024 - Aug 2024',
    description:
      'Mengembangkan fitur-fitur baru untuk aplikasi web menggunakan React.',
    type: 'work' as const,
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'IoT Research Assistant',
    organization: 'Laboratorium Komputer',
    period: 'Feb 2024 - Present',
    description: 'Riset dan pengembangan proyek IoT untuk smart campus.',
    type: 'work' as const,
    skills: ['Arduino', 'ESP32', 'MQTT', 'Python'],
  },
];

const defaultEducationData = [
  {
    title: 'S1 Ilmu Komputer',
    institution: 'Universitas Indonesia',
    period: '2022 - Present',
    description: 'Fokus pada pengembangan web dan Internet of Things.',
    achievements: ['IPK 3.75', 'Asisten Praktikum', 'Juara 2 Hackathon'],
  },
  {
    title: 'SMA Jurusan IPA',
    institution: 'SMA Negeri 1',
    period: '2019 - 2022',
    description: 'Fokus pada matematika dan ilmu komputer dasar.',
    achievements: ['Nilai UN Tertinggi', 'Ketua OSIS'],
  },
];

const defaultHighlightsData = [
  {
    icon: FaCode,
    title: 'Clean Code',
    desc: 'Menulis kode yang bersih dan mudah dipahami',
  },
  {
    icon: FaLightbulb,
    title: 'Problem Solver',
    desc: 'Senang memecahkan masalah kompleks',
  },
  {
    icon: FaRocket,
    title: 'Fast Learner',
    desc: 'Cepat beradaptasi dengan teknologi baru',
  },
  {
    icon: FaUsers,
    title: 'Team Player',
    desc: 'Kolaboratif dalam tim dan komunikatif',
  },
];

const defaultStatsData = [
  { value: '10+', label: 'Projects' },
  { value: '5', label: 'Semester' },
  { value: '3.75', label: 'GPA' },
  { value: '500+', label: 'Commits' },
];

const defaultCertificatesData = [
  {
    id: 'cert1',
    name: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    image: '',
    date: '2024',
    credentialUrl: 'https://aws.amazon.com/verification',
  },
  {
    id: 'cert2',
    name: 'React Developer Certificate',
    issuer: 'Meta',
    image: '',
    date: '2024',
    credentialUrl: 'https://coursera.org/verify',
  },
  {
    id: 'cert3',
    name: 'IoT Fundamentals',
    issuer: 'Cisco Networking Academy',
    image: '',
    date: '2023',
    credentialUrl: '',
  },
];

// Map CMS data to portfolio format
export function useCMSProfile() {
  const profile = useCMSStore((state) => state.profile);
  return profile;
}

export function useCMSSkills() {
  const cmsSkills = useCMSStore((state) => state.skills);

  return useMemo(() => {
    // Return default data if no CMS data
    if (!cmsSkills || cmsSkills.length === 0) {
      return defaultSkillsData;
    }

    // Map CMS skills to portfolio format with dynamic icons
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const icons = require('react-icons/si');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const faIcons = require('react-icons/fa');

    return cmsSkills.map((skill) => {
      const IconComponent =
        icons[skill.icon] || faIcons[skill.icon] || icons.SiCode;
      return {
        name: skill.name,
        icon: IconComponent,
        level: skill.level,
        category: skill.category,
      };
    });
  }, [cmsSkills]);
}

export function useCMSExperiences() {
  const cmsExperiences = useCMSStore((state) => state.experiences);

  return useMemo(() => {
    // Return default data if no CMS data
    if (!cmsExperiences || cmsExperiences.length === 0) {
      return defaultExperiencesData;
    }

    return cmsExperiences.map((exp) => ({
      title: exp.title,
      organization: exp.organization,
      period: exp.period,
      description: exp.description,
      type: 'work' as const,
      skills: exp.skills || [],
    }));
  }, [cmsExperiences]);
}

export function useCMSEducation() {
  const cmsEducation = useCMSStore((state) => state.education);

  return useMemo(() => {
    // Return default data if no CMS data
    if (!cmsEducation || cmsEducation.length === 0) {
      return defaultEducationData;
    }

    return cmsEducation.map((edu) => ({
      title: edu.title,
      institution: edu.institution,
      period: edu.period,
      description: edu.description,
      achievements: edu.achievements || [],
    }));
  }, [cmsEducation]);
}

export function useCMSProjects() {
  const cmsProjects = useCMSStore((state) => state.projects);

  return useMemo(() => {
    // Return default data if no CMS data
    if (!cmsProjects || cmsProjects.length === 0) {
      return defaultProjectsData;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const siIcons = require('react-icons/si');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const faIcons = require('react-icons/fa');

    return cmsProjects.map((project) => ({
      title: project.title,
      description: project.description,
      image: project.image || '',
      tech: project.tech.map((iconName: string) => {
        return siIcons[iconName] || faIcons[iconName] || siIcons.SiCode;
      }),
      github: project.github,
      demo: project.demo,
      category: project.category,
      size: project.size as 'large' | 'medium' | 'small',
      featured: project.featured || false,
    }));
  }, [cmsProjects]);
}

export function useCMSHighlights() {
  const cmsHighlights = useCMSStore((state) => state.highlights);

  return useMemo(() => {
    // Return default data if no CMS data
    if (!cmsHighlights || cmsHighlights.length === 0) {
      return defaultHighlightsData;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const faIcons = require('react-icons/fa');

    return cmsHighlights.map((highlight) => ({
      icon: faIcons[highlight.icon] || faIcons.FaCode,
      title: highlight.title,
      desc: highlight.desc,
    }));
  }, [cmsHighlights]);
}

export function useCMSStats() {
  const cmsStats = useCMSStore((state) => state.stats);

  return useMemo(() => {
    // Return default data if no CMS data
    if (!cmsStats || cmsStats.length === 0) {
      return defaultStatsData;
    }

    return cmsStats.map((stat) => ({
      value: stat.value,
      label: stat.label,
    }));
  }, [cmsStats]);
}

export function useCMSSettings() {
  const settings = useCMSStore((state) => state.settings);
  return settings;
}

export function useCMSCertificates() {
  const cmsCertificates = useCMSStore((state) => state.certificates);

  return useMemo(() => {
    // Return default data if no CMS data
    if (!cmsCertificates || cmsCertificates.length === 0) {
      return defaultCertificatesData;
    }

    return cmsCertificates.map((cert) => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      image: cert.image || '',
      date: cert.date,
      credentialUrl: cert.credentialUrl || '',
    }));
  }, [cmsCertificates]);
}

// Get project by ID for detail page
export function useCMSProjectById(id: string) {
  const cmsProjects = useCMSStore((state) => state.projects);

  return useMemo(() => {
    const project = cmsProjects.find((p) => p.id === id);
    if (!project) return null;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const siIcons = require('react-icons/si');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const faIcons = require('react-icons/fa');

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      fullDescription: project.fullDescription || project.description,
      image: project.image || '',
      gallery: project.gallery || [],
      tech: project.tech.map((iconName: string) => {
        return siIcons[iconName] || faIcons[iconName] || siIcons.SiCode;
      }),
      techNames: project.tech,
      features: project.features || [],
      challenges: project.challenges || '',
      solutions: project.solutions || '',
      github: project.github,
      demo: project.demo,
      category: project.category,
      size: project.size as 'large' | 'medium' | 'small',
      featured: project.featured || false,
      createdAt: project.createdAt,
    };
  }, [cmsProjects, id]);
}

// Get all projects with ID for linking
export function useCMSProjectsWithId() {
  const cmsProjects = useCMSStore((state) => state.projects);

  return useMemo(() => {
    // Return default data with IDs if no CMS data
    if (!cmsProjects || cmsProjects.length === 0) {
      return defaultProjectsData.map((project, index) => ({
        ...project,
        id: `default-${index}`,
      }));
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const siIcons = require('react-icons/si');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const faIcons = require('react-icons/fa');

    return cmsProjects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image || '',
      tech: project.tech
        .map((iconName: string) => {
          const icon = siIcons[iconName] || faIcons[iconName];
          return icon || null; // Return null instead of undefined icon
        })
        .filter(Boolean), // Filter out null values
      github: project.github,
      demo: project.demo,
      category: project.category,
      size: project.size as 'large' | 'medium' | 'small',
      featured: project.featured || false,
    }));
  }, [cmsProjects]);
}
