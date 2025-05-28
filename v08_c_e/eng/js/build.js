// 數字動畫效果
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  
  const duration = 2000; // 動畫持續時間（毫秒）
  const fps = 60; // 每秒幀數
  const frameDuration = 1000 / fps; // 每幀持續時間（毫秒）
  
  const animateCounters = (startTime) => {
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 到 1 之間的進度
    
    let allCompleted = true;
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const startValue = 0;
      const currentValue = Math.floor(progress * target);
      
      counter.innerText = currentValue.toLocaleString(); // 添加千分位分隔符
      
      if (progress < 1) {
        allCompleted = false;
      }
    });
    
    if (!allCompleted) {
      requestAnimationFrame(() => animateCounters(startTime));
    }
  };

  // 當元素進入視口時觸發動畫
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 重置計數器為0
        entry.target.innerText = '0';
        // 開始動畫
        const startTime = performance.now();
        animateCounters(startTime);
        observer.unobserve(entry.target); // 只觸發一次
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// 初始化頁面
document.addEventListener('DOMContentLoaded', function() {
  console.log('Build script loaded');
  initCounterAnimation();
});