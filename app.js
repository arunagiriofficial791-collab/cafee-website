/* ==========================================================================
   LUMINA ARTISANAL CAFÉ & ROASTERY - INTERACTIVE 3D & CORE APP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  initHero3DCanvas();
  initDrinkCustomizerCanvas();
  initMenuExplorer();
  initThemeSwitcher();
  initAudioSoundscape();
  initSeatingReservation();
  initLiveHoursStatus();
  initScrollAnimations();
});

/* ==========================================================================
   1. HERO 3D CANVAS & BEAN/STEAM PARTICLE PHYSICS
   ========================================================================== */
function initHero3DCanvas() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Floating Coffee Bean Class
  class CoffeeBean {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 40;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.4;
      this.rotation += this.rotSpeed;
      if (this.y < -50) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      // Draw 3D-styled Roasted Coffee Bean shape
      ctx.fillStyle = '#4A2511';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bean crease line
      ctx.strokeStyle = '#251207';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.7, 0);
      ctx.bezierCurveTo(-this.size * 0.2, -this.size * 0.3, this.size * 0.2, this.size * 0.3, this.size * 0.7, 0);
      ctx.stroke();

      // Highlight
      ctx.fillStyle = 'rgba(229, 169, 103, 0.2)';
      ctx.beginPath();
      ctx.ellipse(-this.size * 0.2, -this.size * 0.2, this.size * 0.3, this.size * 0.15, -0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Steam Particle Class
  class SteamParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = canvas.width / 2 + (Math.random() - 0.5) * 60;
      this.y = canvas.height / 2 + 50;
      this.radius = Math.random() * 20 + 10;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.maxAlpha = this.alpha;
    }
    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.02) * 0.8;
      this.radius += 0.4;
      this.alpha -= 0.005;
      if (this.alpha <= 0 || this.y < canvas.height / 2 - 200) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, 'rgba(255, 245, 235, 0.25)');
      grad.addColorStop(1, 'rgba(255, 245, 235, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const beans = Array.from({ length: 22 }, () => new CoffeeBean());
  const steams = Array.from({ length: 30 }, () => new SteamParticle());

  // Mouse Parallax Logic
  let mouseX = 0, mouseY = 0;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - canvas.width / 2) * 0.05;
    mouseY = (e.clientY - rect.top - canvas.height / 2) * 0.05;
  });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render beans
    beans.forEach(b => {
      b.x += mouseX * 0.05;
      b.update();
      b.draw();
    });

    // Render steam particles rising from center
    steams.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. 3D INTERACTIVE DRINK CRAFTING LAB (360 CANVAS ENGINE)
   ========================================================================== */
