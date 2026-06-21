import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Loader from './components/ui/Loader';
import { useAnchorScrollFix } from './hooks/useAnchorScrollFix';

const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Journey = lazy(() => import('./components/sections/Projects'));
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

  // Reveal the trace console only after the user scrolls past the hero, so it
  // doesn't cover the first view ("available on scroll").
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
      {/* padding clears the fixed trace console (height published as --console-h);
          overflow-x-clip (not hidden) so it doesn't break the navbar's sticky */}
      <div
        className="min-h-screen overflow-x-clip"
        style={{ paddingBottom: showChat ? 'calc(var(--console-h, 6rem) + 1rem)' : undefined }}
      >
        <Navbar booted={booted} />
        <main>
          <Hero booted={booted} />
          <Suspense fallback={null}>
            <About />
            <Skills />
            <Journey />
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
