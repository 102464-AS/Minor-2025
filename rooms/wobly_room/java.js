"use strict";

// De Spotlight
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('lightBtn');
  const spotlight = document.querySelector('.spotlight');
  if (!btn || !spotlight) return;
  if (!spotlight.querySelector('.spotlight__beam')) {
    const beam = document.createElement('div');
    beam.className = 'spotlight__beam';
    spotlight.appendChild(beam);
  }

  // Meerdere lichtstralen
  const EXTRAS = 5; 
  for (let i = 0; i < EXTRAS; i++) {
    const beam = document.createElement('div');
    beam.className = 'spotlight__beam';
    spotlight.appendChild(beam);
  }

  const beams = Array.from(spotlight.querySelectorAll('.spotlight__beam'));
  let running = false;
  let t = 0;

  // Interactive camera 
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;  
    const y = (e.clientY / window.innerHeight) * 2 - 1; 
    const maxTiltX = 6;  
    const maxTiltY = 8; 
    const tiltX = (-y * maxTiltX).toFixed(3) + 'deg';
    const tiltY = ( x * maxTiltY).toFixed(3) + 'deg';
    const originX = (50 + x * 14).toFixed(2) + '%';
    const originY = (50 + y * 10).toFixed(2) + '%';
    root.style.setProperty('--tilt-x', tiltX);
    root.style.setProperty('--tilt-y', tiltY);
    root.style.setProperty('--persp-origin-x', originX);
    root.style.setProperty('--persp-origin-y', originY);
  }, { passive: true });

  function tick(){
    t += 0.02;
    const speed = running ? 1 : 0.3;
    const amp = (running ? 0.22 : 0.06) * window.innerWidth; 
    const baseIntensity = running ? 0.8 : 1.0;
    const intensity = baseIntensity + Math.sin(t * 2.0) * (running ? 0.2 : 0.05);
    const globalHue = running ? (t * 40) % 360 : 0; 
    root.style.setProperty('--spot-intensity', String(intensity));
    root.style.setProperty('--spot-hue', String(globalHue));

    beams.forEach((beam, i) => {
      const phase = i * 0.9;
      const w = (running ? 18 : 24) + Math.sin(t * 1.3 * speed + phase) * (running ? 10 : 2);
      const offset = Math.sin(t * speed + phase) * amp + (i - (beams.length-1)/2) * (running ? 28 : 14);
      beam.style.setProperty('--beam-width', w.toFixed(2) + 'vmin');
      beam.style.setProperty('--beam-offset-x', offset.toFixed(2) + 'px');
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  btn.addEventListener('click', () => {
    running = !running;
    document.body.classList.toggle('lightshow', running);
    btn.setAttribute('aria-pressed', running ? 'true' : 'false');
    btn.textContent = running ? 'Stop' : 'Klik Hier';
  });
})();


