import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Services from './components/Services';
import OurStory from './components/OurStory';
import Teams from './components/Teams';
import { Toaster } from 'react-hot-toast';
import Register from './components/Register';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateAdminRoute from './components/PrivateAdminRoute';

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();  // ← add this

  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Hide navbar & footer on these routes
  const hideLayout = ['/dashboard', '/admin'].includes(location.pathname);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.1;
      position.current.y += (mouse.current.y - position.current.y) * 0.1;

      if (dotRef.current && outlineRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x - 6}px, ${mouse.current.y - 6}px, 0)`;
        outlineRef.current.style.transform = `translate3d(${position.current.x - 20}px, ${position.current.y - 20}px, 0)`;
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin' && window.location.pathname === '/dashboard') {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="dark:bg-black relative">
      <Toaster />

      {!hideLayout && <Navbar theme={theme} setTheme={setTheme} />}  {/* ← only on home/login */}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <TrustedBy />
              <Services />
              <OurStory />
              <Teams />
              <Register />
              <ContactUs />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <AdminDashboard />
            </PrivateAdminRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer theme={theme} />}  {/* ← only on home/login */}

      <div
        ref={outlineRef}
        className="fixed top-0 left-0 h-10 w-10 rounded-full border border-primary pointer-events-none z-[9999]"
        style={{ transition: 'transform 0.1s ease-out' }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-3 w-3 rounded-full bg-primary pointer-events-none z-[9999]"
      />
    </div>
  );
};

export default App;