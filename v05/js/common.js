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

// Three.js 3D background
document.addEventListener('DOMContentLoaded', function() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create building-like objects
    const buildings = [];
    const buildingCount = 50;

    for (let i = 0; i < buildingCount; i++) {
        const height = Math.random() * 5 + 1;
        const width = Math.random() * 0.5 + 0.2;
        const depth = Math.random() * 0.5 + 0.2;

        const geometry = new THREE.BoxGeometry(width, height, depth);

        // Use colors that match our theme
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0x0a192f }),
            new THREE.MeshBasicMaterial({ color: 0x112240 }),
            new THREE.MeshBasicMaterial({ color: 0x64ffda }),
            new THREE.MeshBasicMaterial({ color: 0xd4af37 }),
            new THREE.MeshBasicMaterial({ color: 0x8892b0 }),
            new THREE.MeshBasicMaterial({ color: 0xe6f1ff })
        ];

        const building = new THREE.Mesh(geometry, materials[Math.floor(Math.random() * materials.length)]);

        // Position buildings in a grid-like pattern
        const gridSize = Math.sqrt(buildingCount) * 2;
        building.position.x = (Math.random() - 0.5) * gridSize;
        building.position.y = height / 2 - 2;
        building.position.z = (Math.random() - 0.5) * gridSize - 5;

        scene.add(building);
        buildings.push({
            mesh: building,
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            floatSpeed: Math.random() * 0.005 + 0.001,
            floatDirection: 1,
            floatAmount: 0,
            maxFloatAmount: Math.random() * 0.2 + 0.1
        });
    }

    // Add some lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 10;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate and float buildings
        buildings.forEach(building => {
            building.mesh.rotation.y += building.rotationSpeed;

            building.floatAmount += building.floatSpeed * building.floatDirection;
            if (building.floatAmount > building.maxFloatAmount || building.floatAmount < 0) {
                building.floatDirection *= -1;
            }

            building.mesh.position.y = building.mesh.position.y + building.floatSpeed * building.floatDirection;
        });

        // Rotate entire scene slowly
        scene.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    // Handle window resize
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