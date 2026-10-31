(function () {
  const canvas = document.getElementById('fox');
  if (!canvas) return;

  Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/environments/RoomEnvironment.js')
  ])
    .then(([THREE, { GLTFLoader }, { RoomEnvironment }]) => {
      initFox(canvas, THREE, GLTFLoader, RoomEnvironment);
    })
    .catch((err) => {
      console.error('Failed to load Three.js modules:', err);
    });

  function initFox(canvas, THREE, GLTFLoader, RoomEnvironment) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    const hemiLight = new THREE.HemisphereLight(0xffe2c0, 0x6b3a12, 1.1);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffc98a, 2.2);
    dirLight1.position.set(-3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffa24d, 1.6);
    dirLight2.position.set(3, 2, -3);
    scene.add(dirLight2);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let baseX = 0.05;
    let baseY = 0.05;

    function layout() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      renderer.setSize(width, height, false);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      const mobile = width < 720;
      baseX = mobile ? 0 : 0.05;
      baseY = mobile ? 0.45 : 0.05;
      const s = mobile ? 0.62 : Math.min(1, Math.max(0.75, aspect / 1.78));
      pivot.scale.set(s, s, s);
    }

    const target = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };

    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    });

    window.addEventListener('pointerleave', () => {
      target.x = 0;
      target.y = 0;
    });

    const isFileProtocol = window.location.protocol === 'file:';
    const cdnModelUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261016_125948_52f145de-4509-41e1-9289-523cf0ac9c86.glb';
    const localModelUrl = 'images/fox.glb';

    function onModelLoaded(gltf) {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      model.position.sub(center);

      const holder = new THREE.Group();
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.15 / maxDim;
      holder.scale.set(scale, scale, scale);
      holder.add(model);
      pivot.add(holder);

      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            mat.envMapIntensity = 0.7;
            if (mat.map) {
              mat.map.anisotropy = maxAniso;
            }
          });
        }
      });

      layout();
      canvas.classList.add('is-ready');
    }

    const loader = new GLTFLoader();

    if (isFileProtocol) {
      loader.load(cdnModelUrl, onModelLoaded, undefined, (err) => {
        console.error('Failed to load fox model from CDN:', err);
      });
    } else {
      loader.load(
        localModelUrl,
        onModelLoaded,
        undefined,
        () => {
          loader.load(cdnModelUrl, onModelLoaded, undefined, (err) => {
            console.error('All fox model sources failed:', err);
          });
        }
      );
    }

    window.addEventListener('resize', layout);
    layout();

    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function animate() {
      requestAnimationFrame(animate);

      look.x += (target.x - look.x) * 0.04;
      look.y += (target.y - look.y) * 0.04;

      if (prefersReducedMotion.matches) {
        pivot.position.set(baseX + look.x * 0.06, baseY, 0);
        pivot.rotation.z = 0;
        pivot.rotation.y = look.x * 0.22;
        pivot.rotation.x = look.y * 0.1;
      } else {
        const t = clock.getElapsedTime();
        const bob = Math.sin(t * 2.2) * 0.09;
        pivot.position.set(baseX + look.x * 0.06, baseY + bob, 0);
        pivot.rotation.z = Math.sin(t * 2.2 + 0.6) * 0.025;
        pivot.rotation.y = look.x * 0.22 + Math.sin(t * 0.9) * 0.05;
        pivot.rotation.x = look.y * 0.1 + Math.cos(t * 2.2) * 0.02;
      }

      renderer.render(scene, camera);
    }
    animate();
  }
})();
