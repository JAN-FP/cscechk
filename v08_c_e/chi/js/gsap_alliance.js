document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('network-container');
  
  // 添加標題
  const titleContainer = document.createElement('div');
  titleContainer.className = 'title-container';
  
  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = '夥伴協作';
  
  const subtitle = document.createElement('div');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'ALLIANCE';
  
  titleContainer.appendChild(title);
  titleContainer.appendChild(subtitle);
  container.appendChild(titleContainer);
  
  // 主節點 - 中建香港
  const mainNode = createNode('中建香港', 'main');
  positionElement(mainNode, 50, 50);
  container.appendChild(mainNode);
  
  const mainNodeLabel = createNodeLabel('中國建築工程(香港)有限公司');
  positionElement(mainNodeLabel, 50, 50 + 8);
  container.appendChild(mainNodeLabel);
  
  // 次要節點
  const partnerTypes = [
    { name: '政府', label: '政府部門與機構' },
    { name: '供應商', label: '材料與設備供應商' },
    { name: '顧問', label: '專業顧問公司' },
    { name: '分包商', label: '專業分包商' },
    { name: '學術', label: '學術與研究機構' },
    { name: '社區', label: '社區組織' }
  ];
  
  const secondaryNodes = [];
  const connections = [];
  
  // 創建次要節點並連接到主節點
  partnerTypes.forEach((partner, index) => {
    const angle = (index * 60) * (Math.PI / 180);
    const distance = 30;
    
    const x = 50 + distance * Math.cos(angle);
    const y = 50 + distance * Math.sin(angle);
    
    const node = createNode(partner.name, 'secondary');
    positionElement(node, x, y);
    container.appendChild(node);
    
    const nodeLabel = createNodeLabel(partner.label);
    positionElement(nodeLabel, x, y + 6);
    container.appendChild(nodeLabel);
    
    secondaryNodes.push({ node, x, y, angle });
    
    // 創建連接線
    const connection = createConnection(50, 50, x, y);
    container.appendChild(connection);
    connections.push(connection);
  });
  
  // 創建小節點
  const smallNodes = [];
  secondaryNodes.forEach((secondary, index) => {
    for (let i = 0; i < 3; i++) {
      const baseAngle = secondary.angle;
      const variance = (Math.random() - 0.5) * 30 * (Math.PI / 180);
      const angle = baseAngle + variance;
      
      const distance = 15 + Math.random() * 10;
      const x = secondary.x + distance * Math.cos(angle);
      const y = secondary.y + distance * Math.sin(angle);
      
      // 確保節點在容器內
      const boundedX = Math.max(5, Math.min(95, x));
      const boundedY = Math.max(5, Math.min(95, y));
      
      const node = createNode('', 'small');
      positionElement(node, boundedX, boundedY);
      container.appendChild(node);
      
      smallNodes.push({ node, x: boundedX, y: boundedY });
      
      // 創建連接線
      const connection = createConnection(secondary.x, secondary.y, boundedX, boundedY);
      container.appendChild(connection);
      connections.push(connection);
    }
  });
  
  // 添加脈衝效果
  addPulseEffects(container, mainNode);
  
  // 動畫
  animateNetwork(mainNode, secondaryNodes, smallNodes, connections);
  
  // 響應式調整
  window.addEventListener('resize', function() {
    // 重新計算位置
  });
});

function createNode(text, className = '') {
  const node = document.createElement('div');
  node.className = `node ${className}`;
  node.textContent = text;
  return node;
}

function createNodeLabel(text) {
  const label = document.createElement('div');
  label.className = 'node-label';
  label.textContent = text;
  return label;
}

function positionElement(element, x, y) {
  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  if (element.classList.contains('node')) {
    element.style.transform = 'translate(-50%, -50%)';
  } else {
    element.style.transform = 'translate(-50%, 0)';
  }
}

function createConnection(x1, y1, x2, y2) {
  const connection = document.createElement('div');
  connection.className = 'connection';
  
  // 計算長度和角度
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  
  // 設置連接線的位置和旋轉
  connection.style.width = `${length}%`;
  connection.style.left = `${x1}%`;
  connection.style.top = `${y1}%`;
  connection.style.transform = `translate(0, -50%) rotate(${angle}deg)`;
  
  return connection;
}

function addPulseEffects(container, mainNode) {
  // 從主節點發出的脈衝
  setInterval(() => {
    const pulse = document.createElement('div');
    pulse.className = 'pulse';
    
    // 獲取主節點的位置
    const rect = mainNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x = (rect.left + rect.width / 2 - containerRect.left) / containerRect.width * 100;
    const y = (rect.top + rect.height / 2 - containerRect.top) / containerRect.height * 100;
    
    pulse.style.left = `${x}%`;
    pulse.style.top = `${y}%`;
    pulse.style.width = '0';
    pulse.style.height = '0';
    
    container.appendChild(pulse);
    
    gsap.to(pulse, {
      width: '50%',
      height: '50%',
      left: `${x - 25}%`,
      top: `${y - 25}%`,
      opacity: 0,
      duration: 2,
      ease: 'power1.out',
      onComplete: () => {
        pulse.remove();
      }
    });
  }, 3000);
}

function animateNetwork(mainNode, secondaryNodes, smallNodes, connections) {
  // 初始動畫
  gsap.from(mainNode, {
    scale: 0,
    opacity: 0,
    duration: 1.5,
    ease: 'elastic.out(1, 0.5)'
  });
  
  // 次要節點動畫
  secondaryNodes.forEach((item, index) => {
    gsap.from(item.node, {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.5 + index * 0.1,
      ease: 'back.out(1.7)'
    });
  });
  
  // 連接線動畫
  connections.forEach((connection, index) => {
    gsap.from(connection, {
      width: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.7 + index * 0.05,
      ease: 'power1.inOut'
    });
  });
  
  // 小節點動畫
  smallNodes.forEach((item, index) => {
    gsap.from(item.node, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      delay: 1.2 + index * 0.03,
      ease: 'back.out(1.7)'
    });
  });
  
  // 持續的浮動動畫
  secondaryNodes.forEach((item) => {
    gsap.to(item.node, {
      y: '+=10',
      duration: 2 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
  
  smallNodes.forEach((item) => {
    gsap.to(item.node, {
      x: `+=${5 + Math.random() * 5}`,
      y: `+=${5 + Math.random() * 5}`,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });

  console.log('Alliance network script loaded');
}