// 數字動畫函數
function animateNumber(element, targetValue, duration = 2000) {
    // 設置初始值
    let currentValue = 0;
    // 計算每一步的增量
    const isInteger = Number.isInteger(targetValue);
    // 設置更新頻率（毫秒）
    const updateInterval = 20;
    // 計算總步數
    const steps = duration / updateInterval;
    // 計算每一步的增量
    const increment = targetValue / steps;
    
    // 啟動動畫
    const timer = setInterval(function() {
        currentValue += increment;
        
        // 如果當前值超過目標值，則設置為目標值
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        // 更新顯示的值
        if (isInteger) {
            element.textContent = Math.floor(currentValue).toLocaleString();
        } else {
            // 對於小數，保留兩位小數
            element.textContent = currentValue.toFixed(1);
        }
    }, updateInterval);
}

// 檢查元素是否在視窗中
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 頁面載入時的動畫
document.addEventListener('DOMContentLoaded', function() {
    // 獲取所有需要動畫的數字元素
    const numberElements = document.querySelectorAll('.number');
    
    // 為每個數字元素添加動畫
    numberElements.forEach(function(element) {
        // 獲取目標值
        const targetValue = parseFloat(element.getAttribute('data-value'));
        animateNumber(element, targetValue);
    });
});

// 滾動觸發動畫
function animateNumbersOnScroll() {
    const numberElements = document.querySelectorAll('.counter-number');
    
    // 為每個在視窗中的數字元素添加動畫
    function checkElements() {
        numberElements.forEach(function(element) {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                
                // 獲取目標值
                const targetValue = parseFloat(element.getAttribute('data-target'));
                animateNumber(element, targetValue);
            }
        });
    }
    
    // 初始檢查
    checkElements();
    
    // 滾動時檢查
    window.addEventListener('scroll', checkElements);
}

// 頁面載入後啟動滾動觸發功能
window.addEventListener('load', animateNumbersOnScroll);

// 在文件末尾添加以下代碼

// 卡片滑入動畫
// 確保卡片過渡效果正確應用
document.addEventListener('DOMContentLoaded', function() {
    // 獲取所有卡片
    const cards = document.querySelectorAll('.card');
    
    // 為每張卡片添加滑入效果的類
    cards.forEach(function(card) {
        card.classList.add('slide-in-up');
        
        // 確保過渡效果在滑入動畫完成後應用
        card.addEventListener('animationend', function() {
            // 移除滑入動畫類，避免與hover效果衝突
            card.classList.remove('slide-in-up');
            
            // 重要：移除內聯樣式，讓CSS hover效果生效
            setTimeout(function() {
                card.removeAttribute('style');
            }, 100);
        });
        
        // 移除現有的mouseenter和mouseleave事件監聽器
        // 讓CSS的hover效果自然生效
    });
});
