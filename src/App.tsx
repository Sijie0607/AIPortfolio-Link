/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import illustrationsData from '../illustrations.json';
import lifeData from '../life.json';
import workData from '../work.json';
import projectsData from '../projects.json';

// --- Types ---
interface ScanPulseData {
  id: number;
  x: number;
  y: number;
}

interface MetaballParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  phase: number;
  speed: number;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface GalleryItem {
  id: string;
  title: string;
  filename?: string;
  src: string;
  alt?: string;
  caption?: string;
  category?: string;
  tags?: string[];
}

const getItemSrc = (item: GalleryItem): string => {
  if (item.filename) {
    return `https://raw.githubusercontent.com/Sijie0607/AIPortfolio/main/${encodeURIComponent(
      item.filename
    )}`;
  }
  return item.src;
};

interface WorkItem {
  id: string;
  title: string;
  tagline: string;
  role?: string;
  externalLink?: string | null;
  thumbnail?: string | null;
  company?: string;
  tenure?: string;
  intro?: string;
  responsibilities?: string[];
  selectedWork?: {
    id: string;
    title: string;
    overview: string;
    role?: string;
    skills?: string[];
    timeline?: string;
    images?: { src: string; caption?: string }[];
  }[];
  reflection?: string;
}

interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  role?: string;
  timeline?: string;
  team?: string;
  tags?: string[];
  overview?: string;
  sections?: {
    id: string;
    title: string;
    body: string;
    image?: string | null;
  }[];
  thumbnail?: string | null;
}

// --- Components ---

interface ScanPulseProps {
  x: number;
  y: number;
  onComplete: () => void;
}

const ScanPulse: React.FC<ScanPulseProps> = ({ x, y, onComplete }) => {
  return (
    <div 
      className="fixed pointer-events-none z-[9998]"
      style={{ left: x, top: y }}
    >
      {/* 1. Solid Dot: ● */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [0, 1, 0] 
        }}
        transition={{ 
          duration: 0.5, 
          times: [0, 0.3, 1],
          ease: "easeOut"
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#7A9960] rounded-full shadow-[0_0_10px_rgba(122,153,96,0.6)]"
      />
      
      {/* 2. First Ring: ⭕ */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 4.5],
          opacity: [0, 0.8, 0] 
        }}
        transition={{ 
          duration: 0.9, 
          delay: 0.1, 
          ease: [0.215, 0.61, 0.355, 1] 
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-[1.5px] border-[#7A9960] rounded-full"
      />

      {/* 3. Second Ring: ⭕⭕ */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 3.2],
          opacity: [0, 0.5, 0] 
        }}
        transition={{ 
          duration: 0.8, 
          delay: 0.22, 
          ease: [0.215, 0.61, 0.355, 1] 
        }}
        onAnimationComplete={onComplete}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-[#7A9960]/60 rounded-full"
      />
    </div>
  );
};

const ScanPulseManager = () => {
  const [pulses, setPulses] = useState<ScanPulseData[]>([]);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newPulse = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setPulses(prev => [...prev, newPulse]);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <AnimatePresence>
        {pulses.map(pulse => (
          <ScanPulse 
            key={pulse.id} 
            x={pulse.x} 
            y={pulse.y} 
            onComplete={() => setPulses(prev => prev.filter(p => p.id !== pulse.id))} 
          />
        ))}
      </AnimatePresence>
    </>
  );
};

const Navbar = ({ onNav }: { onNav?: (id: string) => void }) => {
  const handleScroll = (id: string) => {
    if (onNav) {
      onNav(id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const ball = document.createElement('div');
    ball.className = 'bouncing-ball';
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ball.style.left = `${rect.left + rect.width / 2 - 4}px`;
    ball.style.top = `${rect.top}px`;
    document.body.appendChild(ball);
    setTimeout(() => ball.remove(), 550);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[58px] bg-[rgba(247,243,220,0.90)] backdrop-blur-[14px] border-b border-[rgba(90,158,48,0.16)] z-[1000] flex items-center justify-between px-6 md:px-12">
      <div 
        className="font-display font-bold text-[1.2rem] cursor-pointer text-ink"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMouseEnter={handleMouseEnter}
      >
        Sijie Liu
      </div>
      
      <div className="hidden md:flex items-center gap-8 font-mono text-[0.85rem] text-ink">
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleScroll('about')}
            onMouseEnter={handleMouseEnter}
            className="nav-underline"
          >
            About Me
          </button>
          <a
            href="https://github.com/Sijie0607/AIPortfolio/blob/main/Resume-Sijie%20Liu-%20Business%20Analyst%20.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleMouseEnter}
            className="border border-divider px-2 py-0.5 rounded-sm hover:border-accent transition-colors"
            title="View my resume in browser"
          >
            Resume ↓
          </a>
        </div>
        
        <div className="w-[1px] h-4 bg-divider"></div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => handleScroll('experience')} onMouseEnter={handleMouseEnter} className="nav-underline">Work Experience</button>
          <button onClick={() => handleScroll('projects')} onMouseEnter={handleMouseEnter} className="nav-underline">Projects</button>
          <button onClick={() => handleScroll('illustrations')} onMouseEnter={handleMouseEnter} className="nav-underline">Illustrations & Life</button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const cloudCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const laggedMousePos = useRef({ x: 0, y: 0 });

  // Rain State
  const rainDrops = useRef<RainDrop[]>([]);
  
  // Metaball State
  const particles = useRef<MetaballParticle[]>([]);

  useEffect(() => {
    const rainCanvas = rainCanvasRef.current;
    const cloudCanvas = cloudCanvasRef.current;
    if (!rainCanvas || !cloudCanvas) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      [rainCanvas, cloudCanvas].forEach(c => {
        c.width = w;
        c.height = h;
      });
      
      // Initialize Rain
      rainDrops.current = Array.from({ length: 220 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        length: 9 + Math.random() * 16,
        speed: 1.4 + Math.random() * 2.8,
        opacity: 0.10 + Math.random() * 0.18
      }));

      // Initialize Metaball Particles
      const pCount = 22;
      particles.current = Array.from({ length: pCount }, () => {
        // Slightly larger base radius so the cloud feels bigger and softer
        const baseRadius = 80 + Math.random() * 90;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: baseRadius,
          baseRadius,
          phase: Math.random() * Math.PI * 2,
          // Slower phase speed so the breathing feels calmer
          speed: 0.015 + Math.random() * 0.02
        };
      });

      // Initial lagged position
      laggedMousePos.current = { x: w / 2, y: h / 2 };
      mousePos.current = { x: w / 2, y: h / 2 };
    };

    window.addEventListener('resize', resize);
    resize();

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const time = (Date.now() - startTime) / 1000;
      const rainCtx = rainCanvas.getContext('2d');
      const cloudCtx = cloudCanvas.getContext('2d');

      if (rainCtx) {
        rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        rainCtx.lineWidth = 0.9;
        rainDrops.current.forEach(drop => {
          rainCtx.beginPath();
          rainCtx.strokeStyle = `rgba(80, 145, 35, ${drop.opacity})`;
          rainCtx.moveTo(drop.x, drop.y);
          // Slight leftward wind angle
          rainCtx.lineTo(drop.x - 2, drop.y + drop.length);
          rainCtx.stroke();

          drop.y += drop.speed;
          drop.x -= 0.5; // Wind

          if (drop.y > rainCanvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * rainCanvas.width;
          }
          if (drop.x < 0) drop.x = rainCanvas.width;
        });
      }

      if (cloudCtx) {
        cloudCtx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
        
        // Update lagged mouse position (slower follow for a calmer drift)
        laggedMousePos.current.x += (mousePos.current.x - laggedMousePos.current.x) * 0.045;
        laggedMousePos.current.y += (mousePos.current.y - laggedMousePos.current.y) * 0.045;

        // Apply a stronger blur for a larger, more diffuse cloud
        cloudCtx.filter = 'blur(70px)';
        
        particles.current.forEach((p, i) => {
          // Movement logic: follow lagged mouse with a wider, softer orbit
          const targetX = laggedMousePos.current.x + Math.cos(time * 0.7 + p.phase) * 210;
          const targetY = laggedMousePos.current.y + Math.sin(time * 0.6 + p.phase) * 210;
          
          // Smaller attraction so particles don't clump too tightly
          p.x += (targetX - p.x) * 0.032;
          p.y += (targetY - p.y) * 0.032;

          // Breathing radius (slightly slower for a softer pulse)
          p.radius = p.baseRadius * (1 + Math.sin(time * 0.9 + p.phase) * 0.22);

          // Draw particle
          const gradient = cloudCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          // Sage green colors (#7A9960)
          gradient.addColorStop(0, 'rgba(122, 153, 96, 0.6)'); // Core
          gradient.addColorStop(0.6, 'rgba(122, 153, 96, 0.2)'); // Mid
          gradient.addColorStop(1, 'rgba(122, 153, 96, 0)'); // Edge

          cloudCtx.fillStyle = gradient;
          cloudCtx.beginPath();
          cloudCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          cloudCtx.fill();
        });
        
        cloudCtx.filter = 'none';
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <section 
      className="relative w-full h-screen bg-hero-bg overflow-hidden flex flex-col justify-center px-10 md:px-24"
      onMouseMove={handleMouseMove}
    >
      <canvas ref={rainCanvasRef} className="absolute inset-0 pointer-events-none z-[1]" />
      <canvas ref={cloudCanvasRef} className="absolute inset-0 pointer-events-none z-[3]" />

      <div className="relative z-10 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-display font-bold text-ink leading-tight mb-4"
          style={{ fontSize: 'clamp(3.4rem, 7.5vw, 6.5rem)' }}
        >
          Sijie Liu
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="font-display italic text-ink-light mb-6"
          style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.65rem)' }}
        >
          currently Data Analyst
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="font-mono text-ink-light text-sm md:text-base"
        >
          Exploring Data. AI. Design. Art
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-12 left-10 md:left-24 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-accent animate-drip"></div>
        <span className="font-mono text-[0.7rem] text-muted uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  );
};

