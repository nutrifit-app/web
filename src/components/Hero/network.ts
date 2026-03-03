interface Particle {
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  z: number;
  baseZ: number;
}

export function initNetwork(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles: Particle[] = [];
  const gridSize = 30;
  const spacing = 40;
  let mouseX = -1000;
  let mouseY = -1000;
  let time = 0;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles.length = 0;
    const cols = Math.floor(canvas.width / spacing) + 2;
    const rows = Math.floor(canvas.height / spacing) + 2;

    const offsetX = (canvas.width - (cols - 1) * spacing) / 2;
    const offsetY = (canvas.height - (rows - 1) * spacing) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        particles.push({
          gridX: i,
          gridY: j,
          x: offsetX + i * spacing,
          y: offsetY + j * spacing,
          z: 0,
          baseZ: 0,
        });
      }
    }
  }

  function updateParticles() {
    time += 0.03;

    particles.forEach((particle) => {
      // Create 3D wave effect
      const waveX = Math.sin(time + particle.gridX * 0.3) * 30;
      const waveY = Math.cos(time + particle.gridY * 0.3) * 30;
      const waveZ = Math.sin(time + particle.gridX * 0.2 + particle.gridY * 0.2) * 50;

      particle.z = waveZ;

      // Mouse interaction - create ripple in 3D space
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const mouseRadius = 200;

      if (distance < mouseRadius) {
        const rippleStrength = (1 - distance / mouseRadius) * 80;
        const ripplePhase = (distance / 50) - time * 2;
        particle.z += Math.sin(ripplePhase) * rippleStrength;
      }

      // Add subtle wave variations
      particle.z += waveX * 0.3 + waveY * 0.3;
    });
  }

  function drawParticles() {
    // Sort particles by z-depth for proper 3D rendering
    const sorted = [...particles].sort((a, b) => a.z - b.z);

    sorted.forEach((particle) => {
      // Calculate 3D perspective
      const perspective = 1000;
      const scale = perspective / (perspective + particle.z);
      const x = particle.x + (particle.x - canvas.width / 2) * (1 - scale);
      const y = particle.y + (particle.y - canvas.height / 2) * (1 - scale);

      // Size and opacity based on depth
      const baseSize = 3;
      const size = baseSize * scale;
      const depth = (particle.z + 100) / 200;
      const opacity = Math.max(0.2, Math.min(1, depth));

      // Color intensity based on z-position
      const brightness = Math.max(0.4, Math.min(1, (particle.z + 60) / 120));

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(155, 189, 221, ${opacity * brightness})`;
      ctx.fill();

      // Add glow for particles closer to viewer
      if (particle.z > 20) {
        ctx.beginPath();
        ctx.arc(x, y, size + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 189, 221, ${opacity * 0.2})`;
        ctx.fill();
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  resize();
  animate();
}
