window.addEventListener('load', () => {
    window.scrollTo(0, 0);

    

    const dots = document.querySelector('.dots');
    let count = 0;
    const dotsInterval = setInterval(() => {
        count = (count + 1) % 4;
        dots.textContent = '.'.repeat(count);
    }, 500);

    setTimeout(() => {
        const loader = document.getElementById('loading');
        clearInterval(dotsInterval);
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loader.style.display = 'none';
                dots.textContent = '';

                window.scrollTo(0, 0);
            }
        });
    }, 2000);
});
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);

const style = document.createElement('style');
style.textContent = `
      .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid var(--primary);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
          filter: drop-shadow(0 0 6px var(--primary));
          animation: pulse 2s infinite;
      }
      .cursor-dot {
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: all 0.1s ease;
          box-shadow: 0 0 10px var(--primary);
      }
      @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(100, 255, 218, 0); }
          100% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0); }
      }
      a:hover ~ .custom-cursor {
          transform: translate(-50%, -50%) scale(1.5) rotate(45deg);
          border-radius: 2px;
          background: rgba(100, 255, 218, 0.1);
      }
      a:hover ~ .cursor-dot {
          transform: translate(-50%, -50%) scale(2);
          background: var(--primary);
          mix-blend-mode: difference;
      }
      body:hover .custom-cursor,
      body:hover .cursor-dot {
          opacity: 1;
      }
      body .custom-cursor,
      body .cursor-dot {
          opacity: 0;
          transition: opacity 0.3s ease;
      }
      .custom-cursor.clicking {
          transform: translate(-50%, -50%) scale(0.8);
          background: var(--primary);
      }
      .cursor-dot.clicking {
          transform: translate(-50%, -50%) scale(0.5);
      }
  `;
document.head.appendChild(style);


let currentX = 0, currentY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});


function updateCursor() {
    const ease = 0.15;

    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    cursorDot.style.left = targetX + 'px';
    cursorDot.style.top = targetY + 'px';

    requestAnimationFrame(updateCursor);
}
updateCursor();


document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
    cursorDot.classList.add('clicking');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
    cursorDot.classList.remove('clicking');
});


document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
});


document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
});


document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


AOS.init({
    duration: 1000,
    once: true,
    disable: 'mobile'
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);


const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);


const textureLoader = new THREE.TextureLoader();
const earthDayMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
const earthNormalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
const earthSpecularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
const earthCloudsMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_2048.png');
const earthNightMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png');

const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
        dayTexture: { value: earthDayMap },
        nightTexture: { value: earthNightMap },
        normalMap: { value: earthNormalMap },
        specularMap: { value: earthSpecularMap },
        lightDirection: { value: new THREE.Vector3(5, 3, 5).normalize() }
    },
    vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
              vUv = uv;
              vNormal = normalize(normalMatrix * normal);
              vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
    fragmentShader: `
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform sampler2D normalMap;
          uniform sampler2D specularMap;
          uniform vec3 lightDirection;

          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
              vec3 normal = normalize(vNormal);
              float lightIntensity = max(dot(normal, lightDirection), 0.0);
              
              vec4 dayColor = texture2D(dayTexture, vUv);
              vec4 nightColor = texture2D(nightTexture, vUv);
              

              float transition = smoothstep(0.0, 0.3, lightIntensity);
              vec4 color = mix(nightColor, dayColor, transition);
              
              gl_FragColor = color;
          }
      `
});


const earth = new THREE.Mesh(earthGeometry, earthMaterial);


const cloudGeometry = new THREE.SphereGeometry(1.53, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: earthCloudsMap,
    transparent: true,
    opacity: 0.4
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(clouds);

scene.add(earth);


const moonGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');
const moonNormalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_normal_1024.jpg');

const moonMaterial = new THREE.MeshPhongMaterial({
    map: moonTexture,
    normalMap: moonNormalMap,
    normalScale: new THREE.Vector2(0.85, 0.85),
    emissive: 0xffffff,
    emissiveIntensity: 0.15,
    shininess: 15
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);

const moonPivot = new THREE.Object3D();
moonPivot.position.copy(earth.position);
moonPivot.add(moon);
scene.add(moonPivot);


moon.position.set(3, 0, 0);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);


earth.material.uniforms.lightDirection.value.copy(directionalLight.position).normalize();


const backLight = new THREE.DirectionalLight(0x404040, 0.5);
backLight.position.set(-5, 3, -5);
scene.add(backLight);


const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = Math.min(2000, window.innerWidth);
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.008,
    color: 0x64ffda,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 5;


let animationFrameId;
const clock = new THREE.Clock();

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();


    particlesMesh.rotation.y += 0.0005;


    earth.rotation.y += 0.001;
    clouds.rotation.y += 0.0012;


    earth.rotation.x = Math.sin(elapsedTime * 0.5) * 0.02;


    moonPivot.rotation.y += 0.005;
    moon.rotation.y += 0.001;
    moon.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

    renderer.render(scene, camera);
}
animate();

gsap.registerPlugin(ScrollTrigger);


gsap.from('nav', {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
});


const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top center+=100',
            end: 'bottom center',
            scrub: 1,
            onUpdate: (self) => {
                earth.rotation.y = self.progress * Math.PI * 2;
                particlesMesh.rotation.x = self.progress * Math.PI;
                particlesMesh.position.z = (self.progress - 0.5) * 2;
                particlesMesh.position.y = (self.progress - 0.5) * 1;
            }
        }
    });

    tl.from(section, {
        opacity: 0,
        y: 100,
        duration: 1
    })
        .to(section, {
            opacity: 1,
            y: 0,
            duration: 1
        });
});


function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);

window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize);
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    renderer.dispose();
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    earthGeometry.dispose();
    earthMaterial.dispose();
    cloudGeometry.dispose();
    cloudMaterial.dispose();
    earthDayMap.dispose();
    earthNormalMap.dispose();
    earthSpecularMap.dispose();
    earthCloudsMap.dispose();
    earthNightMap.dispose();
    moonGeometry.dispose();
    moonMaterial.dispose();
    moonTexture.dispose();
    moonNormalMap.dispose();
});