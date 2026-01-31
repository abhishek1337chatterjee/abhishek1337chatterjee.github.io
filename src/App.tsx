import { Suspense, lazy } from 'react';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import SocialSidebar from './components/layout/SocialSidebar';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import GitHubStats from './components/sections/GitHubStats';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import SectionDivider from './components/ui/SectionDivider';

// Lazy load ChatBot - not needed for initial render and has heavy dependencies
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
        {/* Below-fold sections use content-visibility for deferred rendering */}
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
      </main>
      <Footer />
    </div>
  );
}

export default App;
