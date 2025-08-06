import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let darkParticles = [];
    let lightParticles = [];
    let laserLines = [];
    let animationId;
    let isTransitioning = false;
    let previousMode = isDarkMode;
    let fadeProgress = 0;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Dark mode: White floating balls
    class DarkParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Light mode: Gradient orbs
    class LightParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 80 + 40;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.hue = Math.random() * 30 + 320; // Pinkish hues
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
      }
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 90%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 90%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Light mode: Laser light lines
    class LaserLine {
      constructor() {
        this.x1 = Math.random() * canvas.width;
        this.y1 = Math.random() * canvas.height;
        this.x2 = Math.random() * canvas.width;
        this.y2 = Math.random() * canvas.height;
        this.speedX1 = (Math.random() - 0.5) * 2;
        this.speedY1 = (Math.random() - 0.5) * 2;
        this.speedX2 = (Math.random() - 0.5) * 2;
        this.speedY2 = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.width = Math.random() * 3 + 1;
        this.pulse = 0;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
      }
      update() {
        this.x1 += this.speedX1;
        this.y1 += this.speedY1;
        this.x2 += this.speedX2;
        this.y2 += this.speedY2;
        this.pulse += this.pulseSpeed;

        if (this.x1 > canvas.width || this.x1 < 0) this.speedX1 *= -1;
        if (this.y1 > canvas.height || this.y1 < 0) this.speedY1 *= -1;
        if (this.x2 > canvas.width || this.x2 < 0) this.speedX2 *= -1;
        if (this.y2 > canvas.height || this.y2 < 0) this.speedY2 *= -1;
      }
      draw() {
        const pulseOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
        
        const gradient = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
        gradient.addColorStop(0, `rgba(255, 182, 193, ${pulseOpacity})`);
        gradient.addColorStop(0.5, `rgba(255, 192, 203, ${pulseOpacity * 1.5})`);
        gradient.addColorStop(1, `rgba(255, 182, 193, ${pulseOpacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();

        ctx.shadowColor = 'rgba(255, 182, 193, 0.8)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    const startTransition = () => {
      isTransitioning = true;
      fadeProgress = 0;
      
      // Smooth fade transition (slower for light mode)
      const fadeStep = isDarkMode ? 0.02 : 0.012;
      const fadeOut = () => {
        fadeProgress += fadeStep;
        if (fadeProgress < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          // Switch modes after fade out
          if (isDarkMode) {
            // Switch to dark mode
            darkParticles = [];
            for (let i = 0; i < 20; i++) {
              darkParticles.push(new DarkParticle());
            }
            lightParticles = [];
            laserLines = [];
          } else {
            // Switch to light mode
            lightParticles = [];
            for (let i = 0; i < 8; i++) {
              lightParticles.push(new LightParticle());
            }
            laserLines = [];
            for (let i = 0; i < 12; i++) {
              laserLines.push(new LaserLine());
            }
            darkParticles = [];
          }
          
          // Fade in new mode
          fadeProgress = 1;
          const fadeIn = () => {
            fadeProgress -= fadeStep;
            if (fadeProgress > 0) {
              requestAnimationFrame(fadeIn);
            } else {
              isTransitioning = false;
              fadeProgress = 0;
            }
          };
          fadeIn();
        }
      };
      fadeOut();
    };

    const init = () => {
      darkParticles = [];
      lightParticles = [];
      laserLines = [];
      
      if (isDarkMode) {
        // Dark mode: 20 white balls
        for (let i = 0; i < 20; i++) {
          darkParticles.push(new DarkParticle());
        }
      } else {
        // Light mode: 8 pinkish orbs + 12 laser lines
        for (let i = 0; i < 8; i++) {
          lightParticles.push(new LightParticle());
        }
        for (let i = 0; i < 12; i++) {
          laserLines.push(new LaserLine());
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isDarkMode) {
        // Dark mode background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw dark particles with fade effect
        if (isTransitioning && fadeProgress < 0.5) {
          // Fading out
          const opacity = 1 - fadeProgress * 2;
          ctx.globalAlpha = opacity;
        } else if (isTransitioning && fadeProgress > 0.5) {
          // Fading in
          const opacity = (fadeProgress - 0.5) * 2;
          ctx.globalAlpha = opacity;
        }
        
        for (let i = 0; i < darkParticles.length; i++) {
          darkParticles[i].update();
          darkParticles[i].draw();
        }
      } else {
        // Light mode background: soft pinkish pastel gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#fbeffb'); // very light pink
        gradient.addColorStop(0.3, '#f8e1f4'); // pastel pink
        gradient.addColorStop(0.7, '#f7e6f8'); // soft pink
        gradient.addColorStop(1, '#fbeffb'); // very light pink
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw light particles and lasers with fade effect
        if (isTransitioning && fadeProgress < 0.5) {
          // Fading out
          const opacity = 1 - fadeProgress * 2;
          ctx.globalAlpha = opacity;
        } else if (isTransitioning && fadeProgress > 0.5) {
          // Fading in
          const opacity = (fadeProgress - 0.5) * 2;
          ctx.globalAlpha = opacity;
        }
        
        for (let i = 0; i < lightParticles.length; i++) {
          lightParticles[i].update();
          lightParticles[i].draw();
        }
        
        for (let i = 0; i < laserLines.length; i++) {
          laserLines[i].update();
          laserLines[i].draw();
        }
      }
      
      ctx.globalAlpha = 1; // Reset alpha
      animationId = requestAnimationFrame(animate);
    };

    // Check if mode changed and start smooth transition
    if (previousMode !== isDarkMode) {
      startTransition();
      previousMode = isDarkMode;
    }

    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isDarkMode]);

  return (
    <div className="animated-background-container">
      <canvas ref={canvasRef} className="animated-background-canvas" />
    </div>
  );
};

export default AnimatedBackground; 