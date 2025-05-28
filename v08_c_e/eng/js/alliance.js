
/**
 * 數字計數器動畫函數
 * 為帶有counter-number類的元素創建從0到目標值的動畫效果
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-number');
    const speed = 300; // 動畫速度(毫秒)
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const countUp = () => {
            const count = +counter.innerText;
            const increment = target / speed;
            
            if(count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(countUp, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        // 使用IntersectionObserver觸發動畫
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                countUp();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// 當DOM加載完成後初始化計數器
document.addEventListener('DOMContentLoaded', () => {
    initCounterAnimation();
});

/**
 * 數字計數動畫函數 (優化版)
 * 使用GSAP實現平滑的數字增長動畫，並自動添加百分比符號
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const isPercentage = target === 100;
        
        // 確保初始值為0
        counter.innerText = '0' + (isPercentage ? '%' : '');
        
        // 使用GSAP實現動畫
        gsap.to(counter, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: "power2.out",
            scrollTrigger: {
                trigger: counter,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            onUpdate: function() {
                if(isPercentage) {
                    counter.innerText = Math.round(counter.innerText) + '%';
                }
            }
        });
    });
}

// 當DOM加載完成後初始化計數器
document.addEventListener('DOMContentLoaded', () => {
    // 註冊GSAP插件
    gsap.registerPlugin(ScrollTrigger);
    
    // 初始化數字動畫
    initCounterAnimation();
});

/**
 * 初始化數字計數動畫
 * 此函數會查找所有帶有 counter-number 類別的元素，並根據 data-target 屬性的值創建動畫
 */
function initCounterAnimations() {
  // 檢查元素是否存在
  const counterElements = document.querySelectorAll('.counter-number');
  if (counterElements.length > 0) {
    // 數字計數動畫
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isPercentage = target === 100;
      
      gsap.to(counter, {
        innerText: target,
        duration: 2,
        snap: { innerText: isPercentage ? 1 : 0.1 },
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: 'top 80%'
        },
        onUpdate: function() {
          if (isPercentage) {
            counter.innerText = Math.round(counter.innerText) + '%';
          }
        }
      });
    });
  }
}

// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// 動畫
document.addEventListener('DOMContentLoaded', function() {
  // 初始化數字計數動畫
  initCounterAnimations();
});