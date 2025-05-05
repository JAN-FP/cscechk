function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const settings = {
  colors: {
    background: "#9ab3f5",
    fill: "#a3d8f4",
    stroke: "#2d3436" },

  animation: {
    height: window.innerHeight,
    width: window.innerWidth,
    maxPlantCount: 5,
    minPlantCount: 1 },

  plant: {
    maxHeight: 0.75, // relative to the animation size
    minHeight: 0.45,
    minNodes: 3,
    maxNodes: 6,
    strokeWidth: window.innerHeight < 300 ? 1.25 : 2 },

  durations: {
    leaf: 0.035, // relative to the element size
    stem: 0.008 },

  isAnimationOk: window.matchMedia('(prefers-reduced-motion: no-preference)').matches };


const utils = {
  getRandFromRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } };


class Scene extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "setAnimationVars",









    () => {
      this.plantCount = utils.getRandFromRange(settings.animation.minPlantCount, settings.animation.maxPlantCount);
      this.margin = this.height * settings.plant.maxHeight / settings.plant.maxNodes;
      this.plantSection = (this.width - 2 * this.margin) / this.plantCount;
      this.timeline = gsap.timeline();
    });_defineProperty(this, "update",

    () => {
      this.setState({ key: Math.random() });
      this.setAnimationVars();
    });this.state = { key: Math.random() };this.height = settings.animation.height;this.width = settings.animation.width;this.setAnimationVars();}

  render() {
    return /*#__PURE__*/(
      React.createElement(React.Fragment, null, /*#__PURE__*/
      React.createElement("svg", { className: "scene",
        key: this.state.key,
        stroke: settings.colors.stroke,
        strokeWidth: settings.plant.strokeWidth,
        strokeLinecap: "round",
        viewBox: `0 0 ${this.width} ${this.height}`,
        xmlns: "http://www.w3.org/2000/svg",
        preserveAspectRatio: "xMidYMax slice" }, /*#__PURE__*/
      React.createElement("rect", { x: 0, y: 0, height: this.height, width: this.width, fill: settings.colors.background,
        stroke: "none" }),
      [...Array(this.plantCount)].map((e, i) => {
        return /*#__PURE__*/(
          React.createElement(Plant, { key: "plant-" + i, id: i,
            x: this.margin + (i + 0.5) * this.plantSection,
            y: this.height,
            parentTimeline: this.timeline,
            maxHeight: this.height * settings.plant.maxHeight,
            minHeight: this.height * settings.plant.minHeight }));

      })), /*#__PURE__*/

      React.createElement("button", { class: "btn", onClick: this.update, type: "button" }, "again")));


  }}


class Plant extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.minHeight = props.minHeight;
    this.maxHeight = props.maxHeight;
    this.parentTimeline = props.parentTimeline;

    this.height = utils.getRandFromRange(this.minHeight, this.maxHeight);
    this.nodes = utils.getRandFromRange(settings.plant.minNodes, settings.plant.maxNodes);
    this.stemDuration = this.height * settings.durations.stem;
    this.plantDelay = Math.random() * 2;
    this.step = this.height / this.nodes;

    this.stem = null;

    this.timeline = gsap.timeline();
  }

  componentDidMount() {
    if (settings.isAnimationOk) {
      this.timeline.fromTo(
      this.stem,
      {
        drawSVG: "0% 0%" },

      {
        duration: this.stemDuration,
        ease: "linear",
        drawSVG: "0% 100%" },

      `<+${this.plantDelay}`);


      this.parentTimeline.add(this.timeline, "<");
    }
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("g", { className: "plant" }, /*#__PURE__*/
      React.createElement("path", { className: "stem", d: `M ${this.x} ${this.y} L ${this.x} ${this.y - this.height}`,
        ref: path => this.stem = path }),
      [...Array(this.nodes)].map((e, i) => {
        let y = this.y - this.step * (i + 1);
        let size = this.height * 0.35 - this.height * 0.045 * i;
        let delay = this.stemDuration / this.nodes * (i + 1);

        return /*#__PURE__*/(
          React.createElement("g", { className: "leaves", key: "leaf-group-" + i }, /*#__PURE__*/
          React.createElement(Leaf, { x: this.x, y: y, size: size, side: 1, id: this.id + "-" + i + "L",
            parentTimeline: this.timeline, delay: delay + this.plantDelay }), /*#__PURE__*/
          React.createElement(Leaf, { x: this.x, y: y, size: size, side: -1, id: this.id + "-" + i + "R",
            parentTimeline: this.timeline, delay: delay + this.plantDelay })));


      })));


  }}


