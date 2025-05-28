document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('building-container');
  if (!container) return;
  
  // 創建建築動畫元素
  const buildingDiv = document.createElement('div');
  buildingDiv.className = 'building';
  container.appendChild(buildingDiv);
  
  // 創建藍圖背景
  const blueprint = document.createElement('div');
  blueprint.className = 'blueprint';
  buildingDiv.appendChild(blueprint);
  
  // 添加藍圖線條
  for (let i = 0; i < 40; i++) {
    const line = document.createElement('div');
    line.className = 'blueprint-line';
    blueprint.appendChild(line);
  }
  
  // 創建建築文字
  const texts = ['建造', '香港', '未來'];
  texts.forEach((text, index) => {
    const textDiv = document.createElement('div');
    textDiv.className = 'building-text';
    textDiv.textContent = text;
    textDiv.style.top = `${30 + index * 30}%`;
    buildingDiv.appendChild(textDiv);
  });
  
  // 創建建築方塊
  const blockCount = 12;
  for (let i = 0; i < blockCount; i++) {
    const block = document.createElement('div');
    block.className = 'building-block';
    block.style.width = `${Math.random() * 100 + 50}px`;
    block.style.height = `${Math.random() * 100 + 50}px`;
    block.style.opacity = 0;
    buildingDiv.appendChild(block);
  }
  
  // 創建起重機
  const crane = document.createElement('div');
  crane.className = 'crane';
  
  const craneBase = document.createElement('div');
  craneBase.className = 'crane-base';
  crane.appendChild(craneBase);
  
  const craneArm = document.createElement('div');
  craneArm.className = 'crane-arm';
  crane.appendChild(craneArm);
  
  const craneCable = document.createElement('div');
  craneCable.className = 'crane-cable';
  craneArm.appendChild(craneCable);
  
  const craneHook = document.createElement('div');
  craneHook.className = 'crane-hook';
  craneCable.appendChild(craneHook);
  
  buildingDiv.appendChild(crane);
  
  // 使用 GSAP 創建動畫
  const tl = gsap.timeline({repeat: -1, repeatDelay: 1});
  
  // 藍圖動畫
  tl.to(blueprint, {duration: 1, opacity: 1})
    .to('.blueprint-line', {
      duration: 1.5, 
      opacity: 1, 
      scale: 1, 
      stagger: 0.03,
      ease: "power1.inOut"
    })
    .to(crane, {duration: 1, opacity: 1, x: -150}, "-=1")
    .to(craneArm, {duration: 2, rotation: -20, transformOrigin: "left center", repeat: 3, yoyo: true}, "-=0.5");
  
  // 建築方塊動畫
  const blocks = document.querySelectorAll('.building-block');
  blocks.forEach((block, index) => {
    const delay = index * 0.2;
    const posX = (Math.random() - 0.5) * 200;
    const posY = index * 30;
    const posZ = (Math.random() - 0.5) * 100;
    const rotX = Math.random() * 360;
    const rotY = Math.random() * 360;
    const rotZ = Math.random() * 360;
    
    tl.to(block, {
      duration: 1,
      opacity: 1,
      x: posX,
      y: posY,
      z: posZ,
      rotationX: rotX,
      rotationY: rotY,
      rotationZ: rotZ,
      ease: "back.out(1.7)"
    }, `blueprint+=${delay}`);
  });
  
  // 文字動畫
  const textElements = document.querySelectorAll('.building-text');
  textElements.forEach((text, index) => {
    tl.to(text, {
      duration: 1,
      opacity: 1,
      y: -20,
      ease: "power2.out"
    }, `blueprint+=${2 + index * 0.5}`);
  });
  
  // 最終動畫
  tl.to('.building', {
    duration: 3,
    rotationY: 360,
    ease: "power1.inOut"
  }, "+=1")
  .to(['.building-block', '.building-text', crane, blueprint], {
    duration: 1.5,
    opacity: 0,
    stagger: 0.1
  }, "+=1");
  
  // 讓建築可以互動
  buildingDiv.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    gsap.to(buildingDiv, {
      rotationY: xAxis,
      rotationX: yAxis,
      ease: "power1.out",
      duration: 0.5
    });
  });
  
  buildingDiv.addEventListener('mouseleave', () => {
    gsap.to(buildingDiv, {
      rotationY: 0,
      rotationX: 0,
      ease: "power1.out",
      duration: 0.5
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  console.log('GSAP Build script loaded');
  
  const slider = document.getElementById('tech-slider');
  if (!slider) {
    console.error('Slider container not found');
    return;
  }
  
  // 添加高科技裝飾元素
  addTechElements(slider);
  
  // 初始化輪播
  let currentIndex = 0;
  const items = document.querySelectorAll('.slider-item');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.arrow.prev');
  const nextBtn = document.querySelector('.arrow.next');
  const totalItems = items.length;
  
  console.log(`Found ${totalItems} slider items`);
  
  // 自動輪播計時器
  let autoplayTimer;
  
  // 設置輪播函數
  function goToSlide(index) {
    // 確保索引在有效範圍內
    if (index < 0) index = totalItems - 1;
    if (index >= totalItems) index = 0;
    
    console.log(`Going to slide ${index}`);
    
    // 更新當前索引
    currentIndex = index;
    
    // 更新輪播項目
    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('active');
        gsap.to(item, { opacity: 1, duration: 0.5 });
      } else {
        item.classList.remove('active');
        gsap.to(item, { opacity: 0, duration: 0.5 });
      }
    });
    
    // 更新指示點
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // 內容動畫
    const content = items[currentIndex].querySelector('.slider-content');
    gsap.fromTo(content, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );
    
    // 圖片動畫
    const img = items[currentIndex].querySelector('img');
    gsap.fromTo(img, 
      { scale: 1.1 },
      { scale: 1, duration: 10, ease: "none" }
    );
    
    // 重置自動輪播計時器
    resetAutoplay();
  }
  
  // 設置自動輪播
  function startAutoplay() {
    console.log('Starting autoplay');
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }
  
  // 重置自動輪播
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  
  // 綁定按鈕事件
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  
  // 綁定指示點事件
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      goToSlide(index);
    });
  });
  
  // 添加鍵盤控制
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  });
  
  // 添加觸摸滑動支持
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    if (touchEndX < touchStartX) {
      // 向左滑動，下一張
      goToSlide(currentIndex + 1);
    } else if (touchEndX > touchStartX) {
      // 向右滑動，上一張
      goToSlide(currentIndex - 1);
    }
  }
  
  // 初始化第一張幻燈片
  goToSlide(0);
  
  // 開始自動輪播
  startAutoplay();
  
  // 當用戶滾動到輪播區域時觸發動畫
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: slider,
      start: "top bottom",
      onEnter: () => {
        gsap.to('.slider-title', { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power2.out",
          stagger: 0.2
        });
      }
    });
  }
});

