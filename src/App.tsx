import ChatBot from './components/ChatBot';
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

function App() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] overflow-x-hidden">
      <Navbar />
      <SocialSidebar />
      <ChatBot />
      <main className="lg:ml-16">
        <Hero />
        <SectionDivider variant="gradient" />
        <About />
        <SectionDivider variant="gradient" />
        <Skills />
        <SectionDivider variant="gradient" />
        <Projects />
        <SectionDivider variant="gradient" />
        <GitHubStats />
        <SectionDivider variant="gradient" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
