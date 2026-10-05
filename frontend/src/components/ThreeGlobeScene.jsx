import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

export default function ThreeGlobeScene({ className = "" }) {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = isMobile ? 6.2 : 5.4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    // Group containing the entire globe assembly for easy rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Core Sphere (Semi-transparent inner glow)
    const sphereRadius = isMobile ? 1.45 : 1.75;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, isMobile ? 24 : 36, isMobile ? 24 : 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x7C3AED : 0x6D28D9,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.22 : 0.15,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(coreSphere);

    // 2. Latitude and Longitude Rings
    const ringMat = new THREE.LineBasicMaterial({
      color: isDark ? 0xEF4444 : 0x7C3AED,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25,
    });

    for (let i = -2; i <= 2; i++) {
      const r = Math.cos((i * Math.PI) / 6) * sphereRadius;
      const y = Math.sin((i * Math.PI) / 6) * sphereRadius;
      const circleGeo = new THREE.BufferGeometry();
      const points = [];
      const segments = isMobile ? 32 : 48;
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
      }
      circleGeo.setFromPoints(points);
      const ring = new THREE.Line(circleGeo, ringMat);
      globeGroup.add(ring);
    }

    // 3. Orbit Rings (Tilted)
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = Math.PI / 3.5;
    orbitGroup.rotation.y = Math.PI / 6;
    globeGroup.add(orbitGroup);

    const orbitRadius = sphereRadius * 1.42;
    const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius * 0.95, 0, 2 * Math.PI, false, 0);
    const orbitPoints = orbitCurve.getPoints(isMobile ? 40 : 64);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints.map((p) => new THREE.Vector3(p.x, p.y, 0)));
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0x22C55E,
      transparent: true,
      opacity: isDark ? 0.6 : 0.45,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitGroup.add(orbitLine);

    // Orbiting Satellite / Beacon
    const satGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xFACC15 });
    const satellite = new THREE.Mesh(satGeo, satMat);
    orbitGroup.add(satellite);

    // Second counter-orbit ring
    const orbit2Group = new THREE.Group();
    orbit2Group.rotation.x = -Math.PI / 4;
    orbit2Group.rotation.z = Math.PI / 4;
    globeGroup.add(orbit2Group);

    const orbit2Curve = new THREE.EllipseCurve(0, 0, orbitRadius * 1.15, orbitRadius * 1.05, 0, 2 * Math.PI, false, 0);
    const orbit2Points = orbit2Curve.getPoints(isMobile ? 36 : 56);
    const orbit2Geo = new THREE.BufferGeometry().setFromPoints(orbit2Points.map((p) => new THREE.Vector3(p.x, p.y, 0)));
    const orbit2Mat = new THREE.LineBasicMaterial({
      color: 0xEF4444,
      transparent: true,
      opacity: isDark ? 0.45 : 0.35,
    });
    const orbit2Line = new THREE.Line(orbit2Geo, orbit2Mat);
    orbit2Group.add(orbit2Line);

    // 4. Destination Marker Pins on Globe Surface
    const pinCoords = [
      { lat: 27.1751, lon: 78.0421, color: 0xEF4444 }, // Agra / Taj Mahal
      { lat: 48.8584, lon: 2.2945, color: 0x7C3AED },   // Paris / Eiffel
      { lat: 35.6762, lon: 139.6503, color: 0x22C55E }, // Tokyo
      { lat: 40.7128, lon: -74.006, color: 0xFACC15 },  // New York
      { lat: 17.3616, lon: 78.4747, color: 0x06B6D4 },  // Hyderabad / Charminar
      { lat: 25.2048, lon: 55.2708, color: 0xD946EF },  // Dubai
    ];

    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    pinCoords.forEach((coord) => {
      const phi = (90 - coord.lat) * (Math.PI / 180);
      const theta = (coord.lon + 180) * (Math.PI / 180);

      const x = -(sphereRadius * Math.sin(phi) * Math.cos(theta));
      const z = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const y = sphereRadius * Math.cos(phi);

      // Pin Head (sphere)
      const pinHeadGeo = new THREE.SphereGeometry(isMobile ? 0.06 : 0.08, 12, 12);
      const pinHeadMat = new THREE.MeshBasicMaterial({ color: coord.color });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHead.position.set(x * 1.06, y * 1.06, z * 1.06);
      pinGroup.add(pinHead);

      // Stalk
      const stalkPoints = [new THREE.Vector3(x, y, z), new THREE.Vector3(x * 1.06, y * 1.06, z * 1.06)];
      const stalkGeo = new THREE.BufferGeometry().setFromPoints(stalkPoints);
      const stalkMat = new THREE.LineBasicMaterial({ color: coord.color, transparent: true, opacity: 0.8 });
      const stalk = new THREE.Line(stalkGeo, stalkMat);
      pinGroup.add(stalk);
    });

    // 5. Star / Particle Dust Field
    const particleCount = isMobile ? 60 : 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.04 : 0.06,
      color: isDark ? 0xFACC15 : 0x7C3AED,
      transparent: true,
      opacity: isDark ? 0.6 : 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction / Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      if (!prefersReducedMotion) {
        // Continuous gentle rotation
        globeGroup.rotation.y = elapsedTime * 0.22;
        globeGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.12;

        // Satellite movement
        const satAngle = elapsedTime * 1.4;
        satellite.position.x = Math.cos(satAngle) * orbitRadius;
        satellite.position.y = Math.sin(satAngle) * (orbitRadius * 0.95);

        // Smooth mouse parallax
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;
        camera.position.x = mouseX * 1.2;
        camera.position.y = -mouseY * 1.2;
        camera.lookAt(0, 0, 0);

        // Slow particle drift
        particles.rotation.y = elapsedTime * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      ringMat.dispose();
      orbitMat.dispose();
      orbit2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-auto ${className}`}
      style={{ minHeight: "220px" }}
    />
  );
}
