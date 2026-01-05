import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getStrapiMedia } from '../lib/strapi';

const HeroCarousel = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (!slides || slides.length === 0) return null;

    const currentSlide = slides[currentIndex];
    const imageUrl = currentSlide.cover ? getStrapiMedia(currentSlide.cover) : '/placeholder-hero.jpg';

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px', overflow: 'hidden', background: '#0f0518' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {/* Background Image with Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.4)' // Darken for text readability
                    }} />

                    {/* Content */}
                    <div className="container" style={{
                        position: 'relative',
                        zIndex: 10,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        color: 'white',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 2rem'
                    }}>
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid rgba(59, 130, 246, 0.5)',
                                borderRadius: '50px',
                                color: '#60a5fa',
                                fontWeight: '600',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            {currentSlide.mode || 'Featured Course'}
                        </motion.span>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                fontWeight: '800',
                                marginBottom: '1rem',
                                lineHeight: 1.1,
                                maxWidth: '800px'
                            }}
                        >
                            {currentSlide.title}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            style={{
                                fontSize: '1.25rem',
                                color: '#e2e8f0',
                                maxWidth: '600px',
                                marginBottom: '2.5rem',
                                lineHeight: 1.6
                            }}
                        >
                            {currentSlide.overview ? currentSlide.overview.substring(0, 150) + '...' : 'Unlock your potential with real-world skills.'}
                        </motion.p>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Link to={`/courses/${currentSlide.slug || currentSlide.id}`} className="btn btn-primary" style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                borderRadius: '50px'
                            }}>
                                View Course
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '20px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 20,
                    color: 'white'
                }}
                className="desktop-only"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 20,
                    color: 'white'
                }}
                className="desktop-only"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                zIndex: 20
            }}>
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: idx === currentIndex ? '30px' : '10px',
                            height: '10px',
                            background: idx === currentIndex ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