class Leaf extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.size = props.size;
    this.side = props.side;
    this.delay = props.delay;
    this.parentTimeline = props.parentTimeline;

    this.getLeafPath = this.getLeafPath.bind(this);
    this.getLeafStem = this.getLeafStem.bind(this);
    this.getLeafSubstems = this.getLeafSubstems.bind(this);

    this.hasSolidFill = Math.random() > 0.75;
    this.hasMainStem = !this.hasSolidFill && Math.random() > 0.3;
    this.hasLeftSide = this.hasMainStem && Math.random() > 0.65;
    this.hasRightSide = this.hasMainStem && Math.random() > 0.65;
    this.rotation = utils.getRandFromRange(40, 70) * this.side;

    this.substemSpacing = 4 * settings.plant.strokeWidth;
    this.substemCount = Math.floor(this.size / this.substemSpacing / settings.plant.strokeWidth);

    this.leaf = null;
    this.stem = null;
    this.substems = {
      "1": new Array(this.substemCount),
      "-1": new Array(this.substemCount) };


    this.timeline = gsap.timeline();
  }

  componentDidMount() {
    if (settings.isAnimationOk) {
      const duration = this.size * settings.durations.leaf;

      gsap.set(this.leaf, { transformOrigin: "50% 100%" });

      this.timeline.from(
      this.leaf,
      {
        duration: duration * 1.1,
        delay: this.delay,
        ease: "power4.out",
        rotation: 0,
        scale: 0 });


      this.timeline.fromTo(
      this.stem,
      {
        drawSVG: "0% 0%" },

      {
        duration: duration,
        delay: duration * 0.15,
        ease: "power3.out",
        drawSVG: "0% 100%" },

      "<");

      for (let side in this.substems) {
        this.timeline.fromTo(
        this.substems[side],
        {
          drawSVG: "0% 0%" },

        {
          duration: duration * 0.5,
          ease: "power2.out",
          drawSVG: "0% 100%",
          stagger: 0.4 },

        "<");

      }

      this.parentTimeline.add(this.timeline, "<");
    }
  }

  getLeafPath() {
    const middle = this.size / 2;
    const width = this.size / 3;

    return (
      `M ${this.x} ${this.y} Q ${this.x - width} ${this.y - middle} ${this.x} ${this.y - this.size} Q ${this.x + width} ${this.y - middle} ${this.x} ${this.y} Z`);

  }

  getLeafStem() {
    return /*#__PURE__*/(
      React.createElement("path", { className: "leaf-stem", d: `M ${this.x} ${this.y} L ${this.x} ${this.y - this.size}`,
        ref: path => this.stem = path }));

  }

  getLeafSubstems(side) {
    return /*#__PURE__*/(
      React.createElement("g", { className: "petalStems", clipPath: `url(#leaf-${this.id})` },
      [...Array(this.substemCount)].map((e, i) => {
        let yStart = this.y - (i * this.substemSpacing * settings.plant.strokeWidth + this.substemSpacing);
        let yEnd = yStart - 10 * settings.plant.strokeWidth;

        return /*#__PURE__*/(
          React.createElement("path", { key: this.id + "-substem-" + i, ref: e => this.substems[side][i] = e,
            d: `M ${this.x} ${yStart} L ${this.x + this.size / 6 * side} ${yEnd}` }));

      })));


  }

  render() {
    const leafPath = this.getLeafPath();
    const leafStem = this.hasMainStem ? this.getLeafStem() : null;
    const leftSide = this.hasLeftSide ? this.getLeafSubstems(-1) : null;
    const rightSide = this.hasRightSide ? this.getLeafSubstems(1) : null;

    return /*#__PURE__*/(
      React.createElement("g", { className: "leaf", transform: `rotate(${this.rotation} ${this.x} ${this.y})`,
        ref: path => this.leaf = path }, /*#__PURE__*/
      React.createElement("defs", null, /*#__PURE__*/
      React.createElement("clipPath", { id: `leaf-${this.id}`, clipPathUnits: "userSpaceOnUse" }, /*#__PURE__*/
      React.createElement("path", { d: leafPath }))), /*#__PURE__*/


      React.createElement("path", { className: "outline", d: leafPath,
        fill: this.hasSolidFill ? settings.colors.stroke : settings.colors.fill }),
      leafStem,
      leftSide,
      rightSide));


  }}


ReactDOM.render( /*#__PURE__*/
React.createElement(Scene, { height: settings.animation.height,
  width: settings.animation.width }),
document.querySelector(".animation"));

// ... existing code ...

// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// 人才發展區域動畫
document.addEventListener('DOMContentLoaded', function() {
  // 檢查元素是否存在
  if (document.getElementById('icon-environment')) {
    
    // 數字計數動畫
    const counterElements = document.querySelectorAll('.counter-number');
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
});