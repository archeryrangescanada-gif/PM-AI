import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
  size: number; opacity: number;
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const COUNT = 90;
    const MAX_DIST = 160;
    const COLOR = '0, 212, 170';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Init particles spread across a tall virtual space
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 3,
      baseX: Math.random() * window.innerWidth,
      baseY: Math.random() * window.innerHeight * 3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    let frame = 0;

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      frame++;

      const scroll = scrollRef.current;
      const parallax = scroll * 0.18;
      const twist = scroll * 0.00018; // subtle rotation per scroll px

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Move particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // Gentle drift back toward base position
        p.x += (p.baseX - p.x) * 0.003;
        p.y += (p.baseY - p.y) * 0.003;
        // Wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });

      // Transform canvas: shift by scroll parallax + subtle rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(twist);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.translate(0, -parallax % canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR}, ${p.opacity})`;
        ctx.fill();

        // Occasional pulse glow on some dots
        if (p.size > 2.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${COLOR}, ${p.opacity * 0.15})`;
          ctx.fill();
        }
      });

      // Draw a second shifted layer for depth (parallax at different speed)
      ctx.translate(0, -parallax * 0.4);
      particles.slice(0, 30).forEach((p, i) => {
        const x2 = (p.x + canvas.width * 0.5) % canvas.width;
        const y2 = (p.y + canvas.height * 0.3) % (canvas.height * 3);
        ctx.beginPath();
        ctx.arc(x2, y2, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR}, ${p.opacity * 0.4})`;
        ctx.fill();
      });

      ctx.restore();
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
