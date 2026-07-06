import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import TerminalNav from './components/TerminalNav';
import TerminalOverlay from './components/TerminalOverlay';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Lab from './pages/Lab';

// Reset scroll on navigation (unless heading to an in-page anchor).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Shared page transition: quick fade + rise.
function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/projects" element={<Page><Projects /></Page>} />
        <Route path="/blog" element={<Page><Blog /></Page>} />
        <Route path="/blog/:slug" element={<Page><BlogPost /></Page>} />
        <Route path="/lab" element={<Page><Lab /></Page>} />

        {/* Experience & Education merged into About — keep old URLs alive */}
        <Route path="/experience" element={<Navigate to="/about#experience" replace />} />
        <Route path="/education" element={<Navigate to="/about#education" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="App min-h-screen">
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ScrollToTop />
          <TerminalNav />
          <TerminalOverlay />
          <div className="min-h-screen">
            <AnimatedRoutes />
          </div>
          <Footer />
        </BrowserRouter>
      </MotionConfig>
    </div>
  );
}

export default App;