function initDrinkCustomizerCanvas() {
  const canvas = document.getElementById('customizer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Customizer State
  const state = {
    roast: 'medium', // light, medium, dark
    base: 'latte',   // espresso, latte, cappuccino, macchiato
    milk: 'oat',     // whole, oat, almond, coconut
    latteArt: 'rosetta', // rosetta, heart, tulip
    foamHeight: 0.6,
    sweetness: 2,
    topping: 'cocoa', // cocoa, cinnamon, caramel
    rotation: 0.3,
    isDragging: false,
    lastX: 0
  };

  // Drag to rotate 3D Cup
  canvas.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    state.lastX = e.clientX;
  });

  window.addEventListener('mouseup', () => state.isDragging = false);
  canvas.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    const deltaX = e.clientX - state.lastX;
    state.rotation += deltaX * 0.01;
    state.lastX = e.clientX;
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      state.isDragging = true;
      state.lastX = e.touches[0].clientX;
    }
  });
  canvas.addEventListener('touchmove', (e) => {
    if (state.isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - state.lastX;
      state.rotation += deltaX * 0.01;
      state.lastX = e.touches[0].clientX;
    }
  });
  window.addEventListener('touchend', () => state.isDragging = false);

  // UI Event Listeners
  document.querySelectorAll('[data-opt="base"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-opt="base"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.base = btn.dataset.val;
      updateFlavorRadar();
    });
  });

  document.querySelectorAll('[data-opt="roast"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-opt="roast"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.roast = btn.dataset.val;
      updateFlavorRadar();
    });
  });

  document.querySelectorAll('[data-opt="art"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-opt="art"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.latteArt = btn.dataset.val;
    });
  });

  const foamSlider = document.getElementById('foam-slider');
  if (foamSlider) {
    foamSlider.addEventListener('input', (e) => {
      state.foamHeight = parseFloat(e.target.value);
    });
  }

  const sweetSlider = document.getElementById('sweet-slider');
  if (sweetSlider) {
    sweetSlider.addEventListener('input', (e) => {
      state.sweetness = parseInt(e.target.value);
      updateFlavorRadar();
    });
  }

  function updateFlavorRadar() {
    // Dynamically calculate taste metrics
    let sweetness = state.sweetness * 20;
    let body = state.roast === 'dark' ? 90 : (state.roast === 'medium' ? 65 : 45);
    let acidity = state.roast === 'light' ? 85 : (state.roast === 'medium' ? 50 : 20);
    let bitterness = state.base === 'espresso' ? 80 : 40;
    let aroma = 75 + (state.roast === 'medium' ? 15 : 5);

    setRadarVal('bar-sweetness', sweetness);
    setRadarVal('bar-acidity', acidity);
    setRadarVal('bar-body', body);
    setRadarVal('bar-bitterness', bitterness);
    setRadarVal('bar-aroma', aroma);
  }

  function setRadarVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.style.width = `${Math.min(100, Math.max(10, val))}%`;
  }

  updateFlavorRadar();

  // Render 3D Coffee Cup Geometry with dynamic shading
  function draw3DCup() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 30;
    const rTop = 110;
    const rBottom = 70;
    const height = 150;

    // Cup Colors
    const cupColor = '#F4EBE1';
    const shadowColor = 'rgba(0,0,0,0.5)';

    // Liquid Colors based on roast
    let liquidColor = '#3A1F12';
    if (state.roast === 'light') liquidColor = '#6A3B21';
    if (state.roast === 'dark') liquidColor = '#21110A';

    let foamColor = '#FAF3EB';
    if (state.base === 'espresso') foamColor = '#C8935C'; // Crema

    // Rotate angle calculation
    const rot = state.rotation;
    const tilt = 0.25; // fixed perspective tilt

    // 1. Draw Cup Shadow
    ctx.save();
    ctx.translate(cx, cy + height / 2 + 20);
    ctx.scale(1, 0.4);
    const shadowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rTop + 40);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rTop + 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Draw Ceramic Cup Body (Cylinder)
    ctx.save();
    ctx.translate(cx, cy);

    // Cup Handle (3D Curve)
    const handleAngle = rot + Math.PI / 2;
    const handleX = Math.cos(handleAngle) * (rTop + 20);
    const handleY = Math.sin(handleAngle) * tilt * 50;

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#E6DCCE';
    ctx.beginPath();
    ctx.arc(Math.cos(rot + Math.PI / 4) * 90, 0, 45, 0, Math.PI * 2);
    ctx.stroke();

    // Outer Cup Body Gradient
    const bodyGrad = ctx.createLinearGradient(-rTop, -height/2, rTop, height/2);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.3, '#EBE0D2');
    bodyGrad.addColorStop(0.8, '#C4B4A0');
    bodyGrad.addColorStop(1, '#8A7A68');

    // Draw Main Body Geometry
    ctx.beginPath();
    ctx.ellipse(0, -height / 2, rTop, rTop * tilt, 0, Math.PI, 0, true);
    ctx.lineTo(rBottom, height / 2);
    ctx.ellipse(0, height / 2, rBottom, rBottom * tilt, 0, 0, Math.PI, false);
    ctx.lineTo(-rTop, -height / 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Draw Liquid & Foam Interior
    const liquidY = -height / 2 + 15;
    const liquidR = rTop - 10;

    // Liquid Surface (Ellipse)
    ctx.save();
    ctx.translate(0, liquidY);
    ctx.scale(1, tilt);

    ctx.beginPath();
    ctx.arc(0, 0, liquidR, 0, Math.PI * 2);
    ctx.fillStyle = liquidColor;
    ctx.fill();

    // Foam Layer Surface
    if (state.base !== 'espresso' || state.foamHeight > 0.2) {
      const foamR = liquidR * (0.85 + state.foamHeight * 0.12);
      ctx.beginPath();
      ctx.arc(0, 0, foamR, 0, Math.PI * 2);
      const foamGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, foamR);
      foamGrad.addColorStop(0, foamColor);
      foamGrad.addColorStop(0.85, '#E8DACC');
      foamGrad.addColorStop(1, '#C8B29C');
      ctx.fillStyle = foamGrad;
      ctx.fill();

      // 4. Draw Latte Art Pattern (Rosetta / Heart / Tulip)
      drawLatteArt(ctx, state.latteArt, foamR);
    }

    ctx.restore();
    ctx.restore();

    // 5. Rising Steam Particles from Customizer Cup
    drawCustomizerSteam(ctx, cx, cy - height / 2 - 20);
  }

  function drawLatteArt(ctx, artType, size) {
    ctx.save();
    ctx.strokeStyle = '#6E3B1C';
    ctx.fillStyle = '#6E3B1C';
    ctx.lineWidth = 3;

    if (artType === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(-size * 0.4, -size * 0.3, -size * 0.4, -size * 0.7, 0, -size * 0.3);
      ctx.bezierCurveTo(size * 0.4, -size * 0.7, size * 0.4, -size * 0.3, 0, 10);
      ctx.fill();
    } else if (artType === 'rosetta') {
      // Draw layered Rosetta leaves
      for (let i = 0; i < 6; i++) {
        const y = -size * 0.6 + i * (size * 0.18);
        const w = (6 - i) * 8;
        ctx.beginPath();
        ctx.ellipse(0, y, w, w * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(0, size * 0.5);
      ctx.stroke();
    } else {
      // Tulip
      for (let i = 0; i < 3; i++) {
        const y = -size * 0.4 + i * 15;
        ctx.beginPath();
        ctx.arc(0, y, 20 - i * 4, Math.PI * 0.2, Math.PI * 0.8, true);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  const customSteam = Array.from({ length: 15 }, () => ({
    x: 0, y: 0, r: Math.random() * 10 + 5, a: Math.random() * 0.3 + 0.1
  }));

  function drawCustomizerSteam(ctx, x, y) {
    customSteam.forEach(s => {
      s.y -= 0.6;
      s.a -= 0.003;
      if (s.a <= 0) {
        s.y = 0;
        s.x = (Math.random() - 0.5) * 30;
        s.a = Math.random() * 0.3 + 0.1;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.a);
      ctx.fillStyle = 'rgba(255, 245, 235, 0.2)';
      ctx.beginPath();
      ctx.arc(x + s.x + Math.sin(s.y * 0.05) * 10, y + s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function renderCustomizer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.rotation += 0.002; // slow auto spin
    draw3DCup();
    requestAnimationFrame(renderCustomizer);
  }
  renderCustomizer();
}

/* ==========================================================================
   3. SIGNATURE MENU & FLAVOR EXPLORER
   ========================================================================== */
const MENU_DATA = [
  {
    id: 1,
    name: 'Lumina Golden Velvet Latte',
    category: 'espresso',
    price: '$6.50',
    desc: 'Triple-shot single origin Ethiopian roast with micro-foamed oat milk and edible gold dust.',
    image: 'assets/hero_coffee.png',
    tags: ['Signature', 'Bestseller', 'Oat Milk'],
    calories: '190 kcal',
    origin: 'Yirgacheffe, Ethiopia'
  },
  {
    id: 2,
    name: 'Nitro Amber Cold Brew',
    category: 'coldbrew',
    price: '$5.75',
    desc: '24-hour slow steeped cold brew infused with pure nitrogen, served with amber orange peel.',
    image: 'assets/cold_brew.png',
    tags: ['Cold Draft', 'Zero Sugar'],
    calories: '15 kcal',
    origin: 'Huila, Colombia'
  },
  {
    id: 3,
    name: 'Artisanal Almond Croissant',
    category: 'bakery',
    price: '$4.95',
    desc: 'Twice-baked French butter croissant filled with almond frangipane and toasted almonds.',
    image: 'assets/pastry.png',
    tags: ['Fresh Baked', 'Organic Butter'],
    calories: '340 kcal',
    origin: 'In-House Bakery'
  },
  {
    id: 4,
    name: 'Smoked Vanilla Flat White',
    category: 'espresso',
    price: '$5.90',
    desc: 'Ristretto espresso poured over silky steamed milk infused with Madagascar smoked vanilla.',
    image: 'assets/hero_coffee.png',
    tags: ['Silky Texture', 'Vanilla'],
    calories: '160 kcal',
    origin: 'Guatemala Antigua'
  },
  {
    id: 5,
    name: 'Kyoto Drip Ice Coffee',
    category: 'coldbrew',
    price: '$6.20',
    desc: 'Slow glass drip extraction over 8 hours creating floral jasmine notes and smooth finish.',
    image: 'assets/specialty_cold_brew.png',
    tags: ['Limited Batch', 'Floral'],
    calories: '5 kcal',
    origin: 'Kyoto Style Drip'
  },
  {
    id: 6,
    name: 'Ceremonial Match Botanical Latte',
    category: 'tea',
    price: '$6.80',
    desc: 'First-harvest Uji matcha whisked with raw honey, lavender botanical essence, and coconut milk.',
    image: 'assets/ambiance.png',
    tags: ['Organic Matcha', 'Antioxidants'],
    calories: '140 kcal',
    origin: 'Uji, Kyoto, Japan'
  }
];

function initMenuExplorer() {
  const container = document.getElementById('menu-grid');
  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function renderMenu() {
    container.innerHTML = '';
    const filtered = MENU_DATA.filter(item => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery) || item.desc.toLowerCase().includes(searchQuery);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No coffee or treats found matching your query.</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass-card menu-card';
      card.innerHTML = `
        <div>
          <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy">
          <div class="menu-card-header">
            <h3 class="menu-card-title">${item.name}</h3>
            <span class="menu-card-price">${item.price}</span>
          </div>
          <p class="menu-card-desc">${item.desc}</p>
          <div class="menu-card-tags">
            ${item.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>
        </div>
        <div class="menu-card-actions">
          <button class="btn-primary" style="flex: 1; padding: 10px 18px; font-size: 0.85rem;" onclick="orderItem('${item.name}')">
            <i class="fas fa-plus"></i> Quick Order
          </button>
          <button class="btn-icon" title="View Tasting Notes" onclick="openItemDetails(${item.id})">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderMenu();
    });
  });

  // Search Input
  const searchInput = document.getElementById('menu-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderMenu();
    });
  }

  renderMenu();
}

window.orderItem = function(name) {
  showToast(`Added 1x ${name} to your table order!`);
};

window.openItemDetails = function(id) {
  const item = MENU_DATA.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('details-modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <img src="${item.image}" style="width:100%; height:220px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
    <h2 style="font-family:var(--font-serif); color:var(--text-primary); margin-bottom:8px;">${item.name}</h2>
    <p style="color:var(--accent-gold); font-size:1.2rem; font-weight:700; margin-bottom:14px;">${item.price}</p>
    <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:20px;">${item.desc}</p>
    
    <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:12px; border:1px solid var(--border-subtle); display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem;">
      <div><strong style="color:var(--text-primary);">Origin:</strong> <br>${item.origin}</div>
      <div><strong style="color:var(--text-primary);">Nutritional:</strong> <br>${item.calories}</div>
    </div>

    <button class="btn-primary" style="width:100%; margin-top:24px;" onclick="orderItem('${item.name}'); closeModal();">
      Confirm Order (${item.price})
    </button>
  `;

  modal.classList.add('active');
};

window.closeModal = function() {
  const modal = document.getElementById('details-modal');
  if (modal) modal.classList.remove('active');
};

/* ==========================================================================
   4. TIME-OF-DAY AMBIANCE THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const themes = ['morning', 'sunset', 'midnight'];
  let currentIdx = 0;

  themeBtn.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % themes.length;
    const newTheme = themes[currentIdx];
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const labels = {
      morning: '☀️ Morning Espresso',
      sunset: '🌅 Sunset Gold',
      midnight: '🌙 Midnight Roast'
    };
    themeBtn.innerHTML = `<i class="fas fa-palette"></i> ${labels[newTheme]}`;
    showToast(`Switched Ambiance Theme to ${labels[newTheme]}`);
  });
}

/* ==========================================================================
   5. WEB AUDIO AMBIENT CAFÉ SOUNDSCAPE
   ========================================================================== */
function initAudioSoundscape() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let rainGain = null;

  function createCaféSoundscape() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // 1. Soft Ambient Rain/Steam Generator (Pink Noise)
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.02;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for warm soft room hum
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    rainGain = audioCtx.createGain();
    rainGain.gain.value = 0.15;

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(audioCtx.destination);

    whiteNoise.start();
  }

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      createCaféSoundscape();
      isPlaying = true;
      audioBtn.classList.add('active');
      audioBtn.innerHTML = `<i class="fas fa-volume-up"></i> Soundscape: ON`;
      showToast('Ambient Jazz & Café Soundscape Active ☕🎶');
    } else if (isPlaying) {
      audioCtx.suspend();
      isPlaying = false;
      audioBtn.classList.remove('active');
      audioBtn.innerHTML = `<i class="fas fa-volume-mute"></i> Soundscape: OFF`;
    } else {
      audioCtx.resume();
      isPlaying = true;
      audioBtn.classList.add('active');
      audioBtn.innerHTML = `<i class="fas fa-volume-up"></i> Soundscape: ON`;
    }
  });
}

/* ==========================================================================
   6. INTERACTIVE TABLE RESERVATION & SEATING MAP
   ========================================================================== */
function initSeatingReservation() {
  const seatsContainer = document.getElementById('seats-grid');
  if (!seatsContainer) return;

  const seats = [
    { id: 'W1', name: 'Sunlit Window', type: 'Window' },
    { id: 'W2', name: 'Sunlit Window', type: 'Window' },
    { id: 'B1', name: 'Barista Counter', type: 'Counter', occupied: true },
    { id: 'B2', name: 'Barista Counter', type: 'Counter' },
    { id: 'L1', name: 'Lounge Nook', type: 'Lounge' },
    { id: 'L2', name: 'Lounge Nook', type: 'Lounge' },
    { id: 'P1', name: 'Patio Terrace', type: 'Patio' },
    { id: 'P2', name: 'Patio Terrace', type: 'Patio' }
  ];

  let selectedSeat = 'W1';

  seats.forEach(s => {
    const seatEl = document.createElement('div');
    seatEl.className = `seat-node ${s.occupied ? 'occupied' : ''} ${s.id === selectedSeat ? 'selected' : ''}`;
    seatEl.innerHTML = `
      <i class="fas ${s.type === 'Window' ? 'fa-sun' : (s.type === 'Counter' ? 'fa-mug-hot' : 'fa-couch')}"></i>
      <span>Table ${s.id}</span>
    `;

    if (!s.occupied) {
      seatEl.addEventListener('click', () => {
        document.querySelectorAll('.seat-node').forEach(n => n.classList.remove('selected'));
        seatEl.classList.add('selected');
        selectedSeat = s.id;
        const displayEl = document.getElementById('selected-seat-display');
        if (displayEl) displayEl.textContent = `${s.name} (Table ${s.id})`;
      });
    }

    seatsContainer.appendChild(seatEl);
  });

  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const guests = document.getElementById('res-guests').value;
      const time = document.getElementById('res-time').value;

      showToast(`Reservation Confirmed for ${name} (${guests} Guests at ${time}) at Table ${selectedSeat}!`);
      resForm.reset();
    });
  }
}

/* ==========================================================================
   7. LIVE HOURS STATUS INDICATOR
   ========================================================================== */
function initLiveHoursStatus() {
  const badge = document.getElementById('live-status-badge');
  if (!badge) return;

  const now = new Date();
  const hour = now.getHours();

  // Café open 07:00 to 22:00
  if (hour >= 7 && hour < 22) {
    const remaining = 22 - hour;
    badge.innerHTML = `<span class="pulse-dot"></span> OPEN NOW • Closes in ${remaining}h`;
    badge.style.borderColor = 'rgba(76, 175, 80, 0.4)';
  } else {
    badge.innerHTML = `<span class="pulse-dot" style="background:#E53935; box-shadow:0 0 10px #E53935;"></span> CLOSED • Opens at 7:00 AM`;
  }
}

/* ==========================================================================
   8. SCROLL TRIGGERED ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.glass-card, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* TOAST UTILITY */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--accent-gold);"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
