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
   2. 3D INTERACTIVE DRINK CRAFTING LAB (PHOTOREALISTIC THREE.JS WEBGL ENGINE)
   ========================================================================== */
function initDrinkCustomizerCanvas() {
  const canvas = document.getElementById('customizer-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const container = canvas.parentElement;

  // 1. Scene Setup
  const scene = new THREE.Scene();

  // Camera Setup
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 14, 28);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // 360-Degree Orbit Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 + 0.1;
  controls.minDistance = 14;
  controls.maxDistance = 42;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;

  // Pause auto-rotate when user starts dragging
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.8);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffedd8, 2.2);
  mainLight.position.set(16, 26, 16);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.bias = -0.001;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xd97724, 0.9);
  fillLight.position.set(-16, 10, -16);
  scene.add(fillLight);

  const rimLight = new THREE.SpotLight(0xffe5c4, 3.5);
  rimLight.position.set(0, 22, -22);
  scene.add(rimLight);

  // Materials Setup - Glossy Porcelain & Coaster
  const ceramicMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf5ebe1,
    roughness: 0.12,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.95
  });

  const coasterMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d1714,
    roughness: 0.75,
    metalness: 0.1
  });

  // 3D Ceramic Mug Geometry (Smooth Lathe Curve)
  const points = [];
  points.push(new THREE.Vector2(2.5, 0));
  points.push(new THREE.Vector2(2.7, 0.2));
  points.push(new THREE.Vector2(4.2, 5.0));
  points.push(new THREE.Vector2(4.3, 5.5));
  points.push(new THREE.Vector2(4.1, 5.6));
  points.push(new THREE.Vector2(3.9, 5.4));
  points.push(new THREE.Vector2(3.8, 5.0));
  points.push(new THREE.Vector2(2.3, 0.4));
  points.push(new THREE.Vector2(0.0, 0.4));

  const cupGeometry = new THREE.LatheGeometry(points, 64);
  const cupMesh = new THREE.Mesh(cupGeometry, ceramicMaterial);
  cupMesh.castShadow = true;
  cupMesh.receiveShadow = true;
  scene.add(cupMesh);

  // Ergonomic 3D Handle
  const handleGeo = new THREE.TorusGeometry(1.85, 0.38, 16, 32, Math.PI * 1.1);
  const handleMesh = new THREE.Mesh(handleGeo, ceramicMaterial);
  handleMesh.position.set(4.0, 2.8, 0);
  handleMesh.rotation.z = -Math.PI / 6;
  handleMesh.rotation.y = Math.PI / 2;
  handleMesh.castShadow = true;
  scene.add(handleMesh);

  // Ceramic Saucer Plate
  const saucerPoints = [];
  saucerPoints.push(new THREE.Vector2(0, 0));
  saucerPoints.push(new THREE.Vector2(3.2, 0.1));
  saucerPoints.push(new THREE.Vector2(6.5, 1.0));
  saucerPoints.push(new THREE.Vector2(6.8, 1.2));
  saucerPoints.push(new THREE.Vector2(6.6, 1.25));
  saucerPoints.push(new THREE.Vector2(6.3, 0.9));
  saucerPoints.push(new THREE.Vector2(3.0, 0.05));
  saucerPoints.push(new THREE.Vector2(0, 0.05));
  const saucerGeo = new THREE.LatheGeometry(saucerPoints, 64);
  const saucerMesh = new THREE.Mesh(saucerGeo, ceramicMaterial);
  saucerMesh.position.y = -0.1;
  saucerMesh.castShadow = true;
  saucerMesh.receiveShadow = true;
  scene.add(saucerMesh);

  // Wooden/Slate Coaster Base
  const coasterGeo = new THREE.CylinderGeometry(8.5, 8.8, 0.4, 64);
  const coasterMesh = new THREE.Mesh(coasterGeo, coasterMaterial);
  coasterMesh.position.y = -0.3;
  coasterMesh.receiveShadow = true;
  scene.add(coasterMesh);

  // Dynamic Liquid & Latte Art Texture Generator
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 512;
  textureCanvas.height = 512;
  const texCtx = textureCanvas.getContext('2d');
  const liquidTexture = new THREE.CanvasTexture(textureCanvas);

  const liquidMat = new THREE.MeshStandardMaterial({
    map: liquidTexture,
    roughness: 0.35,
    metalness: 0.05
  });

  const liquidGeo = new THREE.CircleGeometry(3.9, 64);
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.rotation.x = -Math.PI / 2;
  liquidMesh.position.y = 4.8;
  scene.add(liquidMesh);

  // Customizer State
  const state = {
    roast: 'medium',
    base: 'latte',
    art: 'rosetta',
    foamHeight: 0.6,
    sweetness: 2
  };

  function generateLatteTexture() {
    texCtx.clearRect(0, 0, 512, 512);

    const cx = 256, cy = 256, r = 250;

    // Crema Base Color based on Roast
    let cremaBg = '#3D2012';
    if (state.roast === 'light') cremaBg = '#6B3C20';
    if (state.roast === 'dark') cremaBg = '#221008';

    // Outer Crema Gradient
    const grad = texCtx.createRadialGradient(cx, cy, 40, cx, cy, r);
    grad.addColorStop(0, '#F5ECE3');
    grad.addColorStop(0.65, '#E8D6C3');
    grad.addColorStop(0.85, cremaBg);
    grad.addColorStop(1, '#1A0C06');

    texCtx.fillStyle = grad;
    texCtx.beginPath();
    texCtx.arc(cx, cy, r, 0, Math.PI * 2);
    texCtx.fill();

    // Micro-bubbles texture
    texCtx.fillStyle = 'rgba(100, 50, 20, 0.15)';
    for (let i = 0; i < 350; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * (r - 25);
      texCtx.beginPath();
      texCtx.arc(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      texCtx.fill();
    }

    // High detail Latte Art Drawing
    texCtx.save();
    texCtx.translate(cx, cy);
    texCtx.fillStyle = '#4A2511';
    texCtx.strokeStyle = '#4A2511';
    texCtx.lineWidth = 6;
    texCtx.lineCap = 'round';

    if (state.art === 'heart') {
      texCtx.beginPath();
      texCtx.moveTo(0, 40);
      texCtx.bezierCurveTo(-90, -40, -90, -120, 0, -50);
      texCtx.bezierCurveTo(90, -120, 90, -40, 0, 40);
      texCtx.fill();

      texCtx.fillStyle = '#FAF3EB';
      texCtx.beginPath();
      texCtx.moveTo(0, 20);
      texCtx.bezierCurveTo(-60, -30, -60, -80, 0, -35);
      texCtx.bezierCurveTo(60, -80, 60, -30, 0, 20);
      texCtx.fill();
    } else if (state.art === 'rosetta') {
      for (let i = 0; i < 9; i++) {
        const y = -120 + i * 28;
        const w = (9 - i) * 14;
        texCtx.beginPath();
        texCtx.ellipse(0, y, w, w * 0.45, 0, 0, Math.PI * 2);
        texCtx.fill();

        texCtx.fillStyle = '#F5ECE3';
        texCtx.beginPath();
        texCtx.ellipse(0, y, w * 0.7, w * 0.3, 0, 0, Math.PI * 2);
        texCtx.fill();
        texCtx.fillStyle = '#4A2511';
      }
      texCtx.beginPath();
      texCtx.moveTo(0, -140);
      texCtx.lineTo(0, 100);
      texCtx.stroke();
    } else {
      for (let i = 0; i < 4; i++) {
        const y = -90 + i * 45;
        const size = 65 - i * 8;
        texCtx.beginPath();
        texCtx.arc(0, y, size, Math.PI * 0.15, Math.PI * 0.85, true);
        texCtx.fill();
      }
    }
    texCtx.restore();

    liquidTexture.needsUpdate = true;
  }

  generateLatteTexture();

  // Volumetric 3D Steam Particles
  const steamCount = 45;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  const steamSpeeds = [];

  for (let i = 0; i < steamCount; i++) {
    steamPositions[i * 3] = (Math.random() - 0.5) * 3;
    steamPositions[i * 3 + 1] = 5 + Math.random() * 8;
    steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    steamSpeeds.push(Math.random() * 0.04 + 0.02);
  }

  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

  const pMat = new THREE.PointsMaterial({
    color: 0xfff5ea,
    size: 1.4,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });

  const steamParticles = new THREE.Points(steamGeo, pMat);
  scene.add(steamParticles);

  // Event Listeners for Customizer Options
  document.querySelectorAll('[data-opt="base"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-opt="base"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.base = btn.dataset.val;
      generateLatteTexture();
      updateFlavorRadar();
    });
  });

  document.querySelectorAll('[data-opt="roast"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-opt="roast"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.roast = btn.dataset.val;
      generateLatteTexture();
      updateFlavorRadar();
    });
  });

  document.querySelectorAll('[data-opt="art"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-opt="art"]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.art = btn.dataset.val;
      generateLatteTexture();
    });
  });

  const foamSlider = document.getElementById('foam-slider');
  if (foamSlider) {
    foamSlider.addEventListener('input', (e) => {
      state.foamHeight = parseFloat(e.target.value);
      liquidMesh.position.y = 4.2 + state.foamHeight * 0.8;
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

  // Resize Handler
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // Animation Frame Loop
  function animate() {
    requestAnimationFrame(animate);

    // Update 3D Steam Particles
    const positions = steamGeo.attributes.position.array;
    for (let i = 0; i < steamCount; i++) {
      positions[i * 3 + 1] += steamSpeeds[i];
      positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.5) * 0.015;
      if (positions[i * 3 + 1] > 14) {
        positions[i * 3 + 1] = 5.0;
        positions[i * 3] = (Math.random() - 0.5) * 3;
      }
    }
    steamGeo.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
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
