// --- Scene Setup ---
const canvas = document.querySelector('#three-canvas');
const scene = new THREE.Scene();

// 1. Infinite Cosmic Background
scene.background = new THREE.Color(0x020205);
scene.fog = new THREE.FogExp2(0x020205, 0.015);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// --- Camera ---
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
camera.position.set(0, 15, 35);
scene.add(camera);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

// --- Controls ---
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.1;

// --- Infinite Quadrant Shader Ground ---

// Shader logic: Color based on X and Z coordinates
const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`;

const fragmentShader = `
    varying vec3 vWorldPosition;
    
    void main() {
        vec3 color = vec3(0.02, 0.02, 0.05); // Base background
        float x = vWorldPosition.x;
        float z = vWorldPosition.z;
        
        // Define Quadrant Colors
        vec3 q2Color = vec3(0.0, 0.95, 1.0); // Realis: Cyan/Blue
        vec3 q1Color = vec3(1.0, 0.13, 0.13); // Future Realis: Red
        vec3 q3Color = vec3(0.44, 0.0, 1.0); // Irrealis: Purple
        vec3 q4Color = vec3(0.13, 1.0, 0.13); // Action: Green
        
        // Transition softness
        float edge = 1.0; 
        
        // Determine Quadrant and apply color with smooth transition at axes
        if (x < 0.0 && z < 0.0) color = q2Color; // Q2
        else if (x > 0.0 && z < 0.0) color = q1Color; // Q1
        else if (x < 0.0 && z > 0.0) color = q3Color; // Q3
        else if (x > 0.0 && z > 0.0) color = q4Color; // Q4

        // Add grid logic directly into shader for performance and infinite scale
        float gridSize = 5.0;
        float gridWidth = 0.05;
        float gridX = abs(fract(x / gridSize - 0.5) - 0.5) / (gridWidth / gridSize);
        float gridZ = abs(fract(z / gridSize - 0.5) - 0.5) / (gridWidth / gridSize);
        float grid = 1.0 - min(gridX, gridZ);
        grid = clamp(grid, 0.0, 1.0);
        
        vec3 finalColor = mix(color * 0.1, color, grid * 0.2);
        
        // Fade out at center axes for cleaner look
        float axisX = smoothstep(0.0, 0.5, abs(x));
        float axisZ = smoothstep(0.0, 0.5, abs(z));
        finalColor *= (axisX * axisZ * 0.8 + 0.2);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

const groundGeo = new THREE.PlaneGeometry(2000, 2000); // Massive size
const groundMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// --- Quadrant Labels (Floating Sprites) ---

const createLabel = (x, z, text) => {
    const canvasLabel = document.createElement('canvas');
    const ctx = canvasLabel.getContext('2d');
    canvasLabel.width = 512;
    canvasLabel.height = 256;
    ctx.fillStyle = 'white';
    ctx.font = 'Bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.fillText(text, 256, 128);
    
    const texture = new THREE.CanvasTexture(canvasLabel);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, 4, z);
    sprite.scale.set(16, 8, 1);
    scene.add(sprite);
};

createLabel(-25, -25, "Q2: REALIS");
createLabel(25, -25, "Q1: FUTURE REALIS");
createLabel(-25, 25, "Q3: IRREALIS");
createLabel(25, 25, "Q4: ACTION");

// --- Atmospheric Effects ---

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// --- Animation & Resize ---
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.02;
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
