import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

const BrainNetwork = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: "#navi1",
        scroller: "body",
        start: "top 0%",
        end: "top 30%",
        scrub: 1,
        pin: true
      }
    });

    tl1.to('#logo',{
      height: "10vh",
      width: "10vw",
      x: "-58vw",
      y:"-50vh",
      opacity: "0"
    });
  }, []);

  useEffect(() => {
    const image = document.getElementById("logo");
    const addColoredSvgBehindCircles = async () => {
      const svg = svgRef.current;
      const circles = svg.querySelectorAll("circle");

      // Load and parse external SVG
      try {
        const response = await fetch("./soma.svg");
        const svgText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");

        // Extract viewBox from the imported SVG
        const importedSvg = doc.querySelector("svg") || doc.documentElement;
        const viewBox = importedSvg.getAttribute("viewBox") || "0 0 100 100";
        const [, , vbWidth, vbHeight] = viewBox.split(/\s+/).map(Number);

        const importedElements = importedSvg.children;

        circles.forEach(circle => {
          const cx = parseFloat(circle.getAttribute("cx"));
          const cy = parseFloat(circle.getAttribute("cy"));
          const r = parseFloat(circle.getAttribute("r"));

          // Scale factor
          const size = r * 2.5;
          const scaledSizeX = size * 3;
          const scaledSizeY = size * 3;
          const scaleX = scaledSizeX / vbWidth;
          const scaleY = scaledSizeY / vbHeight;

          // Offset amount (upward = negative)
          const yOffset = -5;

          const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
          group.setAttribute(
            "transform",
            `translate(${cx - scaledSizeX / 2}, ${cy - scaledSizeY / 2 + yOffset}) scale(${scaleX}, ${scaleY})`
          );

          for (const el of importedElements) {
            const cloned = el.cloneNode(true);
            cloned.setAttribute("fill", "#444");
            group.appendChild(cloned);
          }

          svg.insertBefore(group, circle);
        });
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    const initializeBrainNetwork = () => {
      const svg = svgRef.current;
      const text = svg.querySelector("#caption");

      const circles = svg.querySelectorAll("circle");
      const lines = svg.querySelectorAll("line, path");

      let nodes = {};
      const edges = [];

      // Set up nodes
      circles.forEach((circle, i) => {
        const id = circle.getAttribute("name") || `node${i}`;
        const cx = parseFloat(circle.getAttribute("cx"));
        const cy = parseFloat(circle.getAttribute("cy"));
        circle.setAttribute("class", "node");
        circle.setAttribute("id", id);
        nodes[id] = { id, x: cx, y: cy, element: circle, neighbors: [] };
      });

      // Draw background rect behind caption text
      const setupTextNode = () => {
        const bbox = text.getBBox();
        const padding = 10;
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", bbox.x - padding);
        rect.setAttribute("y", bbox.y - (padding));
        rect.setAttribute("class", "node");
        rect.setAttribute("width", bbox.width + 2 * padding);
        rect.setAttribute("height", bbox.height + 2 * padding);
        rect.setAttribute("fill", "#481BC3");
        rect.setAttribute("rx", "15");
        rect.setAttribute("ry", "15");
        rect.setAttribute("id", "text-node-bg");
        svg.insertBefore(rect, text);

        // Add the rect as a node after it's created
        nodes["text-node-bg"] = {
          id: "text-node-bg",
          x: bbox.x + bbox.width / 2,
          y: bbox.y + bbox.height / 2,
          element: rect,
          neighbors: []
        };

        // Re-attach hover listeners to include rect now
        for (const node of Object.values(nodes)) {
          node.element.addEventListener("mouseenter", () => runDijkstra(node.id));
          node.element.addEventListener("mouseleave", resetGraph);
        }
      };

      // Wait for the text to be rendered before using getBBox
      requestAnimationFrame(setupTextNode);

      // Find closest node helper
      function findClosestNode(x, y) {
        let minDist = Infinity, closest = null;
        for (const node of Object.values(nodes)) {
          const d = Math.hypot(node.x - x, node.y - y);
          if (d < 1) return node;
          if (d < minDist) {
            minDist = d;
            closest = node;
          }
        }
        return closest;
      }

      // Set up edges
      lines.forEach(line => {
        let x1, y1, x2, y2;
        if (line.tagName === "line") {
          x1 = parseFloat(line.getAttribute("x1"));
          y1 = parseFloat(line.getAttribute("y1"));
          x2 = parseFloat(line.getAttribute("x2"));
          y2 = parseFloat(line.getAttribute("y2"));
        } else if (line.tagName === "path") {
          const match = line.getAttribute("d").match(/M\s*(\d+)\s*(\d+).*?(\d+)\s*(\d+)/);
          if (!match) return;
          x1 = parseFloat(match[1]);
          y1 = parseFloat(match[2]);
          x2 = parseFloat(match[3]);
          y2 = parseFloat(match[4]);
        }
        const from = findClosestNode(x1, y1);
        const to = findClosestNode(x2, y2);
        if (from && to && from !== to) {
          const weight = Math.hypot(from.x - to.x, from.y - to.y);
          from.neighbors.push({ id: to.id, weight });
          to.neighbors.push({ id: from.id, weight });
          line.classList.add("edge");
          edges.push({ from: from.id, to: to.id, element: line });
        }
      });

      // Dijkstra's
      let activeAnimation = [];
      function runDijkstra(startId) {
        resetGraph();
        const dist = {};
        const prev = {};
        const visited = new Set();
        const queue = [];

        for (const id in nodes) dist[id] = Infinity;
        dist[startId] = 0;
        queue.push({ id: startId, dist: 0 });

        while (queue.length) {
          queue.sort((a, b) => a.dist - b.dist);
          const { id: current } = queue.shift();
          if (visited.has(current)) continue;
          visited.add(current);

          nodes[current].neighbors.forEach(n => {
            const alt = dist[current] + n.weight;
            if (alt < dist[n.id]) {
              dist[n.id] = alt;
              prev[n.id] = current;
              queue.push({ id: n.id, dist: alt });
            }
          });
        }

        const connectedNodes = new Set();
        const animatePath = (to) => {
          const from = prev[to];
          if (!from) return;
          connectedNodes.add(from);
          connectedNodes.add(to);
          const edge = edges.find(e => (e.from === from && e.to === to) || (e.from === to && e.to === from));
          if (edge) {
            const step = () => {
              edge.element.classList.add("active-edge");
              gsap.to(nodes[to].element, { fill: "#FFC000", duration: 0.1 });

              // Highlight the text box if these special nodes are hit
              if (["alpha", "delta", "gamma", "a"].includes(to)) {
                gsap.to(nodes["text-node-bg"].element, { attr: { fill: "lime" }, duration: 0.1 });
              }
            };
            const timeout = setTimeout(step, connectedNodes.size * 30);
            activeAnimation.push(timeout);
          }
          animatePath(from);
        };

        Object.keys(prev).forEach(to => animatePath(to));
        connectedNodes.add(startId);
        gsap.to(nodes[startId].element, { fill: "#FFC000", duration: 0.1 });
        gsap.to(document.querySelector("#caption"), { fill: "#FFC000", duration: 0.1 })
        logoGlow();

        for (const id in nodes) {
          if (!connectedNodes.has(id)) {
            gsap.to(nodes[id].element, { fill: "#444", duration: 0.1 });
            gsap.to(nodes["text-node-bg"].element, { fill: "#8d66f9", duration: 0.1 });
          }
        }
      }
      function logoGlow() {
        gsap.to(image, {
          filter: "url(#glow)",
          delay: 0.8,
          duration: 1
        });
      }

      function logoGlowOff() {
        gsap.to(image, {
          filter: "none",
          duration: 0.3,
          repeat: -1
        });
      }

      function resetGraph() {
        logoGlowOff();
        activeAnimation.forEach(timeout => clearTimeout(timeout));
        activeAnimation = [];

        for (const node of Object.values(nodes)) {
          gsap.killTweensOf(node.element);
          gsap.set(node.element, { fill: "#481BC3" });
          gsap.to(document.querySelector("#caption"), { fill: "currentColor", duration: 0.1 })
        }

        document.querySelectorAll(".edge").forEach(e => {
          e.classList.remove("active-edge");
        });

      }

      // Add event listeners
      for (const node of Object.values(nodes)) {
        node.element.addEventListener("mouseenter", () => runDijkstra(node.id));
        node.element.addEventListener("mouseleave", resetGraph);
      }
    };

    // Initialize the brain network
    initializeBrainNetwork();
    addColoredSvgBehindCircles();

    // Cleanup function
    return () => {
      // Clean up any event listeners or animations if needed
      if (svgRef.current) {
        const nodes = svgRef.current.querySelectorAll(".node");
        nodes.forEach(node => {
          node.removeEventListener("mouseenter", () => { });
          node.removeEventListener("mouseleave", () => { });
        });
      }
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <div id="brain" className='text-black dark:text-white ' style={{ height: '100vh', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox="120 500 2000 1500"
        xmlns="http://www.w3.org/2000/svg"
        id="brain-svg"
        style={{ width: '100%', height: '100%', overflowX: 'hidden' }}
      >
        {/* Lines/Edges */}
        <line name="node1-to-node2" id="node1-to-node2" x1="160" y1="1536" x2="600" y2="1400" stroke="#888" strokeWidth="2" />
        <line name="node2-to-node3" id="node2-to-node3" x1="600" y1="1400" x2="1000" y2="1440" stroke="#888" strokeWidth="2" />
        <line name="node3-to-node4" id="node3-to-node4" x1="1000" y1="1440" x2="1280" y2="1600" stroke="#888" strokeWidth="2" />
        <line name="node3-to-node5" id="node3-to-node5" x1="1000" y1="1440" x2="1320" y2="1280" stroke="#888" strokeWidth="2" />
        <line name="node4-to-node6" id="node4-to-node6" x1="1280" y1="1600" x2="1440" y2="1120" stroke="#888" strokeWidth="2" />
        <line name="node4-to-node7" id="node4-to-node7" x1="1280" y1="1600" x2="1600" y2="1600" stroke="#888" strokeWidth="2" />
        <line name="alpha2gamma" id="alpha2gamma" x1="1090" y1="1265" x2="1320" y2="1280" stroke="#888" strokeWidth="2" />
        <line name="gamma-to-node6" id="gamma-to-node6" x1="1320" y1="1280" x2="1440" y2="1120" stroke="#888" strokeWidth="2" />
        <line name="node6-to-node8" id="node6-to-node8" x1="1440" y1="1120" x2="1600" y2="720" stroke="#888" strokeWidth="2" />
        <line name="a2-to-a1" id="a2-to-a1" x1="1200" y1="680" x2="1600" y2="720" stroke="#888" strokeWidth="2" />
        <line name="a3-to-a2" id="a3-to-a2" x1="800" y1="696" x2="1200" y2="680" stroke="#888" strokeWidth="2" />
        <line name="e2a" id="e2a" x1="1720" y1="1000" x2="1584" y2="1280" stroke="#888" strokeWidth="2" />
        <line name="c2a" id="c2a" x1="2000" y1="1120" x2="1584" y2="1280" stroke="#888" strokeWidth="2" />
        <line name="d2a" id="d2a" x1="2000" y1="1240" x2="1584" y2="1280" stroke="#888" strokeWidth="2" />
        <line name="f2c" id="f2c" x1="1960" y1="920" x2="2000" y2="1120" stroke="#888" strokeWidth="2" />
        <line name="delta2alpha" id="delta2alpha" x1="900" y1="1265" x2="1090" y2="1265" stroke="#888" strokeWidth="2" />
        <line name="ab2text" id="ab2text" x1="600" y1="1200" x2="900" y2="1265" stroke="#888" strokeWidth="2" />
        <line name="bc2text" id="bc2text" x1="900" y1="1100" x2="1090" y2="1265" stroke="#888" strokeWidth="2" />
        <line name="c1-to-bc" id="c1-to-bc" x1="750" y1="1060" x2="900" y2="1100" stroke="#888" strokeWidth="2" />
        <line name="c2-to-c1" id="c2-to-c1" x1="600" y1="1140" x2="750" y2="1060" stroke="#888" strokeWidth="2" />
        <line name="g2f" id="g2f" x1="1800" y1="800" x2="1960" y2="920" stroke="#888" strokeWidth="2" />

        {/* Paths */}
        <path name="a4-to-a3" id="a4-to-a3" d="M 600 864 Q 800 800 800 696" stroke="#888" fill="transparent" strokeWidth="2" />
        <path name="a5-to-a3" id="a5-to-a3" d="M 560 680 Q 720 560 800 696" stroke="#888" fill="transparent" strokeWidth="2" />
        <path name="a6-to-a5" id="a6-to-a5" d="M 400 864 Q 560 800 560 680" stroke="#888" fill="transparent" strokeWidth="2" />
        <path name="path-node1600-to-node1584" id="path-node1600-to-node1584" d="M 1600 1600 Q 1840 1440 1584 1280" stroke="#888" fill="transparent" strokeWidth="2" />
        <path name="b2a" id="b2a" d="M 1800 1088 Q 1640 1200 1584 1280" stroke="#888" fill="transparent" strokeWidth="2" />
        <path name="path-d-to-h" id="path-d-to-h" d="M 2000 1240 Q 2080 1440 1864 1440" stroke="#888" fill="transparent" strokeWidth="2" />
        <path name="path-h-to-i" id="path-h-to-i" d="M 1864 1440 Q 1860 1660 2000 1600" stroke="#888" fill="transparent" strokeWidth="2" />

        {/* Nodes/Circles */}
        <circle name="node1" id="node1" cx="160" cy="1536" r="12" fill="#481BC3" />
        <circle name="node2" id="node2" cx="600" cy="1400" r="12" fill="#481BC3" />
        <circle name="node3" id="node3" cx="1000" cy="1440" r="12" fill="#481BC3" />
        <circle name="node4" id="node4" cx="1280" cy="1600" r="12" fill="#481BC3" />
        <circle name="gamma-connected from alpha" id="gamma" cx="1320" cy="1280" r="12" fill="#481BC3" />
        <circle name="node6" id="node6" cx="1440" cy="1120" r="12" fill="#481BC3" />
        <circle name="a1" id="a1" cx="1600" cy="720" r="12" fill="#481BC3" />
        <circle name="a2-connects to a1" id="a2-connects to a1" cx="1200" cy="680" r="12" fill="#481BC3" />
        <circle name="a3-connects to a2" id="a3-connects to a2" cx="800" cy="696" r="12" fill="#481BC3" />
        <circle name="a4-connects to a3" id="a4-connects to a3" cx="600" cy="864" r="12" fill="#481BC3" />
        <circle name="a5-connects to a3" id="a5-connects to a3" cx="560" cy="680" r="12" fill="#481BC3" />
        <circle name="a6-connects to a5" id="a6-connects to a5" cx="400" cy="864" r="12" fill="#481BC3" />
        <circle name="node7" id="node7" cx="1600" cy="1600" r="12" fill="#481BC3" />
        <circle name="e-connects to a" id="e-connects to a" cx="1720" cy="1000" r="12" fill="#481BC3" />
        <circle name="below-text-a" id="a" cx="1584" cy="1280" r="12" fill="#481BC3" />
        <circle name="b-connects to a" id="b-connects to a" cx="1800" cy="1088" r="12" fill="#481BC3" />
        <circle name="c-connects to a" id="c-connects to a" cx="2000" cy="1120" r="12" fill="#481BC3" />
        <circle name="d-connects to a" id="d-connects to a" cx="2000" cy="1240" r="12" fill="#481BC3" />
        <circle name="h-connects to d" id="h-connects to d" cx="1864" cy="1440" r="12" fill="#481BC3" />
        <circle name="i-connects to h" id="i-connects to h" cx="2000" cy="1600" r="12" fill="#481BC3" />
        <circle name="f-connects to c" id="f-connects to c" cx="1960" cy="920" r="12" fill="#481BC3" />
        <circle name="g-connects to f" id="g-connects to f" cx="1800" cy="800" r="12" fill="#481BC3" />
        <circle name="ab-connects to text" id="ab-connects to text" cx="600" cy="1200" r="12" fill="#481BC3" />
        <circle name="delta-underneath text" id="delta" cx="900" cy="1265" r="12" fill="#481BC3" />
        <circle name="bc-connects to text" id="bc-connects to text" cx="900" cy="1100" r="12" fill="#481BC3" />
        <circle name="alpha-underneath text" id="alpha" cx="1090" cy="1265" r="12" fill="#481BC3" />
        <circle name="c1-connects to bc" id="c1-connects to bc" cx="750" cy="1060" r="12" fill="#481BC3" />
        <circle name="c2-connects to c1" id="c2-connects to c1" cx="600" cy="1140" r="12" fill="#481BC3" />

        {/* Text */}
        <text id="caption" x="800" y="1280" fontSize="50" fill="currentColor" fontWeight="bold">
          Studying the Brain to understand the Brain
        </text>
        <defs>
          <filter id="glow">
            <feDropShadow dx="0" dy="0" stdDeviation="40" flood-color="#FFC000" flood-opacity="1" />
          </filter>
        </defs>

        <image id="logo" href="/gloneuro.png" x="900" y="700" width="530" height="530" />
      </svg>
    </div>
  );
};

export default BrainNetwork;