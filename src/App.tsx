import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import CmsOffline from './components/ui/CmsOffline';
import Loader from './components/ui/Loader';
import { useAnchorScrollFix } from './hooks/useAnchorScrollFix';

const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Journey = lazy(() => import('./components/sections/Projects'));
const ServiceMap = lazy(() => import('./components/sections/ServiceMap'));
const Homelab = lazy(() => import('./components/sections/Homelab'));
const GitHubStats = lazy(() => import('./components/sections/GitHubStats'));
const Contact = lazy(() => import('./components/sections/Contact'));
const ChatBot = lazy(() => import('./components/ChatBot'));

function App() {
  const [booted, setBooted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const handleDone = useCallback(() => setBooted(true), []);
  // correct in-page anchor landings (content-visibility:auto offsets are off)
  useAnchorScrollFix();

  // Load the chat (and its markdown chunk) only once the visitor is past the hero;
  // it then shows as a small chip and never opens by itself.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setShowChat(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Loader onDone={handleDone} />
      {/* overflow-x-clip (not hidden) so it doesn't break the navbar's sticky */}
      <div className="min-h-screen overflow-x-clip">
        <Navbar booted={booted} />
        <CmsOffline />
        <main>
          <Hero booted={booted} />
          {/* full-height fallback keeps the footer below the fold while sections load (CLS) */}
          <Suspense fallback={<div className="min-h-screen" />}>
            <About />
            <Skills />
            <Journey />
            <ServiceMap />
            <Homelab />
            <GitHubStats />
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
      {showChat && (
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      )}
    </>
  );
}

export default App;
