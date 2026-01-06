import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BookOpen, Users, Award, Eye, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchFromStrapi, unwrapStrapiResponse, getStrapiMedia } from '../lib/strapi';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [slideshowCourses, setSlideshowCourses] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [partners, setPartners] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Typewriter effect state
  const [displayedCohortText, setDisplayedCohortText] = useState('');

  // Canvas Animation Logic
  const canvasRef = useRef(null);

  // Data Fetching
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Home Hero
        try {
          const heroRes = await fetchFromStrapi('/home-hero');
          setHeroData(unwrapStrapiResponse(heroRes));
        } catch (err) {
          console.warn("Home Hero fetch failed", err);
        }

        // Fetch Slideshow Courses
        let slides = [];
        try {
          const slidesData = await fetchFromStrapi('/courses', {
            populate: ['cover', 'instructor', 'instructor.photo'],
            'filters[is_slideshow][$eq]': true,
            'pagination[limit]': 5
          });
          slides = unwrapStrapiResponse(slidesData) || [];
          setSlideshowCourses(slides);
        } catch (err) {
          console.warn("Slideshow fetch failed", err);
        }

        // Fetch Featured Courses
        // Filter out courses that are already in the slideshow (avoid duplicates)
        const coursesData = await fetchFromStrapi('/courses', {
          populate: ['cover', 'instructor', 'instructor.photo'],
          'filters[featured][$eq]': true,
          'pagination[limit]': 10 // Fetch a bit more to account for filtering
        });
        let courses = unwrapStrapiResponse(coursesData) || [];

        if (slides.length > 0) {
          const slideIds = slides.map(s => s.id);
          courses = courses.filter(c => !slideIds.includes(c.id));
        }

        // Limit back to 6 after filtering
        setFeaturedCourses(courses.slice(0, 6));

        // Fetch Latest Articles
        const articlesData = await fetchFromStrapi('/articles', {
          populate: '*',
          sort: ['createdAt:desc'],
          pagination: { limit: 3 }
        });
        setLatestArticles(unwrapStrapiResponse(articlesData));

        // Fetch Partners
        try {
          const partnersData = await fetchFromStrapi('/partners', { populate: '*' });
          setPartners(unwrapStrapiResponse(partnersData));
        } catch (err) {
          console.warn("Partners fetch failed, using placeholders", err);
        }

      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Typewriter Effect Logic
  useEffect(() => {
    const text = heroData?.cohort_text || "🚀 New Cohorts Starting January 2026";
    let index = 0;
    setDisplayedCohortText(''); // Reset

    const intervalId = setInterval(() => {
      setDisplayedCohortText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
      }
    }, 50); // Speed of typing

    return () => clearInterval(intervalId);
  }, [heroData]);

  // Framer Motion Variants for 3D Tilt
  const tiltVariant = {
    initial: { rotateX: 0, rotateY: 0, scale: 1 },
    hover: {
      rotateX: 10,
      rotateY: 10,
      scale: 1.05,
      border: '1px solid rgba(255,255,255,0.4)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = 600; // Fixed height for hero

    // Globe Parameters
    const globeRadius = 180;
    const globeCenter = { x: width * 0.25, y: height * 0.5 }; // Left side
    let angleX = 0;
    let angleY = 0;
    const globeParticles = [];
    const GLOBE_PARTICLE_COUNT = 400;

    // Wave Parameters
    const waveParticles = [];
    const WAVE_PARTICLE_COUNT = 150;

    // Mouse Interaction
    let mouse = { x: 0, y: 0 };

    // Initialize Globe Particles (Spherical distribution)
    for (let i = 0; i < GLOBE_PARTICLE_COUNT; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      globeParticles.push({
        x: globeRadius * Math.sin(phi) * Math.cos(theta),
        y: globeRadius * Math.sin(phi) * Math.sin(theta),
        z: globeRadius * Math.cos(phi),
        size: Math.random() * 2 + 1,
        color: '#00f3ff'
      });
    }

    // Initialize Wave Particles
    for (let i = 0; i < WAVE_PARTICLE_COUNT; i++) {
      waveParticles.push({
        x: Math.random() * width,
        y: height * 0.5 + (Math.random() - 0.5) * 100,
        vx: Math.random() * 2 + 1,
        amplitude: Math.random() * 50 + 20,
        frequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 2,
        color: '#bc13fe'
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 600;
      globeCenter.x = width * 0.25;
      if (width < 768) {
        globeCenter.x = width * 0.5; // Center globe on mobile
      }
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      // Rotate globe based on mouse X position relative to center
      angleY = (mouse.x - width / 2) * 0.0005;
      angleX = (mouse.y - height / 2) * 0.0005;
    };
    // Attach to window to catch movements outside canvas if needed, but here canvas is fine
    // Or attach to header element if getting ref
    // For simplicity, using simple auto-rotation + slight mouse influence in render loop
    // But adding event listener to canvas container is better.
    // Let's stick to auto-rotation primarily.

    const render = () => {
      ctx.fillStyle = '#0f0518'; // Deep dark background
      ctx.fillRect(0, 0, width, height);

      // --- DRAW WAVE ---
      ctx.beginPath();
      for (let p of waveParticles) {
        // Update position
        p.x += p.vx;
        // Reset if off screen (start from globe area roughly)
        if (p.x > width) p.x = globeCenter.x;

        // Wave motion
        const y = p.y + Math.sin(p.x * p.frequency + p.phase) * p.amplitude;

        // Draw
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(p.x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby wave particles
        waveParticles.forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = y - (p2.y + Math.sin(p2.x * p2.frequency + p2.phase) * p2.amplitude);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, y);
            ctx.lineTo(p2.x, p2.y + Math.sin(p2.x * p2.frequency + p2.phase) * p2.amplitude);
            ctx.stroke();
          }
        });
      }
      ctx.globalAlpha = 1;


      // --- DRAW GLOBE ---
      // Auto rotation
      const rotationSpeed = 0.005;

      // Sort particles by Z-depth for correct occlusion (painters algorithm) - optional but nice
      // Actually simple points don't need sorting, lines might. 
      // Let's project first.
      const projected = [];

      // Rotate Sphere
      globeParticles.forEach(p => {
        // Rotate around Y
        let x1 = p.x * Math.cos(rotationSpeed) - p.z * Math.sin(rotationSpeed);
        let z1 = p.z * Math.cos(rotationSpeed) + p.x * Math.sin(rotationSpeed);

        // Rotate around X (slight tilt)
        let y1 = p.y;

        // Update original pos for animation persistence
        p.x = x1;
        p.z = z1;

        // Project
        const perspective = 400;
        const scale = perspective / (perspective + z1 + 400); // +400 to push back

        const x2d = x1 * scale + globeCenter.x;
        const y2d = y1 * scale + globeCenter.y;

        projected.push({ x: x2d, y: y2d, z: z1, size: p.size * scale, color: p.color });
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        // Only connect to some neighbors to save performance, checking all-vs-all is O(N^2)
        // Simple optimization: check next 10 particles
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw Globe Points
      projected.forEach(p => {
        const alpha = (p.z + globeRadius) / (2 * globeRadius); // Fade back points
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);


  return (
    <>
      <Helmet>
        <title>Khadimy | From Knowledge to Real-World Skills</title>
        <meta name="description" content="Bridging academic theory and industry practice in Cambodia through hybrid learning courses." />
      </Helmet>

      <div className="home-page">
        {/* Hero Section */}
        {/* Hero Section: Switch between Carousel and Static */}
        {loading ? (
          // Placeholder to prevent layout shift/flash while determining if we have slides
          <div style={{ height: '600px', background: '#0f0518', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : slideshowCourses.length > 0 ? (
          <HeroCarousel slides={slideshowCourses} />
        ) : (
          <header className="hero section" style={{
            position: 'relative',
            background: '#0f0518', // Deep purple/black fallback
            textAlign: 'center',
            padding: '8rem 0 6rem',
            overflow: 'hidden',
            color: 'white',
            perspective: '1000px' // For 3D tilt
          }}>
            {/* Dynamic Backgrounds */}
            {(!heroData?.background_style || heroData.background_style === 'globe_animation') && (
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 0
                }}
              />
            )}

            {heroData?.background_style === 'static_image' && heroData.hero_image && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                backgroundImage: `url(${getStrapiMedia(heroData.hero_image.url)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.6 // Dim it slightly for text readability
              }} />
            )}

            {heroData?.background_style === 'gradient' && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: 'linear-gradient(135deg, #0f0518 0%, #3b0764 50%, #1e1b4b 100%)' // Customized purple/blue gradient
              }} />
            )}

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#60a5fa',
                  fontWeight: '600',
                  marginBottom: '2rem',
                  fontSize: '0.9rem'
                }}>
                  {displayedCohortText || "🚀 Loading..."}
                  <span className="blinking-cursor">|</span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  marginBottom: '1.5rem',
                  fontWeight: '800',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                {heroData?.title_main || "From knowledge to"} <br />
                <span style={{
                  background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  display: 'inline-block'
                }}>
                  {heroData?.title_highlight || "Real-World Skills"}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  fontSize: '1.25rem',
                  maxWidth: '700px',
                  margin: '0 auto 3rem',
                  color: '#cbd5e1',
                  lineHeight: 1.6
                }}>
                {heroData?.description || "Khadimy bridges the gap between academic theory and industry practice. Learn from experts, build real projects, and join a community of doers."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
              >
                <Link to={heroData?.primary_button_link || "/courses"} className="btn btn-primary" style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem',
                  background: '#3b82f6',
                  border: 'none',
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                }}>
                  {heroData?.primary_button_text || "View Courses"}
                </Link>
                <Link to={heroData?.secondary_button_link || "/community"} className="btn" style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {heroData?.secondary_button_text || "Join Community"}
                </Link>
              </motion.div>

              {/* Floating Badges with 3D Tilt */}
              <motion.div
                variants={tiltVariant}
                initial="initial"
                whileHover="hover"
                animate={{ y: [0, -15, 0] }}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotateX: { duration: 0.2 },
                  rotateY: { duration: 0.2 }
                }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '5%',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transformStyle: 'preserve-3d', // Enable 3D
                  cursor: 'default'
                }}
                className="floating-badge-left desktop-only"
              >
                <Award size={32} color="#60a5fa" style={{ transform: 'translateZ(20px)' }} />
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold', transform: 'translateZ(10px)' }}>
                  {heroData?.badge_left_text || "Industry Certified"}
                </div>
              </motion.div>

              <motion.div
                variants={tiltVariant}
                initial="initial"
                whileHover="hover"
                animate={{ y: [0, 15, 0] }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                  rotateX: { duration: 0.2 },
                  rotateY: { duration: 0.2 }
                }}
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '5%',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transformStyle: 'preserve-3d',
                  cursor: 'default'
                }}
                className="floating-badge-right desktop-only"
              >
                <Users size={32} color="#a78bfa" style={{ transform: 'translateZ(20px)' }} />
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold', transform: 'translateZ(10px)' }}>
                  {heroData?.badge_right_text || "500+ Students"}
                </div>
              </motion.div>
            </div>
          </header>
        )}



        {/* Mission / Approach Section */}
        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">Why Khadimy?</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666' }}>
                We don't just teach theory. We prepare you for the workforce.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{ padding: '2rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}><BookOpen size={40} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Practical Curriculum</h3>
                <p style={{ color: '#666' }}>Courses designed by industry experts, focusing on the tools and workflows used in real jobs today.</p>
              </div>
              <div style={{ padding: '2rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}><Users size={40} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Hybrid Learning</h3>
                <p style={{ color: '#666' }}>The flexibility of online learning combined with physical workshops for networking and hands-on guidance.</p>
              </div>
              <div style={{ padding: '2rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}><Award size={40} /></div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Industry Connection</h3>
                <p style={{ color: '#666' }}>Direct access to mentors and professionals who can guide your career path and provide feedback.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div className="section-header-flex">
              <div>
                <h2 className="section-title" style={{ marginBottom: '0.5rem', textAlign: 'left' }}>Featured Courses</h2>
                <p>Start your journey with our most popular programs.</p>
              </div>
              <Link to="/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                All Courses <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <p>Loading courses...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {featuredCourses.map(course => {
                  const imageUrl = course.cover ? getStrapiMedia(course.cover) : 'https://placehold.co/350x200';
                  return (
                    <div key={course.id} className="course-card">
                      <Link to={`/courses/${course.slug || course.id}`}>
                        <div className="course-image-container">
                          <img src={imageUrl} alt={course.title} className="course-image" />
                          <span className="course-badge">{course.price || 'Free'}</span>
                        </div>
                      </Link>

                      <div className="course-content">
                        <div className="course-provider" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          {course.instructor?.photo ? (
                            <img
                              src={getStrapiMedia(course.instructor.photo)}
                              alt={course.instructor.name}
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Briefcase size={20} color="#888" />
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)' }}>
                              {course.instructor?.name || 'Khadimy Instructor'}
                            </span>
                            {course.instructor?.role && (
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>
                                {course.instructor.role}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="course-title">
                          <Link to={`/courses/${course.slug || course.id}`}>
                            {course.title || 'Untitled Course'}
                          </Link>
                        </h3>

                        <div className="course-subtitle" style={{ marginBottom: '1rem' }}>
                          {course.mode || 'Professional Certificate'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
            }

            {
              featuredCourses.length === 0 && !loading && (
                <p>No featured courses found. Check Strapi content.</p>
              )
            }
          </div >
        </section >

        {/* Partners / Trust Section - Slider */}
        < section style={{
          background: 'var(--color-bg-alt)',
          padding: '4rem 0',
          borderTop: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}>
          <div className="container" style={{ overflow: 'hidden' }}>
            <p style={{
              textAlign: 'center',
              color: 'var(--color-text-light)',
              fontSize: '1.2rem',
              fontWeight: '500',
              marginBottom: '3rem',
            }}>
              More than <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>500+ students</span> and <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>50+ partners</span> grow with Khadimy.
            </p>

            <div className="slider-track">
              {/* Original List */}
              {(partners.length > 0 ? partners : ['Panasonic', 'Reddit', 'Zapier', 'eBay', 'DoorDash', 'Microsoft', 'Google', 'Amazon']).map((partner, index) => {
                const isObj = typeof partner === 'object';
                const name = isObj ? partner.name : partner;
                const src = isObj && partner.logo ? getStrapiMedia(partner.logo.url) : `https://placehold.co/120x40/1e1e1e/ffffff?text=${name}`;

                return (
                  <div key={`original-${index}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '150px',
                    opacity: 0.7,
                    filter: 'grayscale(100%)',
                    transition: 'opacity 0.3s'
                  }}>
                    <img
                      src={src}
                      alt={name}
                      style={{ borderRadius: '4px', maxHeight: '40px', maxWidth: '120px', objectFit: 'contain' }}
                    />
                  </div>
                );
              })}
              {/* Duplicate List for Loop */}
              {(partners.length > 0 ? partners : ['Panasonic', 'Reddit', 'Zapier', 'eBay', 'DoorDash', 'Microsoft', 'Google', 'Amazon']).map((partner, index) => {
                const isObj = typeof partner === 'object';
                const name = isObj ? partner.name : partner;
                const src = isObj && partner.logo ? getStrapiMedia(partner.logo.url) : `https://placehold.co/120x40/1e1e1e/ffffff?text=${name}`;

                return (
                  <div key={`duplicate-${index}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '150px',
                    opacity: 0.7,
                    filter: 'grayscale(100%)',
                    transition: 'opacity 0.3s'
                  }}>
                    <img
                      src={src}
                      alt={name}
                      style={{ borderRadius: '4px', maxHeight: '40px', maxWidth: '120px', objectFit: 'contain' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section >

        {/* Latest Insights */}
        < section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <div className="section-header-flex" style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Insights</h2>
              <Link to="/insights" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                View All <ArrowRight size={18} />
              </Link>
            </div>
            {loading ? (
              <p>Loading insights...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {latestArticles.map(article => {
                  const imageUrl = article.cover ? getStrapiMedia(article.cover.url) : 'https://placehold.co/300x200';
                  // Mock views
                  const views = Math.floor(Math.random() * 100) + 10;

                  return (
                    <article key={article.id} className="article-card">
                      <Link to={`/insights/${article.slug}`}>
                        <img src={imageUrl} alt={article.title} className="article-image" />
                      </Link>
                      <div className="article-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <span className="tag-pill" style={{
                            background: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '99px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {article.category || 'New'}
                          </span>
                        </div>

                        <h3 className="article-title" style={{ marginBottom: '0.75rem' }}>
                          <Link to={`/insights/${article.slug}`}>{article.title}</Link>
                        </h3>

                        <p className="article-excerpt" style={{ flexGrow: 1, marginBottom: '1.5rem', color: '#666' }}>
                          {article.excerpt || article.description || "Read about this latest insight..."}
                        </p>

                        {/* Removed View Count Footer */}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section >

        {/* CTA Section */}
        < section className="section" style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'inherit' }}>Ready to Start Learning?</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--color-footer-text)', opacity: 0.8, fontSize: '1.2rem' }}>
              Join our community and take the first step towards a practical career skill set.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
              Register Now
            </Link>
          </div>
        </section >
      </div >
    </>
  );
};

export default Home;
