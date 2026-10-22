import { Suspense, lazy, useEffect, useState } from 'react';
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
import { Preloader, ScrollProgress } from './components/Intro.jsx';
import CookieBar from './components/CookieBar.jsx';

// The apply form is only needed after a click, so it ships as its own chunk,
// prefetched once the browser is idle.
const loadApplyModal = () => import('./components/ApplyModal.jsx');
const ApplyModal = lazy(loadApplyModal);

export default function App() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyUsed, setApplyUsed] = useState(false);
  const openApply = () => { setApplyUsed(true); setApplyOpen(true); };
  useReveal();

  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2500));
    idle(() => loadApplyModal().catch(() => {}));
  }, []);

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
      {applyUsed && (
        <Suspense fallback={null}>
          <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} />
        </Suspense>
      )}
      <CookieBar />
    </>
  );
}