const SectionReveal = ({ children, id, label, title }: { children: React.ReactNode, id: string, label: string, title: string }) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isCaseSection = id === 'work-case' || id === 'project-case';
  const widthClass = isCaseSection ? 'max-w-[960px]' : 'max-w-[820px]';
  const hideHeader = label === 'Case Study' || id === 'project-case';

  return (
    <section 
      id={id} 
      ref={ref}
      className={`${widthClass} mx-auto px-10 py-[84px] reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      {!hideHeader && (
        <div className="mb-12">
          <span className="font-mono text-muted text-[0.75rem] uppercase tracking-wider mb-2 block">{label}</span>
          {title && title.trim().length > 0 && (
            <h2 className="font-display font-bold text-ink text-3xl md:text-4xl mb-4">
              {title}
            </h2>
          )}
          <div className="h-[1px] w-full bg-divider"></div>
        </div>
      )}
      {children}
    </section>
  );
};

const CallThumbnail = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-accent/20 to-amber-200/40" />
      <div className="relative flex items-center justify-center">
        <div className="absolute w-10 h-10 rounded-full border border-white/40 animate-ping-slow" />
        <div className="absolute w-7 h-7 rounded-full border border-white/70 opacity-80" />
        <svg
          viewBox="0 0 24 24"
          className="relative w-7 h-7 text-ink"
        >
          <path
            d="M6.5 3.5L9 6c.4.4.6.9.5 1.4l-.5 2a1.5 1.5 0 0 0 .4 1.4l4.2 4.2a1.5 1.5 0 0 0 1.4.4l2-.5c.5-.1 1 .1 1.4.5l2.5 2.5a1.2 1.2 0 0 1 0 1.7l-1.6 1.6c-.9.9-2.3 1.1-3.4.5-2.2-1.1-5-3.1-7.5-5.6S6 11.3 4.9 9.1c-.6-1.1-.4-2.5.5-3.4l1.6-1.6a1.2 1.2 0 0 1 1.5 0z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

const WorkRow = ({
  tag,
  title,
  desc,
  delay,
  onClick,
  thumbnail,
}: {
  tag: string;
  title: string;
  desc: string;
  delay: number;
  onClick?: () => void;
  thumbnail?: React.ReactNode;
}) => {
  const handleMouseEnter = (e: React.MouseEvent) => {
    const ball = document.createElement('div');
    ball.className = 'bouncing-ball';
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ball.style.left = `${rect.left + rect.width / 2 - 4}px`;
    ball.style.top = `${rect.top}px`;
    document.body.appendChild(ball);
    setTimeout(() => ball.remove(), 550);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.11, duration: 0.6 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
      className="group flex items-center gap-6 py-7 border-b border-divider cursor-pointer hover:bg-white/10 transition-colors"
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      <motion.div
        className="w-[88px] h-[64px] rounded-[5px] shrink-0 overflow-hidden bg-gradient-to-br from-accent/25 via-amber-100/60 to-amber-200/70"
        initial={false}
        animate={{ scale: 1, filter: 'brightness(0.92) saturate(0.98)' }}
        whileHover={{
          scale: 1.07,
          filter: 'brightness(1.08) saturate(1.06)',
          boxShadow: '0 18px 40px rgba(90, 158, 48, 0.22)',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.65 }}
      >
        {thumbnail}
      </motion.div>
      <div className="flex-grow">
        <div className="font-mono text-[0.7rem] text-muted uppercase tracking-tight mb-1">{tag}</div>
        <h3 className="font-display font-semibold text-ink text-xl group-hover:text-accent transition-colors">{title}</h3>
        <p className="font-body italic text-ink-light text-sm mt-1">{desc}</p>
      </div>
      <div className="font-mono text-muted group-hover:translate-x-2 transition-transform">→</div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, .cursor-pointer');
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-multiply transition-all duration-150 ease-out"
      style={{
        width: isMouseDown ? '9px' : isHovering ? '30px' : '16px',
        height: isMouseDown ? '9px' : isHovering ? '30px' : '16px',
        marginLeft: isMouseDown ? '-4.5px' : isHovering ? '-15px' : '-8px',
        marginTop: isMouseDown ? '-4.5px' : isHovering ? '-15px' : '-8px',
        background: 'radial-gradient(circle at 35% 35%, #ffffcc, #88cc44 55%, #3a7010)',
        borderRadius: '50%',
        boxShadow: isHovering ? '0 0 15px rgba(90, 158, 48, 0.6)' : '0 0 8px rgba(90, 158, 48, 0.4)'
      }}
    />
  );
};

const Lightbox = ({ src, onClose }: { src: string, onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-10 cursor-pointer"
      onClick={onClose}
    >
      <img src={src} alt="Enlarged" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
      <div className="absolute top-10 right-10 text-white font-mono text-sm">Close [ESC]</div>
    </div>
  );
};

// Flowing particles inside detail-page color bands (Hero-style feel, fill the band)
type BandVariant = 'sentiment' | 'behavior' | 'psych';
interface BandParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  baseRadius: number;
  colorIndex: number;
}
const BAND_COLORS: Record<BandVariant, [string, string, string][]> = {
  sentiment: [
    ['rgba(18, 40, 70, 0.55)', 'rgba(40, 86, 125, 0.25)', 'rgba(11, 26, 48, 0)'],
    ['rgba(40, 86, 125, 0.5)', 'rgba(28, 60, 95, 0.2)', 'rgba(11, 26, 48, 0)'],
    ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0)'],
    ['rgba(230, 235, 245, 0.4)', 'rgba(200, 210, 225, 0.15)', 'rgba(200, 210, 225, 0)'],
    ['rgba(192, 200, 215, 0.38)', 'rgba(160, 175, 195, 0.12)', 'rgba(160, 175, 195, 0)'],
  ],
  behavior: [
    ['rgba(124, 172, 140, 0.5)', 'rgba(92, 154, 120, 0.2)', 'rgba(92, 154, 120, 0)'],
    ['rgba(244, 170, 190, 0.45)', 'rgba(242, 162, 182, 0.2)', 'rgba(242, 162, 182, 0)'],
    ['rgba(110, 169, 138, 0.4)', 'rgba(146, 190, 192, 0.15)', 'rgba(146, 190, 192, 0)'],
  ],
  psych: [
    ['rgba(132, 163, 122, 0.5)', 'rgba(116, 141, 110, 0.2)', 'rgba(116, 141, 110, 0)'],
    ['rgba(167, 190, 132, 0.4)', 'rgba(210, 184, 150, 0.2)', 'rgba(210, 184, 150, 0)'],
    ['rgba(210, 184, 150, 0.45)', 'rgba(212, 188, 158, 0.2)', 'rgba(212, 188, 158, 0)'],
  ],
};

const BandParticles = ({ variant }: { variant: BandVariant }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<BandParticle[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const colors = BAND_COLORS[variant];
    const particleCount = variant === 'behavior' || variant === 'sentiment' ? 28 : 24;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: particleCount }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          phase: Math.random() * Math.PI * 2,
          baseRadius: 48 + Math.random() * 72,
          colorIndex: Math.floor(Math.random() * colors.length),
        }));
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const ctx = canvas.getContext('2d');
      if (!ctx || !w || !h) return;

      const time = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.filter = 'blur(42px)';

      particlesRef.current.forEach((p) => {
        p.x += p.vx + Math.sin(time * 0.6 + p.phase) * 0.8;
        p.y += p.vy + Math.cos(time * 0.5 + p.phase * 0.9) * 0.8;
        if (p.x < -80) p.x = w + 60;
        if (p.x > w + 80) p.x = -60;
        if (p.y < -80) p.y = h + 60;
        if (p.y > h + 80) p.y = -60;

        const radius = p.baseRadius * (1 + Math.sin(time * 0.8 + p.phase) * 0.15);
        const [core, mid, edge] = colors[p.colorIndex];
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        g.addColorStop(0, core);
        g.addColorStop(0.55, mid);
        g.addColorStop(1, edge);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.filter = 'none';
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [variant]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[1]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

const WorkDetail = ({ work, onImageClick }: { work: WorkItem; onImageClick: (src: string) => void }) => {
  const workHeroBackground =
    work.id === 'sentiment-analysis'
      ? `
        radial-gradient(circle at 0% 0%, rgba(18, 40, 70, 0.95), transparent 55%),
        radial-gradient(circle at 100% 10%, rgba(40, 86, 125, 0.9), transparent 55%),
        radial-gradient(circle at 30% 100%, rgba(11, 26, 48, 0.9), transparent 55%),
        linear-gradient(160deg, #13253f 0%, #355876 45%, #0c1726 100%)
      `
      : work.id === 'behavior-flow-visualization'
      ? `
        radial-gradient(circle at 0% 0%, rgba(124, 172, 140, 0.95), transparent 55%),
        radial-gradient(circle at 100% 20%, rgba(244, 170, 190, 0.9), transparent 55%),
        radial-gradient(circle at 20% 100%, rgba(92, 154, 120, 0.9), transparent 55%),
        linear-gradient(145deg, #6ea98a 0%, #f2a2c0 100%)
      `
      : `
        radial-gradient(circle at 0% 0%, rgba(122, 153, 96, 0.95), transparent 55%),
        radial-gradient(circle at 100% 20%, rgba(160, 186, 120, 0.9), transparent 55%),
        linear-gradient(145deg, #6e9460 0%, #d7c18e 100%)
      `;

  return (
    <section id="work-detail" className="case-column px-6 md:px-0 pb-[96px]">
      {/* full-width hero background band */}
      <div className="mb-10 relative left-1/2 right-1/2 -ml-[50vw] w-screen">
        <div className="relative h-[260px] md:h-[310px] overflow-hidden">
          <div
            className="absolute inset-0 work-particle-band"
            style={{
              backgroundImage: workHeroBackground,
            }}
          />
          <BandParticles
            variant={
              work.id === 'sentiment-analysis'
                ? 'sentiment'
                : work.id === 'behavior-flow-visualization'
                ? 'behavior'
                : 'psych'
            }
          />
          <div className="relative h-full max-w-[960px] mx-auto px-7 md:px-10 py-8 flex flex-col justify-between z-[2]">
            <div>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-[rgba(245,247,250,0.8)] mb-3 block">
                {work.company || 'Case Study'}
              </span>
              <h1
                className="font-display font-bold text-[#f8f4e8] leading-tight drop-shadow-sm"
                style={{ fontSize: 'clamp(2.4rem, 3.4vw, 3.1rem)' }}
              >
                {work.title}
              </h1>
            </div>
            {(work.role || work.tenure) && (
              <div className="mt-4 font-mono text-[0.8rem] text-[#f5f5f0] space-y-1">
                {work.role && (
                  <div>
                    <span className="uppercase tracking-[0.18em] text-[0.7rem] opacity-80 mr-2">
                      Role →
                    </span>
                    <span>{work.role}</span>
                  </div>
                )}
                {work.tenure && (
                  <div>
                    <span className="uppercase tracking-[0.18em] text-[0.7rem] opacity-80 mr-2">
                      Timeline →
                    </span>
                    <span>{work.tenure}</span>
                  </div>
                )}
                {work.id === 'sentiment-analysis' && (
                  <div>
                    <span className="uppercase tracking-[0.18em] text-[0.7rem] opacity-80 mr-2">
                      Tools →
                    </span>
                    <span>Python, API-based</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {work.intro && (
        <div className="mb-12">
          {work.id === 'behavior-flow-visualization' && (
            <h4 className="font-display font-semibold text-ink text-lg mb-2">
              Context
            </h4>
          )}
          <p className="case-body text-ink">
            {work.intro}
          </p>
        </div>
      )}

      {work.responsibilities && work.responsibilities.length > 0 && (
        <div className="mb-12">
          <h4 className="font-display font-semibold text-ink text-lg mb-3">
            Role & Responsibilities
          </h4>
          <ul className="list-disc list-inside case-body text-ink space-y-1">
            {work.responsibilities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {work.selectedWork && work.selectedWork.length > 0 && (
        <>
          <div className="case-divider-full mt-2" aria-hidden="true" />
          <div className="mb-12 pt-8">
          <div className="space-y-12">
            {work.selectedWork.map((block, idx) => {
              const phaseTitles = ['The Challenge', 'Exploration', 'Design Solutions', 'Outcomes'];
              const phaseTitle = phaseTitles[idx] || block.title;
              const isSentimentExploration = work.id === 'sentiment-analysis' && block.id === '02';
              const isSentimentWorkflow = work.id === 'sentiment-analysis' && block.id === '03';
              const isDesignSolutionsSentiment = work.id === 'sentiment-analysis' && block.id === '03';
              const isBehaviorFlowInteractive = work.id === 'behavior-flow-visualization' && block.id === '03';
              return (
                <div key={block.id} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="font-mono text-[0.78rem] text-muted tracking-[0.22em] pt-1">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h5 className="font-display font-semibold text-ink text-xl">
                          {phaseTitle}
                        </h5>
                        {block.timeline && (
                          <span className="font-mono text-[0.7rem] text-muted uppercase tracking-wide">
                            {block.timeline}
                          </span>
                        )}
                      </div>
                      {block.title && block.title !== phaseTitle && !isSentimentExploration && (
                        <p className="font-display italic subheading-burgundy text-sm mt-1">
                          {block.title}
                        </p>
                      )}
                      {isSentimentExploration ? (
                        <div className="case-body text-ink mt-3 space-y-4">
                          <p>
                            In customer service call transcripts, several elements may reflect a customer's level of satisfaction with the service interaction. These include:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[rgba(247,243,220,0.9)] rounded-md px-3 py-3">
                              <h6 className="font-mono text-[0.75rem] uppercase tracking-[0.16em] subheading-burgundy mb-1">
                                Forbidden or inappropriate words
                              </h6>
                              <p>
                                The presence of forbidden or inappropriate words in the conversation.
                              </p>
                            </div>
                            <div className="bg-[rgba(247,243,220,0.9)] rounded-md px-3 py-3">
                              <h6 className="font-mono text-[0.75rem] uppercase tracking-[0.16em] subheading-burgundy mb-1">
                                Long waiting or pause times
                              </h6>
                              <p>
                                Extended waiting or pause times during the interaction.
                              </p>
                            </div>
                            <div className="bg-[rgba(247,243,220,0.9)] rounded-md px-3 py-3">
                              <h6 className="font-mono text-[0.75rem] uppercase tracking-[0.16em] subheading-burgundy mb-1">
                                Unresolved questions
                              </h6>
                              <p>
                                Situations where the representative fails to answer or resolve the customer's questions.
                              </p>
                            </div>
                            <div className="bg-[rgba(247,243,220,0.9)] rounded-md px-3 py-3">
                              <h6 className="font-mono text-[0.75rem] uppercase tracking-[0.16em] subheading-burgundy mb-1">
                                Emotional tone
                              </h6>
                              <p>
                                The emotional tone or attitude expressed by the customer service representative.
                              </p>
                            </div>
                          </div>
                          <ul className="list-disc list-inside space-y-3">
                            <li>
                              In addition, understanding the customer's personality traits and whether the representative can recognize and adapt to the customer's communication style may also influence the overall satisfaction with the call.
                            </li>
                            <li>
                              Furthermore, key topics and frequently asked questions from past calls can provide valuable insights for future customer service interactions, helping representatives respond more effectively and ultimately improve customer satisfaction with the service experience.
                            </li>
                          </ul>
                        </div>
                      ) : isSentimentWorkflow ? (
                        <div className="case-body text-ink mt-3 space-y-4">
                          <p>
                            This workflow leverages the GPT API to perform sentiment analysis on call transcripts by adjusting prompts to evaluate the interactions between customers and service representatives. The analysis considers several indicators, including emotional tone, the presence of forbidden words, whether the representative’s responses correctly address the customer’s questions, and whether the customer expresses acknowledgment or agreement.
                          </p>
                          <p>
                            Based on these indicators, parameters are assigned to calculate a sentiment score range, allowing the representative’s responses to be evaluated from a sentiment and communication quality perspective. The system also extracts the key topics discussed in the call, which can be used as contextual prompts for future customer interactions.
                          </p>
                          <p>
                            In addition, the workflow analyzes the customer’s responses and inquiry patterns to infer personality traits, enabling representatives to better adjust their communication style. For example, customers may be identified as chatty or detail-oriented.
                          </p>
                          <p>
                            All extracted information is structured into a dataframe and stored in a data repository, which can then be used by supervisors to evaluate weekly team performance and identify broader operational issues.
                          </p>
                        </div>
                      ) : (
                        <p className="case-body text-ink mt-3">
                          {block.overview}
                        </p>
                      )}
                      {/* per design request, omit per-phase Role lines */}
                      {/* skills pills removed per design request */}
                    </div>
                  </div>

                  {block.images && block.images.length > 0 && (
                    isDesignSolutionsSentiment ? (
                      <div className="mt-4">
                        {block.images.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="bg-[rgba(247,243,220,0.55)] rounded-md overflow-hidden cursor-pointer group"
                            onClick={() => onImageClick(img.src)}
                          >
                            <img
                              src={img.src}
                              alt={img.caption || block.title}
                              className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                              referrerPolicy="no-referrer"
                            />
                            {img.caption && (
                              <div className="px-3 py-2 font-mono text-[0.7rem] text-muted bg-white/70">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {block.images.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="bg-[rgba(247,243,220,0.55)] rounded-md overflow-hidden cursor-pointer group"
                            onClick={() => onImageClick(img.src)}
                          >
                            <img
                              src={img.src}
                              alt={img.caption || block.title}
                              className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                              referrerPolicy="no-referrer"
                            />
                            {img.caption && (
                              <div className="px-3 py-2 font-mono text-[0.7rem] text-muted bg-white/70">
                                {img.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {isBehaviorFlowInteractive && (
                    <div className="mt-6 rounded-lg overflow-hidden border border-divider bg-[rgba(247,243,220,0.65)]">
                      <iframe
                        src="https://freight.cargo.site/m/N2201023043709052400335726138736/behavior_visualization.html"
                        title="Behavior Flow Interactive Visualization"
                        className="w-full h-[520px]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </>
      )}

      {work.reflection && (
        <>
          <div className="case-divider-full mt-2" aria-hidden="true" />
          <div className="pt-6 mt-8">
          <h4 className="font-display font-semibold text-ink text-lg mb-2">
            Reflection
          </h4>
          {work.id === 'sentiment-analysis' ? (
            <div className="case-body text-ink space-y-4">
              <p>
                Through API-based sentiment analysis, the quality of customer service calls can be quantified, enabling representatives to access useful information both before and after the call to better address customer inquiries. This approach also helps reduce the time managers need to spend reviewing conversations and identifying areas for service quality improvement.
              </p>
              <p>
                In later stages, we evaluated the accuracy of the sentiment analysis by comparing the model outputs with manual scoring. We also aim to further develop a live analysis feature that can provide real-time assistance to representatives during calls.
              </p>
              <div
                className="mt-3 max-w-[520px] bg-[rgba(247,243,220,0.9)] rounded-md overflow-hidden cursor-pointer group"
                onClick={() =>
                  onImageClick('/assets/Screenshot_2026-03-14_at_12.22.18_AM-b5854353-24a9-4847-a3d4-7151af1795c8.png')
                }
              >
                <img
                  src="/assets/Screenshot_2026-03-14_at_12.22.18_AM-b5854353-24a9-4847-a3d4-7151af1795c8.png"
                  alt=""
                  className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div
                className="mt-4 max-w-[520px] bg-[rgba(247,243,220,0.9)] rounded-md overflow-hidden cursor-pointer group"
                onClick={() =>
                  onImageClick('https://raw.githubusercontent.com/Sijie0607/AIPortfolio/main/Feedback-%20Sentiment.png')
                }
              >
                <img
                  src="https://raw.githubusercontent.com/Sijie0607/AIPortfolio/main/Feedback-%20Sentiment.png"
                  alt="Feedback Sentiment"
                  className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <p className="case-body text-ink">
              {work.reflection}
            </p>
          )}
          </div>
        </>
      )}
    </section>
  );
};

const ProjectDetail = ({ project, onImageClick }: { project: ProjectItem; onImageClick: (src: string) => void }) => {
  const isPsych = project.id === 'psychological-health-gaming';
  const sections = project.sections || [];

  if (isPsych) {
    const problem = sections[0];
    const purpose = sections[1];
    const findings = sections[2];
    const methodology = sections[3];
    const takeaway = sections[4];

    return (
      <section className="case-column px-6 md:px-0 pb-[96px]">
        {/* Full-width atmospheric heading */}
        <div className="mb-10 relative left-1/2 right-1/2 -ml-[50vw] w-screen">
          <div className="relative h-[320px] md:h-[380px] overflow-hidden">
            <div
              className="absolute inset-0 psych-particle-band"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 0% 0%, rgba(132, 163, 122, 0.9), transparent 55%),
                  radial-gradient(circle at 100% 20%, rgba(167, 190, 132, 0.75), transparent 58%),
                  radial-gradient(circle at 20% 100%, rgba(116, 141, 110, 0.8), transparent 58%),
                  radial-gradient(circle at 80% 80%, rgba(210, 184, 150, 0.75), transparent 60%),
                  linear-gradient(135deg, #6f8c6a 0%, #d4b79a 100%)
                `,
              }}
            />
            <BandParticles variant="psych" />
            <div className="relative h-full max-w-[960px] mx-auto px-7 md:px-10 py-8 flex flex-col justify-between z-[2]">
              <div>
                <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-[rgba(245,247,250,0.8)] mb-3 block">
                  Research Project
                </span>
                <h1
                  className="font-display font-bold text-[#f8f4e8] leading-none drop-shadow-sm"
                  style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.2rem)' }}
                >
                  Psychological Health of Gaming Communities
                </h1>
              </div>
              {(project.role || project.timeline || project.team) && (
                <div className="mt-4 font-mono text-[0.8rem] text-[#f5f5f0] space-y-1">
                  {project.role && (
                    <div>
                      <span className="uppercase tracking-[0.18em] text-[0.7rem] opacity-80 mr-2">
                        Role →
                      </span>
                      <span>{project.role}</span>
                    </div>
                  )}
                  {project.timeline && (
                    <div>
                      <span className="uppercase tracking-[0.18em] text-[0.7rem] opacity-80 mr-2">
                        Timeline →
                      </span>
                      <span>{project.timeline}</span>
                    </div>
                  )}
                  {project.team && (
                    <div>
                      <span className="uppercase tracking-[0.18em] text-[0.7rem] opacity-80 mr-2">
                        Team →
                      </span>
                      <span>{project.team}</span>
                    </div>
                  )}
                  <div>
                    <span className="uppercase tracking-[0.18em] text-[0.7rem] opacity-80 mr-2">
                      Tools →
                    </span>
                    <span>R, Tableau</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-14">
          {/* SUMMARY */}
          {project.overview && (
            <section>
              <h4 className="font-display font-semibold text-ink text-xl tracking-[0.16em] uppercase mb-3">
                Summary
              </h4>
              <p className="case-body text-ink">
                {project.overview}
              </p>
            </section>
          )}

          {/* THE PROBLEM */}
          {problem && (
            <section>
              <h4 className="font-display font-semibold text-ink text-xl tracking-[0.16em] uppercase mb-3">
                The Problem
              </h4>
              <p className="case-body text-ink">
                {problem.body}
              </p>
            </section>
          )}

          {/* PURPOSE */}
          {purpose && (
            <section>
              <h4 className="font-display font-semibold text-ink text-xl tracking-[0.16em] uppercase mb-3">
                Purpose
              </h4>
              <p className="case-body text-ink">
                {purpose.body}
              </p>
            </section>
          )}

          {/* Analysis: NOT ALL GAMERS ARE THE SAME */}
          {(findings || methodology) && (
            <section>
              <h4 className="font-display font-semibold text-ink text-xl tracking-[0.12em] uppercase mb-3">
                Analysis: Not All Gamers Are the Same
              </h4>
              {findings && (
                <div className="mb-4">
                  <h5 className="font-mono text-[0.8rem] uppercase tracking-[0.16em] subheading-burgundy mb-1">
                    Who You Are & Who You Play With
                  </h5>
                  <p className="case-body text-ink mb-3">
                    Conducted univariate analysis to understand the characteristics of the population and to generate preliminary insights for subsequent correlation analysis.
                  </p>
                  <h6 className="font-mono text-[0.78rem] uppercase tracking-[0.16em] subheading-burgundy mb-2">
                    Distribution of Age, Education Level and Playing Hours
                  </h6>
                  <div className="mt-3 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/Y2291471414362276765024704091504/Distribution-of-Age.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/Y2291471414362276765024704091504/Distribution-of-Age.png"
                        alt="Distribution of Age"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="md:w-1/3 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/Q2291471414343830020950994539888/distribution-of-education-level.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/Q2291471414343830020950994539888/distribution-of-education-level.png"
                        alt="Distribution of Education Level"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="md:w-1/3 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/K2122690890799503172429305697648/population-distribution-weekly-playing-hours.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/K2122690890799503172429305697648/population-distribution-weekly-playing-hours.png"
                        alt="Distribution of Weekly Playing Hours"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                  <h6 className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.16em] subheading-burgundy mb-2">
                    Gendered Glitches in Gamer Wellbeing
                  </h6>
                  <div className="mt-3 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/N2178866330219971862542799951216/Screenshot-2025-01-23-at-9.05.58PM.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/N2178866330219971862542799951216/Screenshot-2025-01-23-at-9.05.58PM.png"
                        alt="Gender differences in gamer wellbeing 1"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="md:w-1/2 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/U2178866330183078374395380847984/Screenshot-2025-01-23-at-9.05.54PM.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/U2178866330183078374395380847984/Screenshot-2025-01-23-at-9.05.54PM.png"
                        alt="Gender differences in gamer wellbeing 2"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                  <p className="mt-3 case-body text-ink">
                    These findings suggest potential psychological vulnerability among female gamers in the MOBA community and call for further exploration of gender-sensitive support mechanisms in game design and community culture. Mann-Whitney U tests revealed significant gender differences in all four psychological variables.
                  </p>
                  <h6 className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.16em] subheading-burgundy mb-2">
                    Rookies, Masters, and Mood Swings: How Gaming Experience Affects Mental Health
                  </h6>
                  <div className="mt-3 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/E2184667561595095391113515980144/Picture-circle.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/E2184667561595095391113515980144/Picture-circle.png"
                        alt="Gaming experience and mental health cluster diagram"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                  <p className="mt-3 case-body text-ink">
                    The cluster diagram suggests that players at the highest level were more possible to spend more time on games, most of the people have the highest rank shows the life satisfaction (SWL) less than 30. Among lower-ranked or unranked players, there is no significant variation in the distribution of life satisfaction levels.
                  </p>
                  <h6 className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.16em] subheading-burgundy mb-2">
                    How is excessive gaming defined, and how does it affect players?
                  </h6>
                  <div className="mt-3 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/R2189561449058755624342470874480/ANxiety-.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/R2189561449058755624342470874480/ANxiety-.png"
                        alt="Relationship between weekly playing hours and anxiety levels"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="px-3 py-2 case-body text-ink bg-white/90">
                        Even in the absence of gaming time, when the weekly playing hours are equal to 0, there may still be a presence of anxiety levels close to 5 points (0–4 minimal or none anxiety). The positive slope shows that every unit hour change may cause 0.024 anxiety level change in average.
                      </div>
                    </div>
                    <div className="md:w-1/2 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/H2189561449206329576932147287408/corr-life-satisifcation-playinghours.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/H2189561449206329576932147287408/corr-life-satisifcation-playinghours.png"
                        alt="Correlation between weekly playing hours and life satisfaction"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="px-3 py-2 case-body text-ink bg-white/90">
                        With every unit change in weekly playing hours, the satisfaction decrease 0.076.
                      </div>
                    </div>
                  </div>
                  <h6 className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.16em] subheading-burgundy mb-2">
                    How Gender, Playstyle, Rank, and Playtime Shape Life Satisfaction and Anxiety in MOBA Gaming
                  </h6>
                  <div className="mt-3 flex flex-col md:flex-row gap-4">
                    <div className="md:w-2/3 w-full bg-white/80 rounded-md overflow-hidden cursor-pointer group" onClick={() => onImageClick("https://freight.cargo.site/t/original/i/U2499505350305174508708343141744/Screenshot-2025-08-13-at-2.25.14PM.png")}>
                      <img
                        src="https://freight.cargo.site/t/original/i/U2499505350305174508708343141744/Screenshot-2025-08-13-at-2.25.14PM.png"
                        alt="How gender, playstyle, rank, and playtime shape life satisfaction and anxiety in MOBA gaming"
                        className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                  <p className="mt-3 case-body text-ink">
                    Through a multiple linear regression model, we can further quantify the impact of a single variable on GAD_T and SWL_T while holding other variables constant.
                  </p>
                </div>
              )}
              {methodology && (
                <div>
                  <p className="case-body text-ink">
                    {methodology.body}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Takeaway */}
          {takeaway && (
            <section>
              <h4 className="font-display font-semibold text-ink text-xl tracking-[0.16em] uppercase mb-3">
                Takeaway
              </h4>
              <ol className="list-decimal list-inside case-body text-ink space-y-3">
                <li>
                  When analyzing different gaming populations, it is important to distinguish gender and education. High school graduates have a higher proportion of excessively long gaming hours, while female players exhibit a higher average severity of anxiety compared to male players.
                </li>
                <li>
                  Play style encompasses general behavioral abilities, including social interactions and collaborative skills. The results of this data analysis indicate significant variations in GAD scores across different play styles, suggesting that play styles characterized by these social and cooperative elements may have a positive impact on the psychological well-being of gaming communities.
                </li>
                <li>
                  Gaming for more than 19–25 hours per week leads to an average anxiety level falling into the mild anxiety range (5–9) and an average satisfaction with life score entering the dissatisfied range (15–19).
                </li>
              </ol>
            </section>
          )}
        </div>
      </section>
    );
  }

  // Default layout for other projects
  return (
    <section className="case-column px-6 md:px-0 pb-[84px]">
      <div className="mb-8">
        <span className="font-mono text-muted text-[0.75rem] uppercase tracking-wider mb-2 block">
          Research Project
        </span>
        <h3 className="font-display font-bold text-ink text-2xl md:text-3xl mb-3">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="font-display italic text-ink-light text-sm mb-2">
            {project.subtitle}
          </p>
        )}
        {(project.role || project.timeline || project.team) && (
          <div className="font-mono text-[0.8rem] text-muted flex flex-wrap gap-3 mt-2">
            {project.role && <span>{project.role}</span>}
            {project.team && (
              <span className="px-2 py-0.5 border border-divider rounded-sm">
                {project.team}
              </span>
            )}
            {project.timeline && (
              <span className="px-2 py-0.5 border border-divider rounded-sm">
                {project.timeline}
              </span>
            )}
          </div>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 border border-divider rounded-sm font-mono text-[0.7rem] text-accent bg-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {project.overview && (
        <p className="case-body text-ink mb-10">
          {project.overview}
        </p>
      )}

      {sections.length > 0 && (
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="border border-divider rounded-lg p-5 bg-white/40"
            >
              <div className="flex items-start gap-4 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent font-mono text-[0.75rem] flex items-center justify-center shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h4 className="font-display font-semibold text-ink text-lg mb-2">
                    {section.title}
                  </h4>
                  <p className="case-body text-ink mb-2">
                    {section.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default function App() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [galleryView, setGalleryView] = useState<'illustration' | 'life' | null>(null);
  const [activeWorkId, setActiveWorkId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [aboutPhotoShake, setAboutPhotoShake] = useState(false);
  const [illustrationCoverIndex, setIllustrationCoverIndex] = useState(0);
  const [lifeCoverIndex, setLifeCoverIndex] = useState(0);

  const illustrationItems: GalleryItem[] = (illustrationsData as any).items || [];
  const lifeItems: GalleryItem[] = (lifeData as any).items || [];
  const currentItems: GalleryItem[] =
    galleryView === 'illustration'
      ? illustrationItems
      : galleryView === 'life'
      ? lifeItems
      : [];

  const workItems: WorkItem[] = (workData as any).work || [];
  const sentimentWork = workItems.find(w => w.id === 'sentiment-analysis');
  const behaviorFlowWork = workItems.find(w => w.id === 'behavior-flow-visualization');
  const activeWork = workItems.find(w => w.id === activeWorkId) || null;

  const projectItems: ProjectItem[] = (projectsData as any).projects || [];
  const psychProject = projectItems.find(p => p.id === 'psychological-health-gaming') || null;
  const activeProject = projectItems.find(p => p.id === activeProjectId) || null;

  // Rotate cover images for Illustration & Life using first 9 items where available
  React.useEffect(() => {
    if (illustrationItems.length === 0 && lifeItems.length === 0) return;
    const interval = setInterval(() => {
      setIllustrationCoverIndex(prev =>
        illustrationItems.length > 0 ? (prev + 1) % Math.min(illustrationItems.length, 9) : 0
      );
      setLifeCoverIndex(prev =>
        lifeItems.length > 0 ? (prev + 1) % Math.min(lifeItems.length, 9) : 0
      );
    }, 3200);
    return () => clearInterval(interval);
  }, [illustrationItems.length, lifeItems.length]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const ball = document.createElement('div');
    ball.className = 'bouncing-ball';
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ball.style.left = `${rect.left + rect.width / 2 - 4}px`;
    ball.style.top = `${rect.top}px`;
    document.body.appendChild(ball);
    setTimeout(() => ball.remove(), 550);
  };

  const handleGlobalNav = (targetId: string) => {
    // Reset to main page view
    setActiveProjectId(null);
    setActiveWorkId(null);
    // optional: close gallery / lightbox when jumping
    setGalleryView(null);
    setLightboxImg(null);
    // Wait for main layout to render before scrolling
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 0);
  };

  // If a project is active, show dedicated project detail "page"
  if (activeProject) {
    return (
      <div className="relative">
        <ScanPulseManager />
        <CustomCursor />
        <Navbar onNav={handleGlobalNav} />

        <main className="pt-[72px]">
          <SectionReveal
            id="project-case"
            label="Project"
            title=""
          >
            <ProjectDetail project={activeProject} onImageClick={(src) => setLightboxImg(src)} />
            <div className="case-column px-6 md:px-0 pb-10">
              <div className="case-divider-full mt-2" aria-hidden="true" />
              <div className="pt-6 mt-10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveProjectId(null);
                    setTimeout(() => {
                      const el = document.getElementById('projects');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 0);
                  }}
                  onMouseEnter={handleMouseEnter}
                  className="font-mono text-accent text-sm flex items-center gap-2 hover:gap-4 transition-all"
                >
                  ← Back to Projects
                </button>
                <span className="font-mono text-muted text-[0.7rem] uppercase tracking-widest">
                  End of case study
                </span>
              </div>
            </div>
          </SectionReveal>
        </main>

        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Lightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // If a work is active, show dedicated work detail "page"
  if (activeWork) {
    return (
      <div className="relative">
        <ScanPulseManager />
        <CustomCursor />
        <Navbar onNav={handleGlobalNav} />

        <main className="pt-[72px]">
          <SectionReveal
            id="work-case"
            label="Case Study"
            title=""
          >
            <WorkDetail work={activeWork} onImageClick={(src) => setLightboxImg(src)} />
            <div className="case-column px-6 md:px-0 pb-10">
              <div className="case-divider-full mt-2" aria-hidden="true" />
              <div className="pt-6 mt-10 flex items-center justify-between">
                <button
                  onClick={() => setActiveWorkId(null)}
                  onMouseEnter={handleMouseEnter}
                  className="font-mono text-accent text-sm flex items-center gap-2 hover:gap-4 transition-all"
                >
                  ← Back to Professional Journey
                </button>
                <span className="font-mono text-muted text-[0.7rem] uppercase tracking-widest">
                  End of case study
                </span>
              </div>
            </div>
          </SectionReveal>
        </main>

        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Lightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <ScanPulseManager />
      <CustomCursor />
      <Navbar onNav={handleGlobalNav} />

      <Hero />

      <div className="hero-gradient" />

      <SectionReveal id="experience" label="Work Experience" title="Professional Journey">
        {sentimentWork && (
          <WorkRow 
            tag={sentimentWork.role || 'NLP · Machine Learning · Analytics'} 
            title={sentimentWork.title} 
            desc={sentimentWork.tagline} 
            delay={0}
            thumbnail={
              sentimentWork.thumbnail ? (
                <img
                  src={sentimentWork.thumbnail}
                  alt={sentimentWork.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <CallThumbnail />
              )
            }
            onClick={() => {
              setActiveWorkId(sentimentWork.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {behaviorFlowWork && (
          <WorkRow 
            tag={behaviorFlowWork.role || 'Data Visualization · UX Research'} 
            title={behaviorFlowWork.title} 
            desc={behaviorFlowWork.tagline} 
            delay={1}
            thumbnail={
              behaviorFlowWork.thumbnail ? (
                <img
                  src={behaviorFlowWork.thumbnail}
                  alt={behaviorFlowWork.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : undefined
            }
            onClick={() => {
              setActiveWorkId(behaviorFlowWork.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </SectionReveal>

      <SectionReveal id="projects" label="Projects" title="Selected Works">
        {psychProject && (
          <WorkRow 
            tag={psychProject.role || 'Community · Mental Health · Analytics'} 
            title={psychProject.title} 
            desc="Correlations between in-game behavioral patterns and players’ psychological well-being"
            delay={0}
            thumbnail={
              psychProject.thumbnail ? (
                <img
                  src={psychProject.thumbnail}
                  alt={psychProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : undefined
            }
            onClick={() => {
              setActiveProjectId(psychProject.id);
              setActiveWorkId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </SectionReveal>

      <SectionReveal id="illustrations" label="Illustrations & Life" title="Creative Outlets">
        <AnimatePresence mode="wait">
          {!galleryView ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div 
                className="group relative h-[300px] bg-divider rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 ease-out hover:scale-[1.03]"
                onClick={() => setGalleryView('illustration')}
                onMouseEnter={handleMouseEnter}
              >
                {illustrationItems.length > 0 && (
                  <img
                    src={getItemSrc(illustrationItems[illustrationCoverIndex])}
                    alt={illustrationItems[illustrationCoverIndex].alt || illustrationItems[illustrationCoverIndex].title || 'Illustration cover'}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-ink/40 flex flex-col items-center justify-center text-white">
                  <h3 className="font-display font-bold text-3xl mb-2">Illustration</h3>
                  <span className="font-mono text-xs uppercase tracking-widest opacity-80">View Gallery →</span>
                </div>
              </div>

              <div 
                className="group relative h-[300px] bg-divider rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 ease-out hover:scale-[1.03]"
                onClick={() => setGalleryView('life')}
                onMouseEnter={handleMouseEnter}
              >
                {lifeItems.length > 0 && (
                  <img
                    src={getItemSrc(lifeItems[lifeCoverIndex])}
                    alt={lifeItems[lifeCoverIndex].alt || lifeItems[lifeCoverIndex].title || 'Life cover'}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-ink/40 flex flex-col items-center justify-center text-white">
                  <h3 className="font-display font-bold text-3xl mb-2">Life</h3>
                  <span className="font-mono text-xs uppercase tracking-widest opacity-80">View Gallery →</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setGalleryView(null)}
                onMouseEnter={handleMouseEnter}
                className="font-mono text-accent text-sm mb-8 flex items-center gap-2 hover:gap-4 transition-all"
              >
                ← Back to Selection
              </button>
              
              <h4 className="font-display font-bold text-2xl text-ink mb-8 capitalize">
                {galleryView} Gallery
              </h4>

              {galleryView === 'illustration' ? (
                // Horizontal sliding strip for Illustration
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw]">
                  <div className="overflow-x-auto pb-4">
                    <div className="px-[10vw] flex gap-6">
                      {currentItems.map((item, i) => (
                        <motion.div
                          key={item.id ?? i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.4 }}
                          className="relative w-[220px] md:w-[260px] aspect-[4/5] rounded-[10px] overflow-hidden cursor-pointer group shrink-0 bg-divider"
                          onClick={() => setLightboxImg(getItemSrc(item))}
                          onMouseEnter={handleMouseEnter}
                        >
                          <img
                            src={getItemSrc(item)}
                            alt={item.alt || item.title || `Illustration ${i + 1}`}
                            className="w-full h-full object-cover transform transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                          {item.title && (
                            <div className="absolute bottom-3 left-3 right-3 text-white font-mono text-[0.75rem] truncate">
                              {item.title}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Masonry-style random layout for Life
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw]">
                  <div className="px-4 sm:px-8">
                    <div className="columns-2 md:columns-3 gap-4">
                      {currentItems.map((item, i) => (
                        <motion.div
                          key={item.id ?? i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.4 }}
                          className="mb-4 break-inside-avoid cursor-pointer group"
                          onClick={() => setLightboxImg(getItemSrc(item))}
                          onMouseEnter={handleMouseEnter}
                        >
                          <div className="w-full bg-divider rounded-[8px] overflow-hidden">
                            <img
                              src={getItemSrc(item)}
                              alt={item.alt || item.title || `Life ${i + 1}`}
                              className="w-full h-auto object-contain transform transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          {item.caption && (
                            <div className="mt-1 font-mono text-[0.7rem] text-ink-light">
                              {item.caption}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </SectionReveal>

      <SectionReveal id="about" label="About Me" title="The Person Behind the Data">
        <div className="grid grid-cols-1 md:grid-cols-[190px_1fr] gap-[50px]">
          <div
            className="w-[190px] h-[230px] bg-divider rounded-[6px] overflow-hidden cursor-pointer group"
            onClick={() => {
              setLightboxImg(
                'https://raw.githubusercontent.com/Sijie0607/AIPortfolio/main/Aboutme%20photo.jpg'
              );
              setAboutPhotoShake(true);
              setTimeout(() => setAboutPhotoShake(false), 350);
            }}
          >
            <img
              src="https://raw.githubusercontent.com/Sijie0607/AIPortfolio/main/Aboutme%20photo.jpg"
              alt="Sijie Liu"
              className={`w-full h-full object-cover transform transition-transform duration-300 ease-out group-hover:scale-[1.03] ${
                aboutPhotoShake ? 'about-photo-shake' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="font-body text-ink-light leading-[1.82] space-y-4">
              <p>
                I’m Sijie. I explore and uncover stories through data analysis.
              </p>
              <p>
                With four years of business studies and two years of research in data analysis at Brandeis University, I have developed strong skills in exploratory data analysis, qualitative and quantitative research, machine learning, and data storytelling.
              </p>
              <p>
                My motivation comes from a deep interest in people and community centered projects where data analysis can play a meaningful role in designing better services and improving everyday experiences.
              </p>
              <p>
                I also love creating, whether it is reflecting on life or building thoughtful business projects. I am especially excited about learning and experimenting with AI tools and exploring the challenges and possibilities they bring to the creative process. :)
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4">
              {['Python', 'NLP', 'Data Viz', 'Illustration', 'Vibe Coding', 'Statistical Analysis'].map(skill => (
                <span 
                  key={skill}
                  className="px-3 py-1 border border-divider text-accent font-mono text-[0.75rem] rounded-[2px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <footer className="max-w-[820px] mx-auto px-10 pt-16 pb-12 border-t border-divider flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="font-display font-bold text-ink text-xl">Sijie Liu</div>
        
        <div className="flex flex-col items-center justify-center pt-8 -mt-12">
          <p className="font-script text-ink text-2xl md:text-3xl tracking-wide">Let's keep in touch!</p>
          <div className="flex items-center gap-6 font-mono text-[0.75rem] text-ink mt-4">
            <a
              href="https://www.linkedin.com/in/sijieliu0607/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleMouseEnter}
            className="nav-underline"
          >
            LinkedIn →
          </a>
          <a
            href="mailto:sijieliu68@gmail.com"
            onMouseEnter={handleMouseEnter}
            className="nav-underline"
            title="sijieliu68@gmail.com"
          >
            Email → <span className="ml-1 opacity-70 group-hover:opacity-100 select-text">sijieliu68@gmail.com</span>
          </a>
          <a
            href="https://github.com/Sijie0607/AIPortfolio/blob/main/Resume-Sijie%20Liu-%20Business%20Analyst%20.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleMouseEnter}
            className="border border-divider px-2 py-0.5 rounded-sm hover:border-accent transition-colors"
            title="View my resume in browser"
          >
            Resume ↓
          </a>
          </div>
        </div>
        
        <div className="font-mono text-muted text-[0.7rem] self-center md:self-auto">
          © 2026 Sijie Liu
        </div>
      </footer>

      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Lightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
