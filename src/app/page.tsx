import {
  Navbar,
  ParticleBackground,
  Hero,
  About,
  Skills,
  Experience,
  Projects,
  Certificates,
  Contact,
  Footer,
  LoadingScreen,
  CustomCursor,
} from '@/components';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Loading Screen */}
      <LoadingScreen />

      {/* Particle Background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills />

      {/* Experience Section */}
      <Experience />

      {/* Projects Section */}
      <Projects />

      {/* Certificates Section */}
      <Certificates />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
