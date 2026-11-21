(() => {
  const canvas = document.getElementById('sky');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stars = [];
  const fullTurn = 2 * Math.PI;
  let seed = 251006;
  let width = 0;
  let height = 0;
  let elapsed = 0;
  let lastFrame = 0;
  let timer = 0;

  function random() {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = Math.min(250, Math.ceil(width * height / 6400));
    while (stars.length < count) {
      const brightness = Math.pow(random(), 3);
      stars.push({
        x: random(), y: random(), phase: random() * fullTurn,
        brightness, radius: 0.38 + brightness * 0.9,
        speed: 0.16 + brightness * 0.42,
        color: random() < 0.2 ? '231,220,204' : '221,226,241'
      });
    }
    draw();
  }

  function draw() {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const count = Math.min(stars.length, Math.ceil(width * height / 6400));
    for (let i = 0; i < count; i++) {
      const star = stars[i];
      const x = (star.x * width + elapsed * star.speed) % width;
      const y = (star.y * height + elapsed * star.speed * 0.22) % height;
      const shimmer = 0.9 + 0.1 * Math.sin(star.phase + elapsed * 0.6);
      const alpha = (0.16 + 0.61 * star.brightness) * shimmer;
      if (star.brightness > 0.8) {
        const halo = context.createRadialGradient(x, y, 0, x, y, 3.7);
        halo.addColorStop(0, 'rgba(' + star.color + ',0.17)');
        halo.addColorStop(1, 'rgba(' + star.color + ',0)');
        context.fillStyle = halo;
        context.fillRect(x - 3.7, y - 3.7, 7.4, 7.4);
      }
      context.fillStyle = 'rgba(' + star.color + ',' + alpha + ')';
      context.beginPath();
      context.arc(x, y, star.radius, 0, fullTurn);
      context.fill();
    }
  }

  function frame() {
    const now = performance.now();
    elapsed += (now - lastFrame) / 1000;
    lastFrame = now;
    draw();
    timer = window.setTimeout(frame, 100);
  }

  function updateMotion() {
    window.clearTimeout(timer);
    if (!document.hidden && !motionPreference.matches) {
      lastFrame = performance.now();
      frame();
    } else if (!document.hidden) {
      draw();
    }
  }

  resize();
  updateMotion();
  new ResizeObserver(resize).observe(canvas);
  document.addEventListener('visibilitychange', updateMotion);
  motionPreference.addEventListener('change', updateMotion);
})();
