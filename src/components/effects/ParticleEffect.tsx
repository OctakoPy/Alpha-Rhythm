import React, { useEffect, useRef } from 'react';

interface ParticleEffectProps {
  type: 'corner' | 'floating' | 'stream';
  intensity: number;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ type, intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = type === 'corner' ? 20 : type === 'floating' ? 40 : 60;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.reset();
      }

      reset() {
        if (type === 'corner') {
          this.x = Math.random() < 0.5 ? 0 : canvas.width;
          this.y = Math.random() < 0.5 ? 0 : canvas.height;
        } else if (type === 'floating') {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        } else {
          this.x = canvas.width / 2;
          this.y = canvas.height / 2;
        }

        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * (intensity * 0.5);
        this.speedY = (Math.random() - 0.5) * (intensity * 0.5);
        this.opacity = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (type === 'stream') {
          this.opacity -= 0.01;
        }

        if (
          this.x < 0 ||
          this.x > canvas.width ||
          this.y < 0 ||
          this.y > canvas.height ||
          this.opacity <= 0
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [type, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};