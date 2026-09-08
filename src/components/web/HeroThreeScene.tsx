'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Center Wireframe Orb (Creative Core)
    const sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const coreMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(coreMesh);

    const innerSphereGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const innerMesh = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    scene.add(innerMesh);

    // 5. Particles Field (2,000 floating dots)
    const particleCount = 1800;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPurple = new THREE.Color(0x8b5cf6); // #8b5cf6
    const colorCyan = new THREE.Color(0x06b6d4); // #06b6d4

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random coordinates inside a bounding box
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 15;

      // Blend colors randomly between Purple and Cyan
      const mixedColor = new THREE.Color().lerpColors(
        colorPurple,
        colorCyan,
        Math.random()
      );
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom round circular texture for particles (CSS Canvas rendering)
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleField);

    // 6. Interactive Mouse Movement variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 4;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize event
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Core rotation
      coreMesh.rotation.y = elapsedTime * 0.12;
      coreMesh.rotation.x = elapsedTime * 0.06;
      innerMesh.rotation.y = -elapsedTime * 0.25;
      innerMesh.rotation.z = elapsedTime * 0.12;

      // Gentle wave floating for particles
      const positionsArr = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Float calculations
        positionsArr[i3 + 1] += Math.sin(elapsedTime + positionsArr[i3]) * 0.002;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Mouse drag camera lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (-mouseY - targetY) * 0.05;

      camera.position.x = targetX * 1.5;
      camera.position.y = targetY * 1.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Cleanups
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      innerSphereGeo.dispose();
      innerSphereMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 bg-transparent" />;
}
