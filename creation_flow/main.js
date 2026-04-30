// ============================================================
//  English Creation Flow — main.js
//  Axes:
//    X = Time  (left=Past, right=Future)
//    Y = Reality Degree  (down=Realis, up=Irrealis/Modal)
//    Z = depth (speaker attitude layers)
// ============================================================

// ---------- Scene ----------
const canvas = document.querySelector('#three-canvas');
const scene  = new THREE.Scene();
scene.background = new THREE.Color(0x05020f);
scene.fog = new THREE.FogExp2(0x05020f, 0.008);

const sizes = { width: window.innerWidth, height: window.innerHeight };

// ---------- Camera ----------
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(22, 18, 32);
scene.add(camera);

// ---------- Renderer ----------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

// ---------- OrbitControls ----------
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 4, 0);
controls.update();

// ---------- Lighting ----------
scene.add(new THREE.AmbientLight(0x221133, 1.2));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);
const bluePoint = new THREE.PointLight(0x00f5ff, 2, 40);
bluePoint.position.set(0, 0, 0);
scene.add(bluePoint);
const purplePoint = new THREE.PointLight(0xb44fff, 1.5, 50);
purplePoint.position.set(-8, 12, 0);
scene.add(purplePoint);
const orangePoint = new THREE.PointLight(0xff6b35, 1.5, 50);
orangePoint.position.set(-20, -2, 0);
scene.add(orangePoint);

// ============================================================
//  HELPER — Canvas Sprite Label
// ============================================================
function makeSprite(text, color = '#e8e0ff', size = 48, bgAlpha = 0) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    if (bgAlpha > 0) {
        ctx.fillStyle = `rgba(5,2,15,${bgAlpha})`;
        ctx.roundRect(4, 4, 504, 120, 16);
        ctx.fill();
    }
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Outfit, Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(text, 256, 64);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    return new THREE.Sprite(mat);
}

function makeSprite2(line1, line2, color1 = '#e8e0ff', color2 = '#9080b0') {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 160;
    const ctx = c.getContext('2d');
    ctx.fillStyle = color1;
    ctx.font = `bold 52px Outfit, Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color1;
    ctx.shadowBlur = 14;
    ctx.fillText(line1, 256, 56);
    ctx.fillStyle = color2;
    ctx.font = `300 36px Outfit, Arial`;
    ctx.shadowBlur = 0;
    ctx.fillText(line2, 256, 112);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    return new THREE.Sprite(mat);
}

// ============================================================
//  NODE DATA
// ============================================================
// Each node: { id, label, enLabel, desc, x, y, z, color, radius, tag }
// X-axis: Past(-) <---> Future(+)
// Y-axis: Realis(0) <---> Irrealis(+)
const MODAL_COL  = '#b44fff';
const NOW_COL    = '#00f5ff';
const PAST_COL   = '#ff6b35';
const VERT_COL   = '#7fff7f';
const FUTURE_COL = '#ffe066';

const nodes = [
    // ── MODAL VERTICAL SPACE (above Y=0, near X=0) ──
    { id:'might',  label:'might',       enLabel:'微弱可能性',    desc:'可能性空间最外层。\n"It might rain." — 薄雾中最远的可能。', x:-1,  y:14, z: 2, color:MODAL_COL, radius:0.7,  tag:'Modal 20%' },
    { id:'could',  label:'could',       enLabel:'过去能力/虚拟', desc:'能力或虚拟礼貌。\n"I could help." — 过去式形态=心理疏离。', x:-2,  y:12, z:-2, color:MODAL_COL, radius:0.75, tag:'Modal Past' },
    { id:'may',    label:'may',         enLabel:'许可/不确定',   desc:'允许或不确定。\n"You may go." — 边界开放的探测。', x: 2,  y:11, z: 1, color:MODAL_COL, radius:0.75, tag:'Modal 40%' },
    { id:'can',    label:'can',         enLabel:'能力/条件',     desc:'条件评估。\n"We can make cake." — 可能性的门敞开着。', x: 1,  y: 9, z:-1, color:MODAL_COL, radius:0.9,  tag:'Modal 60%' },
    { id:'should', label:'should',      enLabel:'建议/适宜',     desc:'规范建议。\n"You should try." — 理性推导的结果。', x:-3,  y:10, z: 3, color:MODAL_COL, radius:0.75, tag:'Modal Norm' },
    { id:'must',   label:'must',        enLabel:'必然/义务',     desc:'最强力的情态。\n"You must go." — 所有其他门被锁死。', x: 3,  y:10, z: 4, color:MODAL_COL, radius:0.85, tag:'Modal 95%' },

    // ── MODAL PAST FORMS — vertical above NOW, NOT horizontal past ──
    { id:'would',       label:'would',        enLabel:'意愿/虚拟',   desc:'垂直于Now的上方空间。\n"I would help." — 与现实的距离感，非过去时间。', x: 0,  y:13, z:-5, color:VERT_COL, radius:0.8,  tag:'Modal Past Form ↑' },
    { id:'mighthave',   label:'might have',   enLabel:'反现实过去',  desc:'在过去废墟上建造的城堡。\n"I might have done it." — 虚拟的历史。', x:-6,  y:10, z:-4, color:VERT_COL, radius:0.7,  tag:'Counterfactual ↑' },
    { id:'wouldhave',   label:'would have',   enLabel:'反现实结果',  desc:'条件的推导结果。\n"If I had known, I would have helped." — 平行宇宙的建筑师。', x:-8,  y:12, z:-2, color:VERT_COL, radius:0.75, tag:'Counterfactual ↑' },
    { id:'couldhave',   label:'could have',   enLabel:'反现实能力',  desc:'本可以做到，但没有。\n"I could have won." — 消失的可能。', x:-5,  y:11, z:-6, color:VERT_COL, radius:0.7,  tag:'Counterfactual ↑' },

    // ── NOW BLADE (X=0, Y=0) ──
    { id:'now',    label:'NOW',         enLabel:'坍缩边界 · 观测点', desc:'说话者的当下观测点。\n每一次开口，都是对事件的一次"测量"，迫使它从叠加态落入确定态。', x: 0,  y: 0, z: 0, color:NOW_COL,  radius:1.4,  tag:'Collapse Boundary' },

    // ── PRESENT / REALIS (Y=0, X near 0) ──
    { id:'isdoing', label:'is doing',   enLabel:'进行态·降临', desc:'事件正在穿越边界。\n"We are making a cake." — 从意图拉入现实的绞盘。', x: 3,  y: 0, z: 0, color:NOW_COL,  radius:0.9,  tag:'Present Progressive' },
    { id:'does',    label:'does/make',  enLabel:'习惯现实',    desc:'现在习惯时。\n"She makes cakes." — 当下的恒常状态。', x: 2,  y:-1, z: 3, color:NOW_COL,  radius:0.75, tag:'Present Habitual' },

    // ── FUTURE (X positive) ──
    { id:'will',        label:'will',        enLabel:'意志锚定·未来', desc:'意志介入，从可能中抓取未来。\n"We WILL make a cake." — 创世语令。', x: 6,  y: 5, z: 0, color:FUTURE_COL, radius:1.0, tag:'Will → Future' },
    { id:'gonnado',     label:'be going to', enLabel:'计划中的未来',  desc:'已有迹象的近未来。\n"I\'m going to make cake." — 路已在脚下。', x: 5,  y: 2, z: 2, color:FUTURE_COL, radius:0.8,  tag:'Near Future' },

    // ── PAST DOMAIN (X negative, Y≤0) — crystallized ──
    { id:'made',    label:'made',       enLabel:'完成·历史凝固', desc:'事件完全结晶为历史。\n"We made it." — 不可更改，已成沉积岩。', x:-8,  y:-2, z: 0, color:PAST_COL, radius:1.1,  tag:'Past Realis' },
    { id:'wasdoing',label:'was doing',  enLabel:'过去进行·化石', desc:'过去那一刻正在发生。\n"She was making cake." — 已凝固的进行状态。', x:-6,  y:-1, z: 2, color:PAST_COL, radius:0.8,  tag:'Past Progressive' },
    { id:'haddone', label:'had made',   enLabel:'过去完成·深层', desc:'过去中更早的过去。\n"She had made it before he arrived." — 更深的历史地层。', x:-14, y:-4, z: 0, color:PAST_COL, radius:0.9,  tag:'Past Perfect' },
    { id:'hasdonenow', label:'have made', enLabel:'现在完成·跨域桥梁', desc:'Have系统：用过去动作在当下留下印记。\n"We have made it." — 历史与现在的桥梁。', x:-4,  y: 1, z:-3, color:'#ff9f1c', radius:0.85, tag:'Present Perfect' },
];

// ============================================================
//  BUILD SCENE GEOMETRY
// ============================================================

const nodeMeshes = [];
const raycaster  = new THREE.Raycaster();
const mouse      = new THREE.Vector2();
let   hoveredNode = null;

// — Glow sphere helper —
function makeSphere(r, color, glow = true) {
    const geo = new THREE.SphereGeometry(r, 32, 32);
    const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: glow ? 0.6 : 0.15,
        shininess: 120,
        transparent: true,
        opacity: 0.92,
    });
    return new THREE.Mesh(geo, mat);
}

// Place node spheres
nodes.forEach(n => {
    const mesh = makeSphere(n.radius, n.color);
    mesh.position.set(n.x, n.y, n.z);
    mesh.userData = n;
    scene.add(mesh);
    nodeMeshes.push(mesh);

    // Floating label
    const sp = makeSprite2(n.label, n.tag, n.color, 'rgba(200,190,220,0.7)');
    sp.position.set(n.x, n.y + n.radius + 1.4, n.z);
    sp.scale.set(7, 2.2, 1);
    scene.add(sp);
});

// ============================================================
//  NOW BLADE — glowing plane
// ============================================================
{
    const geo = new THREE.PlaneGeometry(0.08, 28);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const blade = new THREE.Mesh(geo, mat);
    blade.rotation.z = Math.PI / 2;
    blade.position.set(0, 4, 0);
    scene.add(blade);

    // Glow outline
    const edgeGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(28, 28));
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.5 });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.rotation.y = Math.PI / 2;
    edges.position.set(0, 4, 0);
    scene.add(edges);

    // Label
    const sp = makeSprite('NOW ·  坍缩边界', '#00f5ff', 52);
    sp.position.set(0, -2.8, 0);
    sp.scale.set(12, 3, 1);
    scene.add(sp);
}

// ============================================================
//  MODAL CLOUD — particle haze above NOW
// ============================================================
{
    const count = 800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i*3]   = (Math.random() - 0.5) * 22 - 2;
        pos[i*3+1] = Math.random() * 16 + 3;
        pos[i*3+2] = (Math.random() - 0.5) * 16;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.12, color: 0xb44fff, transparent: true, opacity: 0.35, depthWrite: false });
    scene.add(new THREE.Points(geo, mat));
}

// ============================================================
//  PAST DOMAIN — crystalline shard "floor"
// ============================================================
{
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i*3]   = -(Math.random() * 22 + 2);
        pos[i*3+1] = -(Math.random() * 8);
        pos[i*3+2] = (Math.random() - 0.5) * 18;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.1, color: 0xff6b35, transparent: true, opacity: 0.3, depthWrite: false });
    scene.add(new THREE.Points(geo, mat));
}

// ============================================================
//  AXIS LINES
// ============================================================
function makeLine(points, color, opacity = 1) {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
    return new THREE.Line(geo, mat);
}

// X axis (time)
scene.add(makeLine([new THREE.Vector3(-20, 0, 0), new THREE.Vector3(14, 0, 0)], 0x444466, 0.7));
// Y axis (reality degree)
scene.add(makeLine([new THREE.Vector3(0, -8, 0), new THREE.Vector3(0, 18, 0)], 0x445544, 0.7));

// Axis labels
const xLabel = makeSprite('← Past · Time · Future →', '#555577', 36);
xLabel.position.set(-3, -1.4, 0); xLabel.scale.set(16, 2.5, 1);
scene.add(xLabel);

const yLabelTop = makeSprite('↑ Irrealis / 未坍缩', '#7733aa', 36);
yLabelTop.position.set(-6, 17, 0); yLabelTop.scale.set(12, 2.5, 1);
scene.add(yLabelTop);

const yLabelBot = makeSprite('↓ Realis / 已坍缩', '#aa4411', 36);
yLabelBot.position.set(-6, -7, 0); yLabelBot.scale.set(11, 2.5, 1);
scene.add(yLabelBot);

// Gradient collapse arrow (NOW → past)
{
    const pts = [];
    for (let i = 0; i <= 12; i++) pts.push(new THREE.Vector3(-i * 1.2, -i * 0.15, 0));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Line(geo, mat));
}

// ============================================================
//  COLLAPSE GRADIENT CONNECTIONS (modal → NOW)
// ============================================================
const collapseFlow = ['might','can','will','isdoing','now'];
for (let i = 0; i < collapseFlow.length - 1; i++) {
    const a = nodes.find(n => n.id === collapseFlow[i]);
    const b = nodes.find(n => n.id === collapseFlow[i+1]);
    if (!a || !b) continue;
    const pts = [new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(b.x, b.y, b.z)];
    const col = i === 0 ? 0x7722bb : i < 3 ? 0x5599ff : 0x00f5ff;
    scene.add(makeLine(pts, col, 0.45));
}

// Counterfactual connections (vertical modal past forms)
['mighthave','wouldhave','couldhave'].forEach(id => {
    const n = nodes.find(x => x.id === id);
    const now = nodes.find(x => x.id === 'now');
    if (!n || !now) return;
    const pts = [new THREE.Vector3(n.x, n.y, n.z), new THREE.Vector3(0, 8, 0)];
    scene.add(makeLine(pts, 0x7fff7f, 0.3));
});

// ============================================================
//  BACKGROUND STARS
// ============================================================
{
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 300;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.06, color: 0xffffff, transparent: true, opacity: 0.15, depthWrite: false });
    scene.add(new THREE.Points(geo, mat));
}

// ============================================================
//  NODE CARD (floating tooltip)
// ============================================================
const card = document.createElement('div');
card.id = 'node-card';
card.innerHTML = `
    <div class="card-tag"></div>
    <div class="card-title"></div>
    <div class="card-en"></div>
    <div class="card-desc"></div>
`;
document.body.appendChild(card);

function showCard(node, x, y) {
    card.querySelector('.card-tag').textContent   = node.tag;
    card.querySelector('.card-title').textContent = node.label;
    card.querySelector('.card-en').textContent    = node.enLabel;
    card.querySelector('.card-desc').textContent  = node.desc;
    card.querySelector('.card-tag').style.color   = node.color;
    card.style.left = (x + 16) + 'px';
    card.style.top  = (y - 60) + 'px';
    card.classList.add('visible');
    document.getElementById('hover-text').textContent = node.label + ' → ' + node.enLabel;
    document.getElementById('info-panel').classList.add('highlighted');
}

function hideCard() {
    card.classList.remove('visible');
    document.getElementById('hover-text').textContent = '将鼠标悬停在节点上查看详情';
    document.getElementById('info-panel').classList.remove('highlighted');
}

// ============================================================
//  RAYCASTING — hover
// ============================================================
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    mouse.x = (e.clientX / sizes.width)  * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

// ============================================================
//  FLOW STEPS — camera presets
// ============================================================
const flowSteps = [
    // 0 混沌
    { pos: [2, 20, 36],  target: [0, 10, 0],  info: '① 混沌 — 情态空间 (Irrealis)\n所有事件悬浮在可能性中，尚未获得"存在资格"。might / could / may …' },
    // 1 可能性评估
    { pos: [-2, 14, 28], target: [0, 9, 0],   info: '② 评估可行性 — can / may / must\n说话者作为观察者，检视可能性空间。"We CAN make cake!" — 门开着。' },
    // 2 意志锚定
    { pos: [8, 10, 22],  target: [4, 4, 0],   info: '③ 意志锚定 — will / be going to\n说话者意志介入，抓取一个可能未来，锚定到时间表。"We WILL!" — 创世语令。' },
    // 3 降临现实
    { pos: [6, 4, 20],   target: [2, 0, 0],   info: '④ 降临现实 — is doing / NOW\n事件正在穿过坍缩边界。身体已动，物质已变。"We ARE making it."' },
    // 4 历史凝固
    { pos: [-14, 4, 22], target: [-8, -2, 0], info: '⑤ 历史凝固 — made / had made\n事件结晶为沉积岩。"We made it." — 不可更改的历史地层。' },
    // 5 全景
    { pos: [22, 18, 38], target: [0, 4, 0],   info: '全景 — 英语创世流程\n混沌情态 → 意志坍缩 → 现实降临 → 历史凝固。每一句话都是一次创世。' },
];

let currentStep = 0;
const lerpSpeed = 0.04;
let targetCamPos    = new THREE.Vector3(...flowSteps[0].pos);
let targetCamTarget = new THREE.Vector3(...flowSteps[0].target);

document.querySelectorAll('.flow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step);
        currentStep = step;
        document.querySelectorAll('.flow-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        targetCamPos.set(...flowSteps[step].pos);
        targetCamTarget.set(...flowSteps[step].target);
        document.getElementById('hover-text').textContent = flowSteps[step].info;
        document.getElementById('info-panel').classList.add('highlighted');
    });
});

// ============================================================
//  ANIMATION LOOP
// ============================================================
const clock = new THREE.Clock();

const tick = () => {
    const t = clock.getElapsedTime();

    // Animate nodeMeshes
    nodeMeshes.forEach((mesh, i) => {
        const n = mesh.userData;
        // gentle float
        mesh.position.y = n.y + Math.sin(t * 0.6 + i * 0.8) * 0.25;
        // pulse emissive for NOW node
        if (n.id === 'now') {
            mesh.material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.3;
        }
        // highlight on hover
        if (hoveredNode === n.id) {
            mesh.material.emissiveIntensity = 1.2;
            mesh.scale.setScalar(1.1 + Math.sin(t * 4) * 0.05);
        } else if (n.id !== 'now') {
            mesh.material.emissiveIntensity = 0.6;
            mesh.scale.setScalar(1.0);
        }
    });

    // Smooth camera lerp
    camera.position.lerp(targetCamPos, lerpSpeed);
    controls.target.lerp(targetCamTarget, lerpSpeed);

    // Raycasting hover
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(nodeMeshes);
    if (hits.length > 0) {
        const hit = hits[0].object;
        hoveredNode = hit.userData.id;
        document.body.style.cursor = 'pointer';
        showCard(hit.userData, mouseX, mouseY);
    } else {
        if (hoveredNode) hideCard();
        hoveredNode = null;
        document.body.style.cursor = 'default';
    }

    // Twinkle blue point
    bluePoint.intensity = 1.5 + Math.sin(t * 1.5) * 0.5;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();

// ---------- Resize ----------
window.addEventListener('resize', () => {
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});
