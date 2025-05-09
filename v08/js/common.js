// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.95) !important';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.9) !important';
    }
});

// Three.js 流體效果背景
document.addEventListener('DOMContentLoaded', function() {
    // 場景設置
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // 創建流體粒子系統
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // 主題顏色
    const themeColors = [
        new THREE.Color(0x2c3e50),  // 深灰藍色
        new THREE.Color(0x34495e),  // 稍淺灰藍色
        new THREE.Color(0x3498db),  // 科技藍
        new THREE.Color(0xf39c12),  // 暖金色
        new THREE.Color(0x7f8c8d),  // 水泥灰色
        new THREE.Color(0x95a5a6)   // 淺水泥灰色
    ];
    
    // 初始化粒子位置和顏色
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 位置 - 在球體內隨機分佈
        const radius = 15 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);     // x
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);  // y
        positions[i3 + 2] = radius * Math.cos(phi);                    // z
        
        // 顏色 - 從主題顏色中隨機選擇
        const color = themeColors[Math.floor(Math.random() * themeColors.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 粒子材質
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,  // 稍微增大粒子
        vertexColors: true,
        transparent: true,
        opacity: 0.8,  // 增加不透明度
        blending: THREE.AdditiveBlending
    });
    
    // 創建粒子系統
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // 添加連接線
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3498db,  // 科技藍色
        transparent: true,
        opacity: 0.3  // 增加不透明度
    });
    
    const lines = [];
    const maxDistance = 3; // 最大連接距離
    
    // 創建連接線
    function createLines() {
        // 移除現有的線
        lines.forEach(line => scene.remove(line));
        lines.length = 0;
        
        const positions = particles.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const p1 = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            
            for (let j = i + 1; j < particleCount; j++) {
                const j3 = j * 3;
                const p2 = new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2]);
                
                const distance = p1.distanceTo(p2);
                
                if (distance < maxDistance) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    scene.add(line);
                    lines.push(line);
                    
                    // 限制線的數量以提高性能
                    if (lines.length > 300) return;
                }
            }
        }
    }
    
    // 初始創建連接線
    createLines();
    
    // 設置相機位置
    camera.position.z = 20;
    
    // 時間變量用於動畫
    let time = 0;
    
    // 動畫循環
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;
        
        // 更新粒子位置 - 流體波浪效果
        const positions = particles.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // 應用波浪效果
            positions[i3] += Math.sin(time + positions[i3 + 1] * 0.1) * 0.01;
            positions[i3 + 1] += Math.cos(time + positions[i3] * 0.1) * 0.01;
            positions[i3 + 2] += Math.sin(time * 0.5 + positions[i3]) * 0.01;
            
            // 保持粒子在範圍內
            const distance = Math.sqrt(
                positions[i3] * positions[i3] + 
                positions[i3 + 1] * positions[i3 + 1] + 
                positions[i3 + 2] * positions[i3 + 2]
            );
            
            if (distance > 15) {
                positions[i3] *= 0.99;
                positions[i3 + 1] *= 0.99;
                positions[i3 + 2] *= 0.99;
            }
        }
        
        particles.attributes.position.needsUpdate = true;
        
        // 每隔一段時間重新創建連接線
        if (Math.floor(time * 10) % 10 === 0) {
            createLines();
        }
        
        // 緩慢旋轉整個場景
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    // 處理窗口大小變化
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    animate();
});

// Parallax effect for hero section
document.addEventListener('mousemove', function(e) {
    const heroSection = document.querySelector('.hero-section');
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    heroSection.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
});