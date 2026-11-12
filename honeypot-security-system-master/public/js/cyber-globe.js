/**
 * HONEYPOT SECURITY SYSTEM - ENTERPRISE 3D SENSOR GLOBE
 * Realistic Procedural Earth + Atmospheric Fresnel + Telemetry Threat Arcs
 * Luxury Cyber Palette: Obsidian #101418, Graphite #171E23, Teal #739F98, Gold #BBA47A, Coral #C77B78
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CyberGlobe = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Major global sensor & attack vector hubs
  const CYBER_HUBS = [
    { name: "Silicon Valley Sensor (US-WEST)", lat: 37.7749, lon: -122.4194, type: "honeypot", region: "North America", color: 0x739F98 },
    { name: "New York Edge Tripwire (US-EAST)", lat: 40.7128, lon: -74.0060, type: "honeypot", region: "North America", color: 0x739F98 },
    { name: "London Financial Decoy (UK-LON)", lat: 51.5074, lon: -0.1278, type: "honeypot", region: "Western Europe", color: 0x739F98 },
    { name: "Frankfurt DC Vault (EU-CENTRAL)", lat: 50.1109, lon: 8.6821, type: "honeypot", region: "Central Europe", color: 0x739F98 },
    { name: "Tokyo Core Decoy (AP-NE)", lat: 35.6762, lon: 139.6503, type: "honeypot", region: "East Asia", color: 0x739F98 },
    { name: "Singapore Gateway (AP-SE)", lat: 1.3521, lon: 103.8198, type: "honeypot", region: "Southeast Asia", color: 0x739F98 },
    { name: "Sydney Deception Node (AU-SE)", lat: -33.8688, lon: 151.2093, type: "honeypot", region: "Oceania", color: 0x739F98 },
    { name: "Sao Paulo Cloud Lure (SA-EAST)", lat: -23.5505, lon: -46.6333, type: "honeypot", region: "South America", color: 0x739F98 },
    { name: "Mumbai Enterprise Trap (IN-CENTRAL)", lat: 19.0760, lon: 72.8777, type: "honeypot", region: "South Asia", color: 0x739F98 },

    // Attacker Vectors (Muted Coral #C77B78 / Champagne Gold #BBA47A)
    { name: "Eastern Recon Cluster", lat: 55.7558, lon: 37.6173, type: "attacker", region: "Eastern Europe", color: 0xC77B78 },
    { name: "Automated Botnet Origin", lat: 39.9042, lon: 116.4074, type: "attacker", region: "East Asia", color: 0xC77B78 },
    { name: "Compromised Hosting Subnet", lat: 52.5200, lon: 13.4050, type: "attacker", region: "Central Europe", color: 0xBBA47A },
    { name: "Tor Exit Node Cluster", lat: 45.4642, lon: 9.1900, type: "attacker", region: "Southern Europe", color: 0xBBA47A },
    { name: "Credential Stuffing Proxy", lat: 37.5665, lon: 126.9780, type: "attacker", region: "Northeast Asia", color: 0xC77B78 },
    { name: "Brute-Force Relay Node", lat: -26.2041, lon: 28.0473, type: "attacker", region: "Southern Africa", color: 0xBBA47A }
  ];

  // Simplified high-accuracy equirectangular continent polygons [lon, lat]
  const WORLD_LANDMASSES = [
    // North America & Central America
    [
      [-166,65],[-162,70],[-150,71],[-141,70],[-130,70],[-120,69],[-110,68],[-95,68],
      [-92,62],[-82,62],[-78,53],[-80,51],[-75,55],[-65,60],[-56,52],[-60,46],[-67,45],
      [-70,42],[-74,40],[-76,35],[-81,31],[-80,25],[-82,28],[-84,30],[-90,29],[-97,26],
      [-97,22],[-90,21],[-87,21],[-88,16],[-83,15],[-83,10],[-78,8],[-80,8],[-85,10],
      [-92,14],[-105,20],[-110,24],[-114,31],[-117,32],[-122,37],[-124,42],[-124,48],
      [-130,54],[-138,59],[-150,60],[-160,56],[-164,60]
    ],
    // Cuba / Caribbean hint
    [[-85,22],[-80,23],[-74,20],[-78,20],[-83,21]],
    // Greenland
    [[-44,60],[-52,64],[-54,70],[-68,76],[-60,81],[-32,83],[-18,81],[-20,74],[-25,68],[-38,65]],
    // South America
    [
      [-78,9],[-74,11],[-70,12],[-62,10],[-52,5],[-49,0],[-35,-6],[-38,-13],[-40,-21],
      [-48,-26],[-53,-34],[-58,-38],[-65,-43],[-68,-52],[-69,-55],[-74,-53],[-74,-43],
      [-72,-35],[-70,-20],[-77,-12],[-81,-5],[-79,2]
    ],
    // Iceland
    [[-24,65],[-18,66.5],[-13.5,65.5],[-16,64],[-22,64]],
    // Great Britain
    [[-5,50],[-3,51],[-5,54],[-5,58],[-2,58],[0,53],[1.7,52.5],[1.3,51],[-1,50.8]],
    // Ireland
    [[-10,52],[-10,54.5],[-6,55.2],[-6,52.2]],
    // Europe, Asia, Middle East, India, Southeast Asia
    [
      [-9,37],[-9,43],[-2,43],[-4,48],[2,51],[8,54],[9,57],[12,56],[11,58],[10,59.5],
      [5,60],[5,63],[12,68],[20,70],[28,71],[32,69],[40,67],[44,66],[58,69],[70,73],
      [90,76],[105,77],[125,73],[145,71],[170,69],[179,66],[168,60],[162,56],[156,51],
      [142,54],[140,48],[135,43],[129,40],[129,35],[126,35],[126,38],[122,40],[120,38],
      [122,37],[120,34],[122,31],[120,27],[114,22],[108,21],[109,13],[105,9],[101,13],
      [100,10],[103,2],[104,1.3],[100,5],[98,10],[96,16],[92,20],[89,22],[85,19],[80,13],
      [78,8],[76,10],[73,19],[69,22],[66,25],[60,25],[56,27],[50,29],[52,25],[59,22],
      [54,17],[45,13],[43,13],[39,21],[34,28],[32.5,31],[35,33],[36,37],[29,37],[26,40],
      [29,41],[24,38],[22,37],[19,40],[14,45],[16,41],[15,38],[12,42],[9,44],[4,43],
      [0,39],[-5,36]
    ],
    // Africa
    [
      [-17,15],[-16,21],[-13,28],[-6,35.8],[3,37],[10,37],[12,33],[20,32],[25,31.5],
      [32.5,31],[34,27],[38,21],[43,12],[51,12],[49,4],[41,-2],[40,-10],[35,-20],
      [33,-26],[28,-33],[18.5,-34.5],[15,-26],[12,-16],[12,-6],[9,4],[2,6],[-8,4.5],[-15,11]
    ],
    // Madagascar
    [[49,-12],[50,-16],[47,-25],[44,-25],[44,-18]],
    // Sri Lanka
    [[80,9.5],[81.8,7.5],[80.5,6],[79.7,7.5]],
    // Japan
    [[130,31],[131,34],[136,35],[140,36],[141,41],[145,44],[141,45],[139,40],[135,36],[130,33]],
    // Taiwan
    [[120.2,22],[120.5,25],[121.9,25],[121.5,22.5]],
    // Philippines
    [[120,14],[120,18.5],[122.3,18],[124,13],[126,8],[123,7],[122,11]],
    // Sumatra
    [[95.5,5.5],[99,3],[104,-2],[105.5,-5.8],[102,-3],[97,1]],
    // Java
    [[105.5,-6.5],[114,-7.8],[114,-8.5],[106,-7.5]],
    // Borneo
    [[109,1],[115,6],[118,5],[118,-3],[111,-3],[109,-1]],
    // New Guinea
    [[131,-2],[141,-2.5],[150,-10],[146,-9],[138,-8],[133,-4]],
    // Australia
    [
      [114,-22],[122,-17],[130,-12],[136,-12],[137,-15],[141,-16],[142.5,-11],
      [146,-18],[153,-26],[151,-34],[147,-38],[140,-38],[135,-34],[129,-32],
      [121,-34],[115,-34],[114,-28]
    ],
    // Tasmania
    [[144.8,-41],[148,-41],[147.5,-43.5],[145.5,-43]],
    // New Zealand (North & South)
    [[172.5,-34.5],[178,-37.5],[176,-41],[173,-41],[174,-37]],
    [[174,-41.5],[171,-44],[167,-46.5],[166.5,-45],[171,-42]],
    // Antarctica
    [
      [-180,-72],[-140,-74],[-100,-72],[-60,-64],[-45,-76],[0,-70],[45,-68],
      [90,-66],[135,-67],[170,-72],[180,-72],[180,-90],[-180,-90]
    ]
  ];

  // Cached procedural Earth textures (shared across instances for speed & memory)
  let cachedTextures = null;

  function lonLatToCanvas(lon, lat, width, height) {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  }

  function traceLandPath(ctx, width, height) {
    ctx.beginPath();
    WORLD_LANDMASSES.forEach(poly => {
      poly.forEach((pt, idx) => {
        const [x, y] = lonLatToCanvas(pt[0], pt[1], width, height);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
    });
  }

  function createEarthTextures() {
    if (cachedTextures) return cachedTextures;

    const w = 2048;
    const h = 1024;

    // 1. DIFFUSE COLOR MAP
    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = w;
    colorCanvas.height = h;
    const ctx = colorCanvas.getContext('2d');

    // Deep realistic bathymetric ocean gradient (Obsidian Black to Deep Graphite)
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0.0, '#0D1115');
    oceanGrad.addColorStop(0.2, '#10161C');
    oceanGrad.addColorStop(0.5, '#141C23');
    oceanGrad.addColorStop(0.8, '#10161C');
    oceanGrad.addColorStop(1.0, '#0D1115');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle ocean bathymetry texture speckles
    for (let i = 0; i < 4500; i++) {
      const rx = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const ry = (Math.sin(i * 78.233) * 19341.123) % 1;
      const x = Math.abs(rx) * w;
      const y = Math.abs(ry) * h;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(115, 159, 152, 0.04)' : 'rgba(16, 20, 24, 0.12)';
      ctx.fillRect(x, y, 3, 2);
    }

    // Subtle Geographic Graticule (15 deg grid in subtle Mutual Teal)
    ctx.lineWidth = 1;
    for (let lon = -180; lon <= 180; lon += 15) {
      const [x] = lonLatToCanvas(lon, 0, w, h);
      ctx.strokeStyle = lon === 0 ? 'rgba(115, 159, 152, 0.22)' : 'rgba(115, 159, 152, 0.08)';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let lat = -75; lat <= 75; lat += 15) {
      const [, y] = lonLatToCanvas(0, lat, w, h);
      ctx.strokeStyle = lat === 0 ? 'rgba(187, 164, 122, 0.25)' : 'rgba(115, 159, 152, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Continental shelf glow along coastlines (Mutual Teal & Champagne Gold)
    ctx.save();
    traceLandPath(ctx, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(115, 159, 152, 0.28)';
    ctx.lineWidth = 16;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(187, 164, 122, 0.22)';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();

    // Landmass fill (Graphite #171E23 to Elevated #222C32 terrain)
    ctx.save();
    traceLandPath(ctx, w, h);
    ctx.clip();

    const landGrad = ctx.createLinearGradient(0, 0, 0, h);
    landGrad.addColorStop(0.0, '#2D3A42');  // Arctic frost tint
    landGrad.addColorStop(0.18, '#1E2830');
    landGrad.addColorStop(0.5, '#171E23');  // Core Graphite
    landGrad.addColorStop(0.82, '#1E2830');
    landGrad.addColorStop(1.0, '#303D46');  // Antarctic frost tint
    ctx.fillStyle = landGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle organic terrain variation inside continents
    for (let i = 0; i < 650; i++) {
      const s1 = Math.abs((Math.sin(i * 41.31) * 9134.12) % 1);
      const s2 = Math.abs((Math.sin(i * 19.77) * 5213.45) % 1);
      const s3 = Math.abs((Math.sin(i * 7.13) * 1412.88) % 1);
      const cx = s1 * w;
      const cy = s2 * h;
      const rad = 14 + s3 * 55;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      if (i % 3 === 0) {
        rg.addColorStop(0, 'rgba(187, 164, 122, 0.12)'); // Champagne Gold highlight
        rg.addColorStop(1, 'rgba(187, 164, 122, 0)');
      } else {
        rg.addColorStop(0, 'rgba(16, 20, 24, 0.25)');    // Obsidian shadow
        rg.addColorStop(1, 'rgba(16, 20, 24, 0)');
      }
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle urban/sensor corridor micro-dots on land around major hubs
    CYBER_HUBS.forEach(hub => {
      const [hx, hy] = lonLatToCanvas(hub.lon, hub.lat, w, h);
      for (let d = 0; d < 22; d++) {
        const ang = (d * 2.39996);
        const dist = Math.sqrt(d) * 7.5;
        const px = hx + Math.cos(ang) * dist;
        const py = hy + Math.sin(ang) * dist * 0.65;
        ctx.fillStyle = hub.type === 'attacker'
          ? 'rgba(199, 123, 120, 0.45)'  // Muted Coral
          : 'rgba(115, 159, 152, 0.50)'; // Mutual Teal
        ctx.beginPath();
        ctx.arc(px, py, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();

    // Crisp coastline outline (Champagne Gold / Teal rim)
    ctx.save();
    traceLandPath(ctx, w, h);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(187, 164, 122, 0.70)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();

    // 2. BUMP / TOPOGRAPHIC RELIEF MAP
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = w;
    bumpCanvas.height = h;
    const bctx = bumpCanvas.getContext('2d');
    bctx.fillStyle = '#080808'; // Flat ocean
    bctx.fillRect(0, 0, w, h);

    bctx.save();
    traceLandPath(bctx, w, h);
    bctx.fillStyle = '#999999'; // Raised continents
    bctx.fill();
    bctx.clip();

    // Mountain / plateau relief patches
    for (let i = 0; i < 420; i++) {
      const s1 = Math.abs((Math.sin(i * 33.17) * 8112.9) % 1);
      const s2 = Math.abs((Math.sin(i * 61.43) * 4321.7) % 1);
      const s3 = Math.abs((Math.sin(i * 11.91) * 2231.5) % 1);
      const cx = s1 * w;
      const cy = s2 * h;
      const rad = 10 + s3 * 36;
      const rg = bctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      rg.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      rg.addColorStop(1, 'rgba(150, 150, 150, 0)');
      bctx.fillStyle = rg;
      bctx.beginPath();
      bctx.arc(cx, cy, rad, 0, Math.PI * 2);
      bctx.fill();
    }
    bctx.restore();

    // 3. SPECULAR MAP (Glossy ocean reflection, matte terrain)
    const specCanvas = document.createElement('canvas');
    specCanvas.width = w;
    specCanvas.height = h;
    const sctx = specCanvas.getContext('2d');
    sctx.fillStyle = '#888888'; // Ocean specular response
    sctx.fillRect(0, 0, w, h);
    traceLandPath(sctx, w, h);
    sctx.fillStyle = '#141414'; // Matte continents
    sctx.fill();

    const colorMap = new THREE.CanvasTexture(colorCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    const specularMap = new THREE.CanvasTexture(specCanvas);

    if (colorMap.anisotropy !== undefined) {
      colorMap.anisotropy = 8;
    }

    cachedTextures = { colorMap, bumpMap, specularMap };
    return cachedTextures;
  }

  function latLonToVector3(lat, lon, radius, alt = 0) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const r = radius + alt;
    return new THREE.Vector3(
      -(r * Math.sin(phi) * Math.cos(theta)),
      (r * Math.cos(phi)),
      (r * Math.sin(phi) * Math.sin(theta))
    );
  }

  function init(containerElement, customOptions = {}) {
    if (!containerElement || !window.THREE) return null;

    const options = Object.assign({
      radius: 120,
      autoRotateSpeed: 0.0018,
      particleCount: 1400,
      globeColor: 0x1F3A5F
    }, customOptions);

    let width = containerElement.clientWidth || 500;
    let height = containerElement.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    camera.position.z = options.radius * 2.85;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      containerElement.innerHTML = '';
      if (getComputedStyle(containerElement).position === 'static') {
        containerElement.style.position = 'relative';
      }
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.cursor = 'grab';
      containerElement.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization:', e);
      return null;
    }

    // Studio & Ambient Rig for realistic spherical shading
    const hemiLight = new THREE.HemisphereLight(0xE9ECEF, 0x101418, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xE9ECEF, 1.4);
    keyLight.position.set(280, 210, 320);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x739F98, 0.85);
    rimLight.position.set(-280, -90, -180);
    scene.add(rimLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Realistic Textured Earth Sphere
    const textures = createEarthTextures();
    const earthGeo = new THREE.SphereGeometry(options.radius, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: textures.colorMap,
      bumpMap: textures.bumpMap,
      bumpScale: 1.6,
      specularMap: textures.specularMap,
      specular: new THREE.Color(0x739F98),
      shininess: 24
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 2. Atmospheric Fresnel Halo Shell (Mutual Teal #739F98 horizon scattering)
    const atmosGeo = new THREE.SphereGeometry(options.radius * 1.055, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec3 vPositionNormal;',
        'void main() {',
        '  vNormal = normalize(normalMatrix * normal);',
        '  vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'varying vec3 vPositionNormal;',
        'void main() {',
        '  float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);',
        '  gl_FragColor = vec4(0.45, 0.62, 0.59, 1.0) * clamp(intensity, 0.0, 0.65);',
        '}'
      ].join('\n'),
      blending: THREE.NormalBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // Subtle inner rim highlight on front face (Champagne Gold / Teal glint)
    const rimGeo = new THREE.SphereGeometry(options.radius * 1.003, 64, 64);
    const rimMat = new THREE.ShaderMaterial({
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
        '  vNormal = normalize(normalMatrix * normal);',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
        '  float rim = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.5);',
        '  gl_FragColor = vec4(0.73, 0.64, 0.48, rim * 0.40);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    scene.add(rimMesh);

    // Subtle Orbital Telemetry Reference Rings (Champagne Gold #BBA47A)
    const orbitGeo = new THREE.RingGeometry(options.radius * 1.24, options.radius * 1.244, 128);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xBBA47A,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 2.25;
    orbitRing.rotation.y = 0.22;
    scene.add(orbitRing);

    // 3. Anchored Surface Hubs & Animated Ripple Rings
    const nodeObjects = [];
    const hitTargets = [];
    const pulseRings = [];

    CYBER_HUBS.forEach((hub) => {
      const surfacePos = latLonToVector3(hub.lat, hub.lon, options.radius, 0.6);
      const pinTopPos = latLonToVector3(hub.lat, hub.lon, options.radius, hub.type === 'attacker' ? 9 : 7);
      const normal = surfacePos.clone().normalize();

      // Surface anchor disc
      const baseGeo = new THREE.CircleGeometry(hub.type === 'attacker' ? 2.2 : 1.9, 20);
      const baseMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.copy(surfacePos);
      baseMesh.lookAt(surfacePos.clone().add(normal));
      globeGroup.add(baseMesh);

      // Animated sonar pulse ring
      const ringGeo = new THREE.RingGeometry(2.2, 3.0, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(surfacePos.clone().addScaledVector(normal, 0.3));
      ringMesh.lookAt(surfacePos.clone().add(normal));
      globeGroup.add(ringMesh);
      pulseRings.push({
        mesh: ringMesh,
        phase: Math.random() * Math.PI * 2,
        speed: hub.type === 'attacker' ? 0.045 : 0.025
      });

      // Vertical telemetry stalk
      const stalkGeo = new THREE.BufferGeometry().setFromPoints([surfacePos, pinTopPos]);
      const stalkMat = new THREE.LineBasicMaterial({
        color: hub.color,
        transparent: true,
        opacity: 0.75
      });
      globeGroup.add(new THREE.Line(stalkGeo, stalkMat));

      // Pin head
      const headGeo = new THREE.SphereGeometry(hub.type === 'honeypot' ? 2.3 : 2.1, 16, 16);
      const headMat = new THREE.MeshPhongMaterial({
        color: hub.color,
        emissive: hub.color,
        emissiveIntensity: 0.35,
        shininess: 60
      });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.copy(pinTopPos);
      headMesh.userData = hub;
      globeGroup.add(headMesh);
      nodeObjects.push(headMesh);

      // Larger invisible hit target for easy hover inspection
      const hitGeo = new THREE.SphereGeometry(6, 10, 10);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(pinTopPos);
      hitMesh.userData = hub;
      globeGroup.add(hitMesh);
      hitTargets.push(hitMesh);
    });

    // 4. Elevated 3D Threat Trajectories + Animated Packet Trails
    const travelingParticles = [];
    const attackers = CYBER_HUBS.filter(h => h.type === 'attacker');
    const honeypots = CYBER_HUBS.filter(h => h.type === 'honeypot');

    // Create realistic multi-region attack vectors
    const trajectoryPairs = [];
    attackers.forEach((atk, idx) => {
      trajectoryPairs.push([atk, honeypots[idx % honeypots.length]]);
      trajectoryPairs.push([atk, honeypots[(idx + 3) % honeypots.length]]);
    });

    trajectoryPairs.forEach(([atk, targetHp], idx) => {
      const start = latLonToVector3(atk.lat, atk.lon, options.radius, 1.5);
      const end = latLonToVector3(targetHp.lat, targetHp.lon, options.radius, 1.5);

      const dist = start.distanceTo(end);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(options.radius + Math.max(18, dist * 0.34));

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(48);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: atk.color,
        transparent: true,
        opacity: 0.32
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));

      // Moving packet head + 4 fading trail beads
      const trailMeshes = [];
      for (let t = 0; t < 5; t++) {
        const size = t === 0 ? 1.85 : Math.max(0.65, 1.55 - t * 0.28);
        const beadGeo = new THREE.SphereGeometry(size, 10, 10);
        const beadMat = new THREE.MeshBasicMaterial({
          color: t === 0 ? 0xFFFFFF : atk.color,
          transparent: true,
          opacity: 1.0 - t * 0.18
        });
        const bead = new THREE.Mesh(beadGeo, beadMat);
        globeGroup.add(bead);
        trailMeshes.push(bead);
      }

      travelingParticles.push({
        beads: trailMeshes,
        curve: curve,
        progress: (idx * 0.17) % 1,
        speed: 0.0045 + (idx % 4) * 0.0012
      });
    });

    // 5. Interactive Hover Tooltip & Subtle Legend Overlay (Graphite & Luxury Theme)
    const tooltip = document.createElement('div');
    tooltip.style.cssText = [
      'position:absolute',
      'pointer-events:none',
      'display:none',
      'z-index:20',
      'background:rgba(23,30,35,0.96)',
      'border:1px solid #28353E',
      'border-radius:6px',
      'padding:8px 10px',
      'box-shadow:0 4px 16px rgba(0,0,0,0.6)',
      'font-family:var(--font-sans, Inter, sans-serif)',
      'font-size:12px',
      'color:#E9ECEF',
      'min-width:190px'
    ].join(';');
    containerElement.appendChild(tooltip);

    const legend = document.createElement('div');
    legend.style.cssText = [
      'position:absolute',
      'bottom:10px',
      'left:14px',
      'right:14px',
      'display:flex',
      'justify-content:space-between',
      'align-items:center',
      'pointer-events:none',
      'z-index:10',
      'font-size:11px',
      'font-family:var(--font-mono, monospace)',
      'color:#929D9D'
    ].join(';');
    legend.innerHTML = [
      '<div style="display:flex;gap:12px;align-items:center;background:rgba(23,30,35,0.92);padding:5px 12px;border-radius:4px;border:1px solid #28353E;">',
      '  <span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:50%;background:#739F98;display:inline-block;"></span>Sensor Node</span>',
      '  <span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:8px;height:8px;border-radius:50%;background:#C77B78;display:inline-block;"></span>Threat Origin</span>',
      '</div>',
      '<div style="background:rgba(23,30,35,0.92);padding:5px 10px;border-radius:4px;border:1px solid #28353E;color:#BBA47A;">Drag to rotate</div>'
    ].join('');
    containerElement.appendChild(legend);

    // Raycaster & Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Start angled so Americas, Atlantic, Europe & Africa are visible on initial load
    let targetRotationX = 0.34;
    let targetRotationY = -0.62;
    globeGroup.rotation.x = targetRotationX;
    globeGroup.rotation.y = targetRotationY;

    let isMouseDown = false;
    let isHovered = false;
    let prevMouse = { x: 0, y: 0 };

    function updateTooltip(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);

      // Only show tooltip for hubs on the front hemisphere facing camera
      const visibleHit = hits.find(h => {
        const worldPos = new THREE.Vector3();
        h.object.getWorldPosition(worldPos);
        return worldPos.z > 0;
      });

      if (visibleHit && !isMouseDown) {
        const hub = visibleHit.object.userData;
        const badgeColor = hub.type === 'attacker' ? '#C77B78' : '#739F98';
        const badgeLabel = hub.type === 'attacker' ? 'THREAT ORIGIN' : 'HONEYPOT SENSOR';
        tooltip.innerHTML =
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">' +
            '<span style="width:7px;height:7px;border-radius:50%;background:' + badgeColor + ';display:inline-block;"></span>' +
            '<span style="font-size:10px;font-weight:700;color:' + badgeColor + ';letter-spacing:0.05em;">' + badgeLabel + '</span>' +
          '</div>' +
          '<div style="font-weight:700;color:#E9ECEF;margin-bottom:2px;">' + hub.name + '</div>' +
          '<div style="font-size:11px;color:#929D9D;font-family:var(--font-mono, monospace);">' +
            hub.region + ' · ' + hub.lat.toFixed(2) + '°, ' + hub.lon.toFixed(2) + '°' +
          '</div>';

        const left = Math.min(rect.width - 210, Math.max(10, e.clientX - rect.left + 14));
        const top = Math.min(rect.height - 80, Math.max(10, e.clientY - rect.top - 16));
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.display = 'block';
        renderer.domElement.style.cursor = 'pointer';
      } else {
        tooltip.style.display = 'none';
        renderer.domElement.style.cursor = isMouseDown ? 'grabbing' : 'grab';
      }
    }

    function onPointerMove(e) {
      if (isMouseDown) {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        targetRotationY += (clientX - prevMouse.x) * 0.0065;
        targetRotationX = Math.max(-1.1, Math.min(1.1, targetRotationX + (clientY - prevMouse.y) * 0.0065));
        prevMouse = { x: clientX, y: clientY };
        tooltip.style.display = 'none';
      } else if (e.clientX !== undefined) {
        updateTooltip(e);
      }
    }

    function onPointerDown(e) {
      isMouseDown = true;
      tooltip.style.display = 'none';
      renderer.domElement.style.cursor = 'grabbing';
      prevMouse = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0
      };
    }

    function onPointerUp() {
      isMouseDown = false;
      renderer.domElement.style.cursor = 'grab';
    }

    function onMouseEnter() { isHovered = true; }
    function onMouseLeave() {
      isHovered = false;
      tooltip.style.display = 'none';
    }

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('mousedown', onPointerDown);
    renderer.domElement.addEventListener('mouseenter', onMouseEnter);
    renderer.domElement.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onPointerUp);

    renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    function onResize() {
      if (!containerElement) return;
      width = containerElement.clientWidth || 500;
      height = containerElement.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      if (!isMouseDown && !isHovered) {
        targetRotationY += options.autoRotateSpeed;
      }

      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.08;

      // Pulse sonar rings on hubs
      pulseRings.forEach(p => {
        p.phase = (p.phase + p.speed) % (Math.PI * 2);
        const t = p.phase / (Math.PI * 2);
        const scale = 1.0 + t * 2.1;
        p.mesh.scale.set(scale, scale, 1);
        p.mesh.material.opacity = (1 - t) * 0.75;
      });

      // Animate packet trails along threat curves
      travelingParticles.forEach(pkt => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 0;

        pkt.beads.forEach((bead, idx) => {
          const p = (pkt.progress - idx * 0.018 + 1) % 1;
          bead.position.copy(pkt.curve.getPoint(p));
        });
      });

      renderer.render(scene, camera);
    }
    animate();

    return {
      destroy: function () {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchend', onPointerUp);
        renderer.dispose();
      },
      rotateToHub: function (index) {
        if (nodeObjects[index]) {
          const hub = nodeObjects[index].userData;
          const theta = (hub.lon + 180) * (Math.PI / 180);
          targetRotationY = -theta + Math.PI / 2;
          targetRotationX = (hub.lat * Math.PI) / 180 * 0.7;
        }
      }
    };
  }

  return { init, CYBER_HUBS };
}));
