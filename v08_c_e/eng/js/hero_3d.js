// 使用Framer Motion實現3D效果和入場動畫

document.addEventListener('DOMContentLoaded', function() {
    // 獲取hero區塊元素
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    // 添加背景元素
    const heroBackground = document.createElement('div');
    heroBackground.classList.add('hero-background');
    heroSection.prepend(heroBackground);
    
    // 添加3D浮動效果
    heroTitle.classList.add('float-3d');
    heroSubtitle.classList.add('float-3d');
    
    // 修改標題內容為2024
    heroTitle.textContent = '2024';
    
    // 滾動視差效果
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollSpeed = 0.5;
        
        // 視差滾動效果
        if (scrollTop < window.innerHeight) {
            const translateY = scrollTop * scrollSpeed;
            const scale = 1 - (scrollTop * 0.0005);
            const opacity = 1 - (scrollTop * 0.002);
            
            heroTitle.style.transform = `translateY(${translateY * 0.4}px) translateZ(0) scale(${scale})`;
            heroSubtitle.style.transform = `translateY(${translateY * 0.6}px) translateZ(0) scale(${scale})`;
            heroTitle.style.opacity = opacity;
            heroSubtitle.style.opacity = opacity;
        }
    });
    
    // 初始化Framer Motion動畫
    function initFramerMotion() {
        if (typeof window.framerMotion !== 'undefined') {
            const { motion, animate } = window.framerMotion;
            
            // 為標題添加入場動畫
            animate(heroTitle, 
                { opacity: [0, 1], y: [50, 0], rotateX: [10, 0] }, 
                { duration: 1.2, ease: 'easeOut' }
            );
            
            // 為副標題添加入場動畫，稍微延遲
            setTimeout(() => {
                animate(heroSubtitle, 
                    { opacity: [0, 1], y: [30, 0], rotateX: [10, 0] }, 
                    { duration: 1, ease: 'easeOut' }
                );
            }, 300);
            
            // 3D傾斜效果 - 滑鼠移動時
            heroSection.addEventListener('mousemove', (e) => {
                const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
                const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
                
                animate(heroTitle, {
                    rotateY: xPos * 0.2,
                    rotateX: -yPos * 0.2,
                    transformPerspective: '1000px'
                }, { duration: 0.5, ease: 'easeOut' });
                
                animate(heroSubtitle, {
                    rotateY: xPos * 0.1,
                    rotateX: -yPos * 0.1,
                    transformPerspective: '1000px'
                }, { duration: 0.5, ease: 'easeOut' });
            });
            
            // 滑鼠離開時恢復原狀
            heroSection.addEventListener('mouseleave', () => {
                animate(heroTitle, {
                    rotateY: 0,
                    rotateX: 0
                }, { duration: 0.7, ease: 'easeOut' });
                
                animate(heroSubtitle, {
                    rotateY: 0,
                    rotateX: 0
                }, { duration: 0.7, ease: 'easeOut' });
            });
        } else {
            // 如果Framer Motion未載入，使用基本動畫
            heroTitle.style.animation = 'fadeInUp 1.2s ease-out forwards';
            heroSubtitle.style.animation = 'fadeInUp 1s ease-out 0.3s forwards';
        }
    }
    
    // 檢查Framer Motion是否已載入
    if (typeof window.framerMotion !== 'undefined') {
        initFramerMotion();
    } else {
        // 等待Framer Motion載入
        window.addEventListener('framerMotionLoaded', initFramerMotion);
    }
});