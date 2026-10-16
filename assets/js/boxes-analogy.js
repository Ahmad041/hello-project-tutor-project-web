/**
 * Analogi 3D Kotak Kardus & Bola: Master vs Transaksi (KasirKita)
 *
 * Menggabungkan:
 * 1. Lingkungan 3D WebGL (Three.js) dengan pencahayaan studio, bayangan PCF,
 *    kotak kardus 3D terbuka ber-flap, bola mengilap, animasi lompat parabola 3D,
 *    dan kontrol kamera orbit interaktif layaknya 3D web game.
 * 2. Logika data:
 *    - Master: Kategori, Produk, Pelanggan (JARANG BERUBAH, Master-to-Master diizinkan).
 *    - Transaksi: Penjualan / Nota Kasir (PASTI BERUBAH-UBAH per pembelian).
 * 3. Sinkronisasi dua arah dengan panel HTML (struk nota digital, tombol aksi, dan log).
 */
(function () {
  'use strict';

  // Data Master Paten (Jarang Berubah)
  const MASTER_CATEGORIES = [
    { id: 'K01', name: 'Alat Tulis', icon: '✏️', color: 0xc084fc, hex: '#c084fc' },
    { id: 'K02', name: 'Makanan & Snack', icon: '🍞', color: 0xa855f7, hex: '#a855f7' }
  ];

  const MASTER_PRODUCTS = [
    { id: 'P001', name: 'Buku Tulis A5', categoryId: 'K01', price: 12000, color: 0x38bdf8, hex: '#38bdf8' },
    { id: 'P002', name: 'Pensil 2B', categoryId: 'K01', price: 3000, color: 0x0284c7, hex: '#0284c7' },
    { id: 'P003', name: 'Roti Cokelat', categoryId: 'K02', price: 8000, color: 0x06b6d4, hex: '#06b6d4' }
  ];

  const MASTER_CUSTOMERS = [
    { id: 'C001', name: 'Rani', phone: '0812345678', color: 0x10b981, hex: '#10b981' },
    { id: 'C002', name: 'Pak Budi', phone: '0898765432', color: 0x059669, hex: '#059669' }
  ];

  // Preset simulasi untuk membuktikan "Isi Transaksi Pasti Berubah-Ubah"
  const TRANSACTION_PRESETS = [
    {
      customer: MASTER_CUSTOMERS[0], // Rani
      items: [
        { prod: MASTER_PRODUCTS[0], qty: 2 }, // 2x Buku Tulis
        { prod: MASTER_PRODUCTS[1], qty: 1 }  // 1x Pensil 2B
      ],
      desc: 'Rani membeli 2 Buku Tulis & 1 Pensil 2B'
    },
    {
      customer: MASTER_CUSTOMERS[1], // Pak Budi
      items: [
        { prod: MASTER_PRODUCTS[2], qty: 3 }, // 3x Roti Cokelat
        { prod: MASTER_PRODUCTS[1], qty: 2 }  // 2x Pensil 2B
      ],
      desc: 'Pak Budi membeli 3 Roti Cokelat & 2 Pensil 2B'
    },
    {
      customer: null, // Pelanggan Umum
      items: [
        { prod: MASTER_PRODUCTS[0], qty: 1 }, // 1x Buku Tulis
        { prod: MASTER_PRODUCTS[2], qty: 2 }  // 2x Roti Cokelat
      ],
      desc: 'Pembeli Umum membeli 1 Buku Tulis & 2 Roti Cokelat'
    }
  ];

  // Helper untuk membuat canvas texture teks berkualitas tinggi tanpa terpotong (anti-clipping)
  function makeTextSpriteTexture(text, bgColor = '#0f172a', textColor = '#ffffff', borderColor = '#38bdf8', fontSize = 36) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontStr = `bold ${fontSize}px "Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.font = fontStr;
    const metrics = ctx.measureText(text);
    const textW = Math.ceil(metrics.width);

    // Padding horizontal luas (min 48px tiap sisi) agar teks leluasa dan tidak pernah terpotong
    const padX = Math.round(fontSize * 1.3);
    const canvasW = Math.max(textW + padX * 2, 256);
    const canvasH = Math.round(fontSize * 2.3);

    canvas.width = canvasW;
    canvas.height = canvasH;

    // Reset font setelah merubah ukuran canvas
    ctx.font = fontStr;
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Rounded capsule pill badge
    const r = (canvasH - 8) / 2;
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(r + 4, 4);
    ctx.lineTo(canvasW - r - 4, 4);
    ctx.arcTo(canvasW - 4, 4, canvasW - 4, canvasH - 4, r);
    ctx.arcTo(canvasW - 4, canvasH - 4, canvasW - r - 4, canvasH - 4, r);
    ctx.lineTo(r + 4, canvasH - 4);
    ctx.arcTo(4, canvasH - 4, 4, 4, r);
    ctx.arcTo(4, 4, r + 4, 4, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasW / 2, canvasH / 2 + 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.aspectRatio = canvasW / canvasH;
    return texture;
  }

  // ==========================================================================
  // Kelas Three.js 3D WebGL Experience
  // ==========================================================================
  class Boxes3DExperience {
    constructor(containerEl, api) {
      this.container = containerEl;
      this.api = api;
      this.isAlive = true;
      this.boxes = {};
      this.ballMeshes = [];
      this.projectiles = [];
      this.shockwaves = [];
      this.hoveredBall = null;
      this.mouse = new THREE.Vector2(-999, -999);
      this.raycaster = new THREE.Raycaster();
      this.pointerDownPos = { x: 0, y: 0 };
      this.clock = new THREE.Clock();

      this.initScene();
      this.initBoxes();
      this.initMasterBalls();
      this.initEvents();
      this.animate();
    }

    initScene() {
      const width = this.container.clientWidth || 600;
      const height = this.container.clientHeight || 520;

      // 1. Scene & Background
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf1f5f9);
      this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.022);

      // 2. Camera (Wide FOV and distance to prevent any horizontal edge clipping)
      this.camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
      this.defaultCamPos = new THREE.Vector3(0, 17.5, 26.5);
      this.defaultTarget = new THREE.Vector3(0, 1.2, 0);
      this.camera.position.copy(this.defaultCamPos);
      this.camera.lookAt(this.defaultTarget);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.container.appendChild(this.renderer.domElement);

      // 4. OrbitControls
      if (typeof THREE.OrbitControls === 'function') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06;
        this.controls.maxPolarAngle = Math.PI / 2.14; // Tidak tembus lantai
        this.controls.minDistance = 9;
        this.controls.maxDistance = 42;
        this.controls.target.copy(this.defaultTarget);
      }

      // 5. Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      this.scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfffbf2, 0.95);
      keyLight.position.set(14, 24, 16);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 60;
      keyLight.shadow.camera.left = -16;
      keyLight.shadow.camera.right = 16;
      keyLight.shadow.camera.top = 16;
      keyLight.shadow.camera.bottom = -16;
      keyLight.shadow.bias = -0.0004;
      this.scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.42);
      fillLight.position.set(-14, 12, -10);
      this.scene.add(fillLight);

      // Accent point lights
      this.pointLightCat = new THREE.PointLight(0xa855f7, 0.6, 9);
      this.pointLightCat.position.set(-3.7, 3.5, -3.2);
      this.scene.add(this.pointLightCat);

      this.pointLightTrx = new THREE.PointLight(0xf59e0b, 0.7, 9);
      this.pointLightTrx.position.set(3.7, 3.5, 3.2);
      this.scene.add(this.pointLightTrx);

      // 6. Floor & Grid (Studio Game Atmosphere)
      const floorGeo = new THREE.PlaneGeometry(60, 60);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.88,
        metalness: 0.05
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.receiveShadow = true;
      this.scene.add(floorMesh);

      // Grid dekoratif game
      const grid = new THREE.GridHelper(26, 26, 0x0284c7, 0x94a3b8);
      grid.position.y = 0.01;
      grid.material.opacity = 0.35;
      grid.material.transparent = true;
      this.scene.add(grid);

      // Ring pedestal
      const ringGeo = new THREE.RingGeometry(8.8, 8.88, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.015;
      this.scene.add(ringMesh);

      // Floating Ambient Particles (120 debu kosmik 3D)
      const partCount = 120;
      const partGeo = new THREE.BufferGeometry();
      const partPositions = new Float32Array(partCount * 3);
      for (let i = 0; i < partCount; i++) {
        partPositions[i * 3] = (Math.random() - 0.5) * 26;
        partPositions[i * 3 + 1] = Math.random() * 10 + 0.5;
        partPositions[i * 3 + 2] = (Math.random() - 0.5) * 26;
      }
      partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
      const partMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.16,
        transparent: true,
        opacity: 0.55
      });
      this.particles = new THREE.Points(partGeo, partMat);
      this.scene.add(this.particles);

      // Tooltip HUD
      this.tooltipEl = this.container.querySelector('#hud-3d-tooltip');
    }

    // Bangun 1 Kotak Kardus 3D Terbuka dengan 4 Flap Terlipat ke Luar
    createCardboardBox3D(key, title, stampTag, natureTag, x, z, angleY) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = angleY;

      const w = 5.6; // lebar
      const h = 2.8; // tinggi
      const d = 4.6; // kedalaman
      const t = 0.12; // tebal dinding

      const outerMat = new THREE.MeshStandardMaterial({ color: 0xb87e44, roughness: 0.72, metalness: 0.05 });
      const innerMat = new THREE.MeshStandardMaterial({ color: 0x734217, roughness: 0.85, metalness: 0.02 });
      const flapMat = new THREE.MeshStandardMaterial({ color: 0xa86e34, roughness: 0.75, metalness: 0.05, side: THREE.DoubleSide });

      // Dasar Kotak
      const floorGeo = new THREE.BoxGeometry(w, t, d);
      const floorMesh = new THREE.Mesh(floorGeo, outerMat);
      floorMesh.position.y = t / 2;
      floorMesh.receiveShadow = true;
      group.add(floorMesh);

      // 4 Dinding Tegak
      const backWallGeo = new THREE.BoxGeometry(w, h, t);
      const backWall = new THREE.Mesh(backWallGeo, outerMat);
      backWall.position.set(0, h / 2, -d / 2 + t / 2);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      group.add(backWall);

      const frontWallGeo = new THREE.BoxGeometry(w, h, t);
      const frontWall = new THREE.Mesh(frontWallGeo, outerMat);
      frontWall.position.set(0, h / 2, d / 2 - t / 2);
      frontWall.castShadow = true;
      frontWall.receiveShadow = true;
      group.add(frontWall);

      const leftWallGeo = new THREE.BoxGeometry(t, h, d - 2 * t);
      const leftWall = new THREE.Mesh(leftWallGeo, innerMat);
      leftWall.position.set(-w / 2 + t / 2, h / 2, 0);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      group.add(leftWall);

      const rightWallGeo = new THREE.BoxGeometry(t, h, d - 2 * t);
      const rightWall = new THREE.Mesh(rightWallGeo, innerMat);
      rightWall.position.set(w / 2 - t / 2, h / 2, 0);
      rightWall.castShadow = true;
      rightWall.receiveShadow = true;
      group.add(rightWall);

      // 4 Penutup (Flaps) Terbuka Melipat ke Luar
      const flapLen = 1.25;

      // Front Flap (miring ke depan bawah ~44 derajat)
      const fFlapGeo = new THREE.BoxGeometry(w, 0.06, flapLen);
      fFlapGeo.translate(0, 0, flapLen / 2);
      const fFlap = new THREE.Mesh(fFlapGeo, flapMat);
      fFlap.position.set(0, h, d / 2);
      fFlap.rotation.x = 0.76;
      fFlap.castShadow = true;
      group.add(fFlap);

      // Back Flap (miring ke belakang bawah)
      const bFlapGeo = new THREE.BoxGeometry(w, 0.06, flapLen);
      bFlapGeo.translate(0, 0, -flapLen / 2);
      const bFlap = new THREE.Mesh(bFlapGeo, flapMat);
      bFlap.position.set(0, h, -d / 2);
      bFlap.rotation.x = -0.76;
      bFlap.castShadow = true;
      group.add(bFlap);

      // Left Flap (miring ke kiri bawah)
      const lFlapGeo = new THREE.BoxGeometry(flapLen, 0.06, d);
      lFlapGeo.translate(-flapLen / 2, 0, 0);
      const lFlap = new THREE.Mesh(lFlapGeo, flapMat);
      lFlap.position.set(-w / 2, h, 0);
      lFlap.rotation.z = 0.8;
      lFlap.castShadow = true;
      group.add(lFlap);

      // Right Flap (miring ke kanan bawah)
      const rFlapGeo = new THREE.BoxGeometry(flapLen, 0.06, d);
      rFlapGeo.translate(flapLen / 2, 0, 0);
      const rFlap = new THREE.Mesh(rFlapGeo, flapMat);
      rFlap.position.set(w / 2, h, 0);
      rFlap.rotation.z = -0.8;
      rFlap.castShadow = true;
      group.add(rFlap);

      // Front Decal Label Canvas
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 380;
      labelCanvas.height = 140;
      const lctx = labelCanvas.getContext('2d');
      lctx.fillStyle = key === 'transaction' ? '#78350f' : '#1e293b';
      lctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      lctx.strokeStyle = key === 'transaction' ? '#f59e0b' : '#38bdf8';
      lctx.lineWidth = 6;
      lctx.strokeRect(4, 4, labelCanvas.width - 8, labelCanvas.height - 8);

      // Badge teks
      lctx.fillStyle = key === 'transaction' ? '#d97706' : '#0284c7';
      lctx.fillRect(16, 14, 110, 26);
      lctx.fillStyle = '#ffffff';
      lctx.font = 'bold 16px Sora, sans-serif';
      lctx.fillText(stampTag, 26, 33);

      // Title
      lctx.fillStyle = '#ffffff';
      lctx.font = 'bold 24px Sora, sans-serif';
      lctx.fillText(title, 16, 78);

      // Nature
      lctx.fillStyle = key === 'transaction' ? '#fbbf24' : '#38bdf8';
      lctx.font = 'bold 16px Sora, sans-serif';
      lctx.fillText(`● SIFAT: ${natureTag}`, 16, 114);

      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const labelPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 1.3),
        new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
      );
      labelPlane.position.set(0, h / 2, d / 2 + 0.015);
      group.add(labelPlane);

      // Top Floating Badge Sprite (Anti-clipping dengan aspect ratio dinamis)
      const spriteTex = makeTextSpriteTexture(
        `${stampTag}: ${natureTag}`,
        key === 'transaction' ? 'rgba(180, 83, 9, 0.95)' : 'rgba(14, 116, 144, 0.95)',
        '#ffffff',
        key === 'transaction' ? '#f59e0b' : '#38bdf8',
        36
      );
      const spriteMat = new THREE.SpriteMaterial({
        map: spriteTex,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });
      const topSprite = new THREE.Sprite(spriteMat);
      const spriteH = 0.70;
      const spriteW = spriteH * (spriteTex.aspectRatio || (spriteTex.image.width / spriteTex.image.height));
      topSprite.scale.set(spriteW, spriteH, 1);
      topSprite.position.set(0, h + 1.80, 0);
      topSprite.renderOrder = 99;
      group.add(topSprite);

      this.scene.add(group);
      return { group, innerPos: new THREE.Vector3(x, t + 0.72, z), key, title, natureTag };
    }

    initBoxes() {
      // 4 Kotak Kardus 3D (Tata letak seimbang agar seluruh badge teks terlihat utuh tanpa clipping)
      this.boxes.category = this.createCardboardBox3D('category', '🏷️ KATEGORI', 'MASTER', 'JARANG BERUBAH', -3.7, -3.2, 0.08);
      this.boxes.product = this.createCardboardBox3D('product', '📦 PRODUK', 'MASTER', 'JARANG BERUBAH', 3.7, -3.2, -0.08);
      this.boxes.customer = this.createCardboardBox3D('customer', '👥 PELANGGAN', 'MASTER', 'JARANG BERUBAH', -3.7, 3.2, 0.08);
      this.boxes.transaction = this.createCardboardBox3D('transaction', '🧾 PENJUALAN', 'TRANSAKSI', 'PASTI BERUBAH-UBAH', 3.7, 3.2, -0.08);
    }

    // Bangun Bola 3D Mengilap di Dalam Kotak
    create3DBall(data, boxKey, offset) {
      const r = 0.72;
      const geo = new THREE.SphereGeometry(r, 32, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.12,
        metalness: 0.22,
        emissive: 0x000000
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const basePos = this.boxes[boxKey].innerPos.clone().add(offset);
      mesh.position.copy(basePos);

      // Floating Badge Sprite di atas bola (kode ID, anti-clipping)
      const badgeTex = makeTextSpriteTexture(data.id, 'rgba(15, 23, 42, 0.88)', '#ffffff', data.hex || '#38bdf8', 30);
      const badgeMat = new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });
      const badgeSprite = new THREE.Sprite(badgeMat);
      const bH = 0.42;
      const bW = bH * (badgeTex.aspectRatio || (badgeTex.image.width / badgeTex.image.height));
      badgeSprite.scale.set(bW, bH, 1);
      badgeSprite.position.set(0, r + 0.45, 0);
      badgeSprite.renderOrder = 95;
      mesh.add(badgeSprite);

      mesh.userData = {
        data,
        boxKey,
        baseY: basePos.y,
        basePos: basePos.clone(),
        phase: Math.random() * Math.PI * 2,
        isHovered: false
      };

      this.scene.add(mesh);
      this.ballMeshes.push(mesh);
      return mesh;
    }

    initMasterBalls() {
      // 1. Bola Kategori
      this.create3DBall(MASTER_CATEGORIES[0], 'category', new THREE.Vector3(-1.1, 0, 0));
      this.create3DBall(MASTER_CATEGORIES[1], 'category', new THREE.Vector3(1.1, 0, 0));

      // 2. Bola Produk
      this.create3DBall(MASTER_PRODUCTS[0], 'product', new THREE.Vector3(-1.4, 0, -0.6));
      this.create3DBall(MASTER_PRODUCTS[1], 'product', new THREE.Vector3(0, 0, 0.7));
      this.create3DBall(MASTER_PRODUCTS[2], 'product', new THREE.Vector3(1.4, 0, -0.6));

      // 3. Bola Pelanggan
      this.create3DBall(MASTER_CUSTOMERS[0], 'customer', new THREE.Vector3(-1.1, 0, 0));
      this.create3DBall(MASTER_CUSTOMERS[1], 'customer', new THREE.Vector3(1.1, 0, 0));
    }

    // Refresh isi Bola di Kotak Transaksi Sesuai State Real-time
    updateTransactionBalls(activeCustomer, activeItems) {
      // Bersihkan bola lama di kotak transaksi
      const remaining = [];
      for (const b of this.ballMeshes) {
        if (b.userData.boxKey === 'transaction') {
          this.scene.remove(b);
        } else {
          remaining.push(b);
        }
      }
      this.ballMeshes = remaining;

      const itemsArr = Object.values(activeItems || {});
      const totalCount = (activeCustomer ? 1 : 0) + itemsArr.length;
      if (totalCount === 0) return;

      let idx = 0;
      const spacing = 1.1;
      const startX = -((totalCount - 1) * spacing) / 2;

      // Jika ada customer, buat bola customer di transaksi
      if (activeCustomer) {
        const offset = new THREE.Vector3(startX + idx * spacing, 0, 0);
        this.create3DBall({ ...activeCustomer, color: 0x10b981, hex: '#10b981' }, 'transaction', offset);
        idx++;
      }

      // Bola produk belanja
      itemsArr.forEach(item => {
        const offset = new THREE.Vector3(startX + idx * spacing, 0, (idx % 2 === 0 ? 0.35 : -0.35));
        this.create3DBall({ ...item.prod, id: `${item.prod.id} (x${item.qty})`, color: 0xf59e0b, hex: '#f59e0b' }, 'transaction', offset);
        idx++;
      });
    }

    // Efek Animasi Proyektil Parabola 3D Antar Kotak
    launch3DArc(startPos, endPos, ballData, onComplete) {
      const r = 0.65;
      const geo = new THREE.SphereGeometry(r, 24, 18);
      const mat = new THREE.MeshStandardMaterial({
        color: ballData.color || 0x38bdf8,
        roughness: 0.1,
        metalness: 0.2,
        emissive: ballData.color || 0x38bdf8,
        emissiveIntensity: 0.4
      });
      const projectile = new THREE.Mesh(geo, mat);
      projectile.position.copy(startPos);
      this.scene.add(projectile);

      const p0 = startPos.clone();
      const p1 = endPos.clone();
      const peakHeight = Math.max(p0.y, p1.y) + 5.2;

      const duration = 0.65; // detik
      let elapsed = 0;

      const animEntry = {
        update: (dt) => {
          elapsed += dt;
          const t = Math.min(elapsed / duration, 1);
          // Kurva Bezier Kuadratik
          const currentX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * ((p0.x + p1.x) / 2) + t * t * p1.x;
          const currentZ = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * ((p0.z + p1.z) / 2) + t * t * p1.z;
          const currentY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * peakHeight + t * t * p1.y;
          projectile.position.set(currentX, currentY, currentZ);

          if (t >= 1) {
            this.scene.remove(projectile);
            this.spawnShockwave(p1, ballData.color || 0x38bdf8);
            if (onComplete) onComplete();
            return false; // selesai
          }
          return true;
        }
      };

      this.projectiles.push(animEntry);
    }

    // Efek Gelombang Kejut Cincin Saat Mendarat
    spawnShockwave(pos, color) {
      const ringGeo = new THREE.RingGeometry(0.1, 0.25, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(pos.x, 0.15, pos.z);
      this.scene.add(ring);

      let life = 0;
      this.shockwaves.push({
        update: (dt) => {
          life += dt;
          const progress = life / 0.45;
          ring.scale.set(1 + progress * 7, 1 + progress * 7, 1);
          ring.material.opacity = Math.max(0, 0.9 * (1 - progress));
          if (progress >= 1) {
            this.scene.remove(ring);
            return false;
          }
          return true;
        }
      });
    }

    // Denyut Bouncing pada Kotak Tertentu
    bounceBox(key) {
      const box = this.boxes[key];
      if (!box) return;
      let elapsed = 0;
      const initialScale = box.group.scale.clone();
      const bounceAnim = {
        update: (dt) => {
          elapsed += dt;
          const t = elapsed / 0.4;
          if (t >= 1) {
            box.group.scale.copy(initialScale);
            return false;
          }
          const bounceFactor = 1 + Math.sin(t * Math.PI) * 0.12;
          box.group.scale.set(initialScale.x * bounceFactor, initialScale.y * (2 - bounceFactor), initialScale.z * bounceFactor);
          return true;
        }
      };
      this.projectiles.push(bounceAnim);
    }

    initEvents() {
      const dom = this.renderer.domElement;

      // Pointer Move (Raycasting & Tooltip)
      dom.addEventListener('pointermove', (e) => {
        const rect = dom.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (this.tooltipEl) {
          this.tooltipEl.style.left = `${e.clientX - rect.left}px`;
          this.tooltipEl.style.top = `${e.clientY - rect.top}px`;
        }
      });

      dom.addEventListener('pointerleave', () => {
        this.mouse.set(-999, -999);
        if (this.tooltipEl) this.tooltipEl.style.display = 'none';
        if (this.hoveredBall) {
          this.hoveredBall.material.emissive.setHex(0x000000);
          this.hoveredBall.position.y = this.hoveredBall.userData.baseY;
          this.hoveredBall = null;
        }
      });

      dom.addEventListener('pointerdown', (e) => {
        this.pointerDownPos = { x: e.clientX, y: e.clientY };
      });

      dom.addEventListener('pointerup', (e) => {
        const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
        if (dist > 6) return; // Drag kamera, bukan klik

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.ballMeshes, false);

        if (intersects.length > 0) {
          const ball = intersects[0].object;
          this.handleBallClick(ball);
        }
      });

      // HUD Button Controls
      const resetCamBtn = this.container.querySelector('[data-action="3d-reset-cam"]');
      if (resetCamBtn) {
        resetCamBtn.addEventListener('click', () => {
          this.resetCamera();
        });
      }

      const autoRotateBtn = this.container.querySelector('[data-action="3d-autorotate"]');
      if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
          if (this.controls) {
            this.controls.autoRotate = !this.controls.autoRotate;
            this.controls.autoRotateSpeed = 1.8;
            autoRotateBtn.classList.toggle('active', this.controls.autoRotate);
          }
        });
      }

      const focusTrxBtn = this.container.querySelector('[data-action="3d-focus-trx"]');
      if (focusTrxBtn) {
        focusTrxBtn.addEventListener('click', () => {
          this.focusBox('transaction');
        });
      }

      // Responsive Resize Observer dengan pencegahan loop & runaway height
      this._lastW = 0;
      this._lastH = 0;
      this.resizeObserver = new ResizeObserver((entries) => {
        if (!this.container || !this.renderer || !this.camera) return;
        const entry = entries && entries[0];
        const rawW = entry ? Math.round(entry.contentRect.width) : this.container.clientWidth;
        const rawH = entry ? Math.round(entry.contentRect.height) : this.container.clientHeight;
        const w = Math.max(rawW, 200);
        // Batasi rentang tinggi rasional (300px - 1400px) agar mustahil meledak jutaan pixel
        const h = Math.min(Math.max(rawH, 300), 1400);

        if (Math.abs(w - this._lastW) > 2 || Math.abs(h - this._lastH) > 2) {
          this._lastW = w;
          this._lastH = h;
          this.camera.aspect = w / h;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(w, h, false);
        }
      });
      this.resizeObserver.observe(this.container);
    }

    handleBallClick(ball) {
      const data = ball.userData.data;
      const boxKey = ball.userData.boxKey;

      if (boxKey === 'category') {
        // Master ke Master: Kategori -> Produk
        const start = ball.position.clone();
        const end = this.boxes.product.innerPos.clone();
        this.launch3DArc(start, end, data, () => {
          this.bounceBox('product');
          this.api.onCategoryClick(data);
        });
      } else if (boxKey === 'product') {
        // Master ke Transaksi: Produk -> Transaksi
        const start = ball.position.clone();
        const end = this.boxes.transaction.innerPos.clone();
        this.launch3DArc(start, end, data, () => {
          this.bounceBox('transaction');
          this.api.onProductClick(data);
        });
      } else if (boxKey === 'customer') {
        // Master ke Transaksi: Pelanggan -> Transaksi
        const start = ball.position.clone();
        const end = this.boxes.transaction.innerPos.clone();
        this.launch3DArc(start, end, data, () => {
          this.bounceBox('transaction');
          this.api.onCustomerClick(data);
        });
      } else if (boxKey === 'transaction') {
        // Transaksi tidak bisa mengubah Master
        this.api.onTransactionItemClick(data);
      }
    }

    resetCamera() {
      if (this.controls) {
        this.camera.position.copy(this.defaultCamPos);
        this.controls.target.copy(this.defaultTarget);
        this.controls.update();
      }
    }

    focusBox(key) {
      const box = this.boxes[key];
      if (box && this.controls) {
        this.controls.target.copy(box.innerPos);
        this.camera.position.set(box.innerPos.x + 3.5, box.innerPos.y + 6.5, box.innerPos.z + 8.5);
        this.controls.update();
      }
    }

    animate() {
      if (!this.isAlive) return;
      requestAnimationFrame(() => this.animate());

      const dt = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Update Controls
      if (this.controls) {
        this.controls.update();
      }

      // Idle Bobbing pada Bola
      for (const b of this.ballMeshes) {
        if (!b.userData.isHovered) {
          b.position.y = b.userData.baseY + Math.sin(time * 2.4 + b.userData.phase) * 0.08;
        }
      }

      // Update Animasi Proyektil & Gelombang
      this.projectiles = this.projectiles.filter(p => p.update(dt));
      this.shockwaves = this.shockwaves.filter(s => s.update(dt));

      // Raycasting Hover
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.ballMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (this.hoveredBall !== hit) {
          if (this.hoveredBall) {
            this.hoveredBall.material.emissive.setHex(0x000000);
            this.hoveredBall.position.y = this.hoveredBall.userData.baseY;
            this.hoveredBall.userData.isHovered = false;
          }
          this.hoveredBall = hit;
          hit.userData.isHovered = true;
          hit.material.emissive.setHex(0x38bdf8);
          hit.material.emissiveIntensity = 0.35;
          hit.position.y = hit.userData.baseY + 0.45;

          if (this.tooltipEl) {
            const d = hit.userData.data;
            const bKey = hit.userData.boxKey;
            let label = '';
            let hint = '';

            if (bKey === 'category') {
              label = `🏷️ ${d.id}: ${d.name}`;
              hint = 'Klik untuk relasi Master ke Master (Tautkan ke Kardus Produk)';
            } else if (bKey === 'product') {
              label = `📦 ${d.id}: ${d.name} · Rp${d.price?.toLocaleString('id-ID') || 0}`;
              hint = 'Klik untuk memasukkan item ke Kardus Transaksi!';
            } else if (bKey === 'customer') {
              label = `👤 ${d.id}: ${d.name}`;
              hint = 'Klik untuk memilih pelanggan nota belanja';
            } else {
              label = `🧾 Item Transaksi: ${d.name || d.id}`;
              hint = 'Data ini volatil dan akan berganti tiap belanja!';
            }

            this.tooltipEl.innerHTML = `<div>${label}</div><span class="tt-hint">${hint}</span>`;
            this.tooltipEl.style.display = 'block';
          }
        }
      } else {
        if (this.hoveredBall) {
          this.hoveredBall.material.emissive.setHex(0x000000);
          this.hoveredBall.position.y = this.hoveredBall.userData.baseY;
          this.hoveredBall.userData.isHovered = false;
          this.hoveredBall = null;
        }
        if (this.tooltipEl) this.tooltipEl.style.display = 'none';
      }

      // Render
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ==========================================================================
  // Inisialisasi Simulasi Master & Transaksi
  // ==========================================================================
  function initBoxesSimulation(rootEl) {
    if (!rootEl || rootEl.__boxesInitialized) return;
    rootEl.__boxesInitialized = true;

    // State Transaksi Aktif
    let currentCustomer = null;
    let currentItems = {}; // { 'P001': { prod, qty } }
    let noteCounter = 1;
    let presetIndex = 0;
    let categoryAssignments = {
      'P001': 'K01',
      'P002': 'K01',
      'P003': 'K02'
    };
    let audioCtx = null;
    let scene3D = null;

    // Elemen DOM
    const catCavity = rootEl.querySelector('.cavity-category');
    const prodCavity = rootEl.querySelector('.cavity-product');
    const custCavity = rootEl.querySelector('.cavity-customer');
    const trxCavity = rootEl.querySelector('.cavity-transaction');
    const trxBoxEl = rootEl.querySelector('.box-transaction');
    const receiptEl = rootEl.querySelector('.digital-receipt');
    const feedbackEl = rootEl.querySelector('.boxes-feedback-log');
    const viewport3DEl = rootEl.querySelector('#boxes-3d-viewport');

    // Suara Sintetis (Web Audio API)
    function playTone(freq, type = 'sine', duration = 0.15) {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (_) {}
    }

    function soundDrop() {
      playTone(523.25, 'sine', 0.1);
      setTimeout(() => playTone(659.25, 'sine', 0.12), 60);
    }

    function soundMasterLink() {
      playTone(440, 'triangle', 0.12);
      setTimeout(() => playTone(587.33, 'triangle', 0.14), 70);
      setTimeout(() => playTone(880, 'sine', 0.18), 140);
    }

    function soundChange() {
      [392, 523.25, 659.25, 783.99].forEach((f, i) => {
        setTimeout(() => playTone(f, 'sine', 0.12), i * 50);
      });
    }

    // 1. Render Bola Master Kategori (DOM Sinkron)
    function renderCategoryMaster() {
      if (!catCavity) return;
      catCavity.innerHTML = '';
      MASTER_CATEGORIES.forEach(c => {
        const ball = document.createElement('div');
        ball.className = 'ball-item ball-category';
        ball.setAttribute('data-id', c.id);
        ball.setAttribute('data-type', 'category');
        ball.setAttribute('role', 'button');
        ball.setAttribute('tabindex', '0');
        ball.setAttribute('title', `Klik untuk memasukkan Kategori ${c.id} (${c.name}) ke Kotak Master Barang`);
        ball.innerHTML = `<span class="ball-code">${c.id}</span>`;
        const onActivate = () => linkCategoryToProducts(c, ball);
        ball.addEventListener('click', onActivate);
        ball.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onActivate();
          }
        });
        catCavity.appendChild(ball);
      });
    }

    // 2. Render Bola Master Produk (DOM Sinkron)
    function renderProductMaster() {
      if (!prodCavity) return;
      prodCavity.innerHTML = '';
      MASTER_PRODUCTS.forEach(p => {
        const catId = categoryAssignments[p.id] || p.categoryId;
        const ball = document.createElement('div');
        ball.className = 'ball-item ball-product';
        ball.setAttribute('data-id', p.id);
        ball.setAttribute('data-type', 'product');
        ball.setAttribute('role', 'button');
        ball.setAttribute('tabindex', '0');
        ball.setAttribute('title', `Klik untuk memasukkan ${p.name} ke Kotak Penjualan. Kategori: ${catId}`);
        ball.innerHTML = `
          <span class="ball-code">${p.id}</span>
          <span class="ball-category-pill">${catId}</span>
        `;
        const onActivate = () => addProductToTransaction(p, ball);
        ball.addEventListener('click', onActivate);
        ball.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onActivate();
          }
        });
        prodCavity.appendChild(ball);
      });
    }

    // 3. Render Bola Master Pelanggan (DOM Sinkron)
    function renderCustomerMaster() {
      if (!custCavity) return;
      custCavity.innerHTML = '';
      MASTER_CUSTOMERS.forEach(c => {
        const ball = document.createElement('div');
        ball.className = 'ball-item ball-customer';
        ball.setAttribute('data-id', c.id);
        ball.setAttribute('data-type', 'customer');
        ball.setAttribute('role', 'button');
        ball.setAttribute('tabindex', '0');
        ball.setAttribute('title', `Klik untuk memilih ${c.name} (${c.id})`);
        ball.innerHTML = `<span class="ball-code">${c.id}</span>`;
        const onActivate = () => setCustomerToTransaction(c, ball);
        ball.addEventListener('click', onActivate);
        ball.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onActivate();
          }
        });
        custCavity.appendChild(ball);
      });
    }

    // 4. Render Bola di Kotak Transaksi (DOM Sinkron)
    function renderTransactionCavity() {
      if (!trxCavity) return;
      trxCavity.innerHTML = '';

      const hasItems = Object.keys(currentItems).length > 0;
      const hasCustomer = currentCustomer !== null;

      if (!hasItems && !hasCustomer) {
        trxCavity.className = 'box-cavity-balls empty-zone cavity-transaction';
        trxCavity.innerHTML = `
          <div class="box-empty-hint">
            ⚡ Kardus Transaksi Masih Kosong.<br>Klik bola produk di atas untuk mulai transaksi!
          </div>
        `;
        return;
      }

      trxCavity.className = 'box-cavity-balls cavity-transaction';

      if (hasCustomer) {
        const custBall = document.createElement('div');
        custBall.className = 'ball-item ball-customer';
        custBall.setAttribute('title', `Pelanggan Terpilih: ${currentCustomer.name} (${currentCustomer.id})`);
        custBall.innerHTML = `<span class="ball-code">${currentCustomer.id}</span>`;
        trxCavity.appendChild(custBall);
      }

      for (const pId in currentItems) {
        const item = currentItems[pId];
        const ball = document.createElement('div');
        ball.className = 'ball-item ball-transaction';
        ball.setAttribute('title', `${item.prod.name} x${item.qty}`);
        ball.innerHTML = `
          <span class="ball-code">${item.prod.id}</span>
          <span class="ball-qty-badge">${item.qty}</span>
        `;
        trxCavity.appendChild(ball);
      }

      // Sync ke 3D jika engine aktif
      if (scene3D) {
        scene3D.updateTransactionBalls(currentCustomer, currentItems);
      }
    }

    // Logika 1: Master ke Master
    function linkCategoryToProducts(cat, ballEl) {
      soundMasterLink();
      MASTER_PRODUCTS.forEach(p => {
        categoryAssignments[p.id] = cat.id;
      });
      renderProductMaster();

      if (ballEl) {
        ballEl.classList.remove('anim-jump');
        void ballEl.offsetWidth;
        ballEl.classList.add('anim-jump');
      }

      const catBox = rootEl.querySelector('.box-master-category');
      const prodBox = rootEl.querySelector('.box-master-product');
      if (catBox) {
        catBox.classList.remove('pulse-update');
        void catBox.offsetWidth;
        catBox.classList.add('pulse-update');
      }
      if (prodBox) {
        prodBox.classList.remove('pulse-update');
        void prodBox.offsetWidth;
        prodBox.classList.add('pulse-update');
      }

      setFeedback(
        `<strong>Relasi Master ke Master:</strong> Kategori <code>${cat.id} (${cat.name})</code> berhasil ditautkan ke semua Barang di Kotak Master Produk! ` +
        `Data master ini <em>jarang berubah</em> dan menjadi katalog tetap toko.`,
        'status-ok'
      );
    }

    // Logika 2: Master ke Transaksi (Produk)
    function addProductToTransaction(prod, ballEl) {
      soundDrop();
      if (!currentItems[prod.id]) {
        currentItems[prod.id] = { prod, qty: 1 };
      } else {
        currentItems[prod.id].qty += 1;
      }

      if (ballEl) {
        ballEl.classList.remove('anim-jump');
        void ballEl.offsetWidth;
        ballEl.classList.add('anim-jump');
      }

      renderTransactionCavity();
      renderReceipt();
      if (trxBoxEl) {
        trxBoxEl.classList.remove('pulse-update');
        void trxBoxEl.offsetWidth;
        trxBoxEl.classList.add('pulse-update');
      }

      setFeedback(
        `<strong>Data Ditambahkan ke Transaksi:</strong> 1x ${prod.name} dimasukkan ke Kotak Penjualan. ` +
        `Nota #${String(noteCounter).padStart(3, '0')} kini mencatat kuantitas ${currentItems[prod.id].qty} pcs.`,
        'status-ok'
      );
    }

    // Logika 3: Master ke Transaksi (Pelanggan)
    function setCustomerToTransaction(cust, ballEl) {
      soundDrop();
      currentCustomer = cust;
      if (ballEl) {
        ballEl.classList.remove('anim-jump');
        void ballEl.offsetWidth;
        ballEl.classList.add('anim-jump');
      }
      renderTransactionCavity();
      renderReceipt();
      if (trxBoxEl) {
        trxBoxEl.classList.remove('pulse-update');
        void trxBoxEl.offsetWidth;
        trxBoxEl.classList.add('pulse-update');
      }
      setFeedback(
        `<strong>Pelanggan Ditautkan ke Transaksi:</strong> Nota #${String(noteCounter).padStart(3, '0')} kini atas nama <strong>${cust.name}</strong> (${cust.id}).`,
        'status-ok'
      );
    }

    // Logika 4: Bukti "Isi Transaksi Pasti Berubah-Ubah"
    function nextDynamicTransaction() {
      soundChange();
      const preset = TRANSACTION_PRESETS[presetIndex % TRANSACTION_PRESETS.length];
      presetIndex += 1;
      noteCounter += 1;

      currentCustomer = preset.customer;
      currentItems = {};
      preset.items.forEach(it => {
        currentItems[it.prod.id] = { prod: it.prod, qty: it.qty };
      });

      renderTransactionCavity();
      renderReceipt();

      if (trxBoxEl) {
        trxBoxEl.classList.remove('pulse-update');
        void trxBoxEl.offsetWidth;
        trxBoxEl.classList.add('pulse-update');
      }

      if (scene3D) {
        scene3D.bounceBox('transaction');
        scene3D.updateTransactionBalls(currentCustomer, currentItems);
      }

      setFeedback(
        `<strong>⚡ Transaksi Baru Berubah:</strong> Nota #${String(noteCounter).padStart(3, '0')} berhasil dibuat!<br>` +
        `<em>${preset.desc}</em>. Perhatikan: Isi kotak transaksi berganti total, namun kotak Master (Kategori, Produk, Pelanggan) tetap paten & tidak rusak.`,
        'status-trx-changed'
      );
    }

    // Render Struk Nota Belanja
    function renderReceipt() {
      if (!receiptEl) return;
      const noteNum = `N${String(noteCounter).padStart(3, '0')}`;
      const custName = currentCustomer ? `${currentCustomer.name} (${currentCustomer.id})` : 'Umum (Non-Member)';
      const itemKeys = Object.keys(currentItems);

      let total = 0;
      let rowsHtml = '';

      if (itemKeys.length === 0) {
        rowsHtml = '<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:12px;">(Belum ada barang dibeli)</td></tr>';
      } else {
        itemKeys.forEach(k => {
          const it = currentItems[k];
          const sub = it.prod.price * it.qty;
          total += sub;
          rowsHtml += `
            <tr>
              <td><strong>${it.prod.id}</strong> · ${it.prod.name}</td>
              <td style="text-align:right;">${it.qty}</td>
              <td style="text-align:right;">Rp${it.prod.price.toLocaleString('id-ID')}</td>
              <td style="text-align:right; font-weight:700;">Rp${sub.toLocaleString('id-ID')}</td>
            </tr>
          `;
        });
      }

      receiptEl.innerHTML = `
        <div class="receipt-header">
          <div class="receipt-title">STRUK PENJUALAN KASIRKITA (C17)</div>
          <div class="receipt-meta">
            <span>No. Nota: <strong>${noteNum}</strong></span>
            <span>Pelanggan: <strong>${custName}</strong></span>
          </div>
        </div>
        <table class="receipt-table">
          <thead>
            <tr>
              <th>Item (Dari Master)</th>
              <th style="text-align:right;">Qty</th>
              <th style="text-align:right;">Harga Satuan</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="receipt-total-row">
          <span>TOTAL TRANSAKSI:</span>
          <span>Rp${total.toLocaleString('id-ID')}</span>
        </div>
      `;
    }

    function setFeedback(html, className) {
      if (!feedbackEl) return;
      feedbackEl.className = `boxes-feedback-log ${className}`;
      feedbackEl.innerHTML = `<span>⚡</span> <div>${html}</div>`;
    }

    // Hubungkan Event Listener Tombol-Tombol Panel
    const linkMasterBtn = rootEl.querySelector('[data-action="boxes-link-master"]');
    if (linkMasterBtn) {
      linkMasterBtn.addEventListener('click', () => linkCategoryToProducts(MASTER_CATEGORIES[0]));
    }

    const nextTrxBtn = rootEl.querySelector('[data-action="boxes-next-trx"]');
    if (nextTrxBtn) {
      nextTrxBtn.addEventListener('click', () => nextDynamicTransaction());
    }

    const resetBtn = rootEl.querySelector('[data-action="boxes-reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCustomer = null;
        currentItems = {};
        noteCounter += 1;
        playTone(300, 'sine', 0.15);
        renderTransactionCavity();
        renderReceipt();
        setFeedback(
          `Kardus transaksi dikosongkan. Siap melayani Nota #${String(noteCounter).padStart(3, '0')}! ` +
          `Semua Kardus Master tetap utuh dan tidak terpengaruh.`,
          'status-ok'
        );
      });
    }

    // Tombol aksi HUD 2D
    const pulseAllBtn = rootEl.querySelector('[data-action="2d-pulse-all"]');
    if (pulseAllBtn) {
      pulseAllBtn.addEventListener('click', () => {
        playTone(523.25, 'triangle', 0.2);
        rootEl.querySelectorAll('.cardboard-box-open3d').forEach(box => {
          box.classList.remove('pulse-update');
          void box.offsetWidth;
          box.classList.add('pulse-update');
        });
      });
    }

    const sampleFlowBtn = rootEl.querySelector('[data-action="2d-sample-flow"]');
    if (sampleFlowBtn) {
      sampleFlowBtn.addEventListener('click', () => {
        linkCategoryToProducts(MASTER_CATEGORIES[0]);
        setTimeout(() => addProductToTransaction(MASTER_PRODUCTS[0]), 400);
        setTimeout(() => addProductToTransaction(MASTER_PRODUCTS[1]), 800);
        setTimeout(() => setCustomerToTransaction(MASTER_CUSTOMERS[0]), 1200);
      });
    }

    // Inisialisasi DOM Awal
    renderCategoryMaster();
    renderProductMaster();
    renderCustomerMaster();
    renderTransactionCavity();
    renderReceipt();

    // Inisialisasi Three.js 3D Engine jika Viewport tersedia
    if (viewport3DEl && typeof THREE !== 'undefined') {
      try {
        scene3D = new Boxes3DExperience(viewport3DEl, {
          onCategoryClick: (cat) => linkCategoryToProducts(cat),
          onProductClick: (prod) => addProductToTransaction(prod),
          onCustomerClick: (cust) => setCustomerToTransaction(cust),
          onTransactionItemClick: (item) => {
            setFeedback(`Item <strong>${item.name || item.id}</strong> di Kardus Transaksi adalah catatan pembelian sementara.`, 'status-trx-changed');
          }
        });
      } catch (err) {
        console.warn('Three.js 3D Engine gagal dimuat:', err);
      }
    }
  }

  // Cari semua container analogi di halaman
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.boxes-analogy-container').forEach(initBoxesSimulation);
  });

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.querySelectorAll('.boxes-analogy-container').forEach(initBoxesSimulation);
  }
})();
