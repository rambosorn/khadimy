import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { useSiteIdentity } from './hooks/useSiteIdentity';

// Placeholder Imports (Files to be created)
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Registration from './pages/Registration';
import Experts from './pages/Experts';
import Insights from './pages/Insights';
import InsightDetail from './pages/InsightDetail';
import Community from './pages/Community';
import DynamicPage from './pages/DynamicPage';
import NotFound from './pages/NotFound';

function App() {
  const { faviconUrl, siteName } = useSiteIdentity();

  useEffect(() => {
    if (faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'shortcut icon';
      link.href = faviconUrl;
      if (!document.querySelector("link[rel*='icon']")) {
        document.head.appendChild(link);
      }
    }
  }, [faviconUrl]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{siteName || 'Khadimy'}</title>
      </Helmet>
      <ThemeProvider>
        <Router>
          <div className="app-layout">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:slug" element={<CourseDetail />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:slug" element={<InsightDetail />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/experts" element={<Experts />} />
                <Route path="/community" element={<Community />} />
                <Route path="/page/:slug" element={<DynamicPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
