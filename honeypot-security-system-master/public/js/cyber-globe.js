/**
 * HONEYPOT SECURITY SYSTEM - 3D CYBER GLOBE & THREAT VISUALIZER
 * Three.js Powered Cyber Deception Grid
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

  // Major global sensor & attack vector hubs (Lat, Long, Name, Type)
  const CYBER_HUBS = [
    { name: "Silicon Valley Sensor (US-WEST)", lat: 37.7749, lon: -122.4194, type: "honeypot", color: 0x38bdf8 },
    { name: "New York Edge Tripwire (US-EAST)", lat: 40.7128, lon: -74.0060, type: "honeypot", color: 0x38bdf8 },
    { name: "London Financial Decoy (UK-LON)", lat: 51.5074, lon: -0.1278, type: "honeypot", color: 0x38bdf8 },
    { name: "Frankfurt DC Vault (EU-CENTRAL)", lat: 50.1109, lon: 8.6821, type: "honeypot", color: 0x38bdf8 },
    { name: "Tokyo Core Decoy (AP-NE)", lat: 35.6762, lon: 139.6503, type: "honeypot", color: 0x38bdf8 },
    { name: "Singapore Gateway (AP-SE)", lat: 1.3521, lon: 103.8198, type: "honeypot", color: 0x38bdf8 },
    { name: "Sydney Deception Node (AU-SE)", lat: -33.8688, lon: 151.2093, type: "honeypot", color: 0x38bdf8 },
    { name: "Sao Paulo Cloud Lure (SA-EAST)", lat: -23.5505, lon: -46.6333, type: "honeypot", color: 0x38bdf8 },
    { name: "Mumbai Enterprise Trap (IN-CENTRAL)", lat: 19.0760, lon: 72.8777, type: "honeypot", color: 0x38bdf8 },
    
    // Attacker Vectors
    { name: "Eastern Recon Cluster", lat: 55.7558, lon: 37.6173, type: "attacker", color: 0xef4444 },
    { name: "Automated Botnet Origin", lat: 39.9042, lon: 116.4074, type: "attacker", color: 0xef4444 },
    { name: "Compromised Hosting Subnet", lat: 52.5200, lon: 13.4050, type: "attacker", color: 0xf59e0b },
    { name: "Tor Exit Node Cluster", lat: 45.4642, lon: 9.1900, type: "attacker", color: 0xf59e0b },
    { name: "Scripting Bot Farm", lat: 31.2304, lon: 121.4737, type: "attacker", color: 0xef4444 },
    { name: "Credential Stuffer Proxy", lat: 34.0522, lon: -118.2437, type: "attacker", color: 0xf59e0b }
  ];

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
    if (!containerElement || !window.THREE) {
      console.warn("CyberGlobe: Container element or Three.js missing.");
      return null;
    }

    const options = Object.assign({
      radius: 120,
      autoRotateSpeed: 0.003,
      particleCount: 1600,
      enableMouseInteraction: true,
      showArcs: true,
      globeColor: 0x0c1a30,
      wireframeColor: 0x1e3a8a,
      dotColor: 0x38bdf8,
      interactiveCallback: null
    }, customOptions);

    let width = containerElement.clientWidth || 600;
    let height = containerElement.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = options.radius * 2.8;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      containerElement.innerHTML = '';
      containerElement.appendChild(renderer.domElement);
    } catch (e) {
      console.error("WebGL initialization failed:", e);
      return null;
    }

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight1.position.set(500, 300, 500);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    dirLight2.position.set(-500, -300, -500);
    scene.add(dirLight2);

    // 3. Globe Root Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Dark Core Sphere
    const coreGeo = new THREE.SphereGeometry(options.radius * 0.98, 36, 36);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x070b14,
      transparent: true,
      opacity: 0.88,
      shininess: 40
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Wireframe Grid
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(options.radius, 24, 24));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x1e3a6a,
      transparent: true,
      opacity: 0.28
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Cyber Latitude / Longitude Rings
    const ringGeo = new THREE.RingGeometry(options.radius * 1.35, options.radius * 1.37, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const radarRing = new THREE.Mesh(ringGeo, ringMat);
    radarRing.rotation.x = Math.PI / 2.3;
    globeGroup.add(radarRing);

    // 4. Dot Matrix Surface Particles
    const dotPositions = [];
    const dotColors = [];
    const colorCyan = new THREE.Color(0x38bdf8);
    const colorBlue = new THREE.Color(0x1d4ed8);
    const colorDim = new THREE.Color(0x0e244d);

    for (let i = 0; i < options.particleCount; i++) {
      const lat = (Math.random() - 0.5) * 180;
      const lon = (Math.random() - 0.5) * 360;
      const pos = latLonToVector3(lat, lon, options.radius * 1.005);
      
      dotPositions.push(pos.x, pos.y, pos.z);

      const r = Math.random();
      const c = r > 0.85 ? colorCyan : r > 0.4 ? colorBlue : colorDim;
      dotColors.push(c.r, c.g, c.b);
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const dotPoints = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotPoints);

    // 5. Sensor Nodes & Attack Markers
    const nodeObjects = [];
    CYBER_HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, options.radius, 2);
      
      // Node core
      const nodeGeo = new THREE.SphereGeometry(hub.type === "honeypot" ? 2.8 : 2.2, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        transparent: true,
        opacity: 0.95
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = hub;
      globeGroup.add(nodeMesh);
      nodeObjects.push(nodeMesh);

      // Node vertical beacon line
      const topPos = latLonToVector3(hub.lat, hub.lon, options.radius, 14);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([pos, topPos]);
      const lineMat = new THREE.LineBasicMaterial({
        color: hub.color,
        transparent: true,
        opacity: 0.6
      });
      const beaconLine = new THREE.Line(lineGeo, lineMat);
      globeGroup.add(beaconLine);

      // Beacon top light
      const beaconLightGeo = new THREE.SphereGeometry(1.2, 8, 8);
      const beaconLightMat = new THREE.MeshBasicMaterial({ color: hub.color });
      const beaconLight = new THREE.Mesh(beaconLightGeo, beaconLightMat);
      beaconLight.position.copy(topPos);
      globeGroup.add(beaconLight);
    });

    // 6. Threat Connection Arcs & Pulse Particles
    const arcCurves = [];
    const travelingParticles = [];

    // Pair attackers to honeypots
    const attackers = CYBER_HUBS.filter(h => h.type === "attacker");
    const honeypots = CYBER_HUBS.filter(h => h.type === "honeypot");

    attackers.forEach((atk, idx) => {
      const targetHp = honeypots[idx % honeypots.length];
      const start = latLonToVector3(atk.lat, atk.lon, options.radius, 2);
      const end = latLonToVector3(targetHp.lat, targetHp.lon, options.radius, 2);

      // Midpoint projected outward
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      mid.normalize().multiplyScalar(options.radius + distance * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      arcCurves.push(curve);

      // Arc Tube/Line
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.45
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // Traveling packet particle
      const packetGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      globeGroup.add(packetMesh);

      travelingParticles.push({
        mesh: packetMesh,
        curve: curve,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.006
      });
    });

    // 7. Mouse Parallax & Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    function onPointerMove(e) {
      const rect = containerElement.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      
      mouseX = ((clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / height) * 2 - 1);

      if (isMouseDown) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        previousMousePosition = { x: clientX, y: clientY };
      }
    }

    function onPointerDown(e) {
      isMouseDown = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      previousMousePosition = { x: clientX, y: clientY };
    }

    function onPointerUp() {
      isMouseDown = false;
    }

    containerElement.addEventListener('mousemove', onPointerMove);
    containerElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    containerElement.addEventListener('touchmove', onPointerMove, { passive: true });
    containerElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 8. Resize Handler
    function onResize() {
      if (!containerElement) return;
      width = containerElement.clientWidth || 600;
      height = containerElement.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // 9. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Auto rotation
      if (!isMouseDown) {
        targetRotationY += options.autoRotateSpeed;
      }

      // Smooth inertia
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.08;

      // Pulse radar ring
      radarRing.rotation.z += 0.008;
      radarRing.material.opacity = 0.15 + Math.sin(time * 3) * 0.08;

      // Animate packet particles
      travelingParticles.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 0;
        const pt = pkt.curve.getPoint(pkt.progress);
        pkt.mesh.position.copy(pt);
      });

      // Subtle breath on node beacons
      const scale = 1 + Math.sin(time * 4) * 0.15;
      nodeObjects.forEach((node) => {
        node.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    }

    animate();

    return {
      destroy: function () {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onResize);
        containerElement.removeEventListener('mousemove', onPointerMove);
        containerElement.removeEventListener('mousedown', onPointerDown);
        window.removeEventListener('mouseup', onPointerUp);
        renderer.dispose();
      },
      rotateToHub: function (index) {
        if (nodeObjects[index]) {
          const hub = nodeObjects[index].userData;
          const phi = (90 - hub.lat) * (Math.PI / 180);
          const theta = (hub.lon + 180) * (Math.PI / 180);
          targetRotationY = -theta + Math.PI;
          targetRotationX = phi - Math.PI / 2;
        }
      }
    };
  }

  return { init, CYBER_HUBS };
}));

