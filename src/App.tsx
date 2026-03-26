import { lazy, Suspense } from 'react';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import SocialSidebar from './components/layout/SocialSidebar';
import Hero from './components/sections/Hero';
import SectionDivider from './components/ui/SectionDivider';

// Lazy load below-fold sections to reduce critical JS bundle size
// This keeps them out of the main chunk, improving LCP on slow connections
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Projects = lazy(() => import('./components/sections/Projects'));
const GitHubStats = lazy(() => import('./components/sections/GitHubStats'));
const Contact = lazy(() => import('./components/sections/Contact'));
const ChatBot = lazy(() => import('./components/ChatBot'));

function App() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] overflow-x-hidden">
      <Navbar />
      <SocialSidebar />
      {/* Lazy load ChatBot - deferred to reduce initial JS bundle */}
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
      <main className="lg:ml-16">
        <Hero />
        <SectionDivider variant="gradient" />
        {/* Below-fold sections: lazy-loaded + content-visibility for deferred rendering */}
        <Suspense fallback={null}>
          <div className="content-defer">
            <About />
          </div>
          <SectionDivider variant="gradient" />
          <div className="content-defer">
            <Skills />
          </div>
          <SectionDivider variant="gradient" />
          <div className="content-defer">
            <Projects />
          </div>
          <SectionDivider variant="gradient" />
          <div className="content-defer">
            <GitHubStats />
          </div>
          <SectionDivider variant="gradient" />
          <div className="content-defer">
            <Contact />
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