// 添加高科技裝飾元素
function addTechElements(container) {
  // 添加裝飾線條
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.className = 'tech-line';
    
    // 隨機設置線條位置和大小
    const isHorizontal = Math.random() > 0.5;
    const width = isHorizontal ? Math.random() * 150 + 50 : 2;
    const height = isHorizontal ? 2 : Math.random() * 150 + 50;
    const left = Math.random() * 90 + 5;
    const top = Math.random() * 90 + 5;
    
    line.style.width = `${width}px`;
    line.style.height = `${height}px`;
    line.style.left = `${left}%`;
    line.style.top = `${top}%`;
    
    container.appendChild(line);
    
    // 為線條添加動畫
    gsap.to(line, {
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 3 + 2,
      repeat: -1,
      yoyo: true
    });
  }
  
  // 添加裝飾圓圈
  for (let i = 0; i < 5; i++) {
    const circle = document.createElement('div');
    circle.className = 'tech-circle';
    
    // 隨機設置圓圈位置和大小
    const size = Math.random() * 100 + 50;
    const left = Math.random() * 90 + 5;
    const top = Math.random() * 90 + 5;
    
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${left}%`;
    circle.style.top = `${top}%`;
    
    container.appendChild(circle);
    
    // 為圓圈添加動畫
    gsap.to(circle, {
      scale: Math.random() * 0.5 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 5 + 3,
      repeat: -1,
      yoyo: true
    });
  }
}