import { useEffect, useRef } from 'react';

const glyphs = 'アカサタナハマヤラワ0123456789#$%&*+=<>/?{}[]';

export default function CodeRain({ active }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let columnWidth = 14;
    let columns = Math.floor(width / columnWidth);
    let drops = Array.from({ length: columns }, () => Math.random() * height);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / columnWidth);
      drops = Array.from({ length: columns }, () => Math.random() * height);
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.fillStyle = 'rgba(5,11,10,0.10)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '14px "Fira Code", monospace';
      ctx.textBaseline = 'top';

      for (let i = 0; i < columns; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * columnWidth + 2;
        const y = drops[i] * 14;
        const gradient = ctx.createLinearGradient(x, y, x, y + 14);
        gradient.addColorStop(0, 'rgba(0,255,65,0.9)');
        gradient.addColorStop(1, 'rgba(0,255,65,0.2)');
        ctx.fillStyle = gradient;
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-screen transition-opacity duration-700"
      style={{ filter: 'blur(0.4px)' }}
    />
  );
}
