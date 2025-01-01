import React, { useEffect, useRef } from 'react';

interface OctopusPowerupProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export const OctopusPowerup: React.FC<OctopusPowerupProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    updateCanvasSize();

    // Particle class
    class ParticleImpl implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor(width: number, height: number) {
        this.x = width / 2;
        this.y = height / 2;
        this.size = Math.random() * 15 + 5;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        this.color = `hsl(${Math.random() * 60 + 30}, 100%, 50%)`; // Golden colors
        this.opacity = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        this.opacity -= 0.01;
        this.size *= 0.99;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Define particles array and particle count
    const particles: Particle[] = [];
    const particleCount = 200;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new ParticleImpl(canvas.width, canvas.height));
    }

    let frame = 0;
    const maxFrames = 120; // 2 seconds at 60fps

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);

        // Remove particles when opacity is 0
        if (particle.opacity <= 0) {
          particles.splice(index, 1);
        }
      });

      // Draw "x2" text
      if (frame > 30) { // Start after 0.5 seconds
        const scale = Math.min((frame - 30) / 30, 1); // Scale up over 0.5 seconds
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.font = 'bold 240px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'gold';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 8;
        ctx.strokeText('×2', 0, 0);
        ctx.fillText('×2', 0, 0);
        ctx.restore();
      }

      frame++;

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        onComplete(); // Notify completion
      }
    };

    // Play sound effect
    const sound = new Audio('/octopus_powerup.mp3');
    sound.volume = 0.5;
    sound.play().catch(console.error);

    // Start animation
    animate();

    // Cleanup on unmount
    return () => {
      sound.pause();
      sound.currentTime = 0;
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    />
  );
};