import Navbar from './components/layout/Navbar';
import SocialSidebar from './components/layout/SocialSidebar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import GitHubStats from './components/sections/GitHubStats';
import Contact from './components/sections/Contact';

function App() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] overflow-x-hidden">
      <Navbar />
      <SocialSidebar />
      <main className="lg:ml-16">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHubStats />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
