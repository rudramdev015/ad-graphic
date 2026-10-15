import { useState } from 'react';
import useReveal from './hooks/useReveal.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Ticker from './components/Ticker.jsx';
import Results from './components/Results.jsx';
import VideoTestimonials from './components/VideoTestimonials.jsx';
import Pillars from './components/Pillars.jsx';
import Showcase from './components/Showcase.jsx';
import Advantages from './components/Advantages.jsx';
import Curriculum from './components/Curriculum.jsx';
import Toolkit from './components/Toolkit.jsx';
import Partners from './components/Partners.jsx';
import Comparison from './components/Comparison.jsx';
import Fit from './components/Fit.jsx';
import Fees from './components/Fees.jsx';
import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import { Preloader, ScrollProgress } from './components/Intro.jsx';

export default function App() {
  const [applyOpen, setApplyOpen] = useState(false);
  const openApply = () => setApplyOpen(true);
  useReveal();

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Navbar onApply={openApply} />
      <main>
        <Hero onApply={openApply} />
        <Ticker />
        <Results />
        <VideoTestimonials onApply={openApply} />
        <Pillars />
        <Showcase />
        <Advantages onApply={openApply} />
        <Curriculum />
        <Toolkit />
        <Partners />
        <Comparison />
        <Fit onApply={openApply} />
        <Fees onApply={openApply} />
        <Faq />
      </main>
      <Footer onApply={openApply} />
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </>
  );
}
