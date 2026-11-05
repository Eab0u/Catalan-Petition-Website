import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createFlagTexture, type FlagVariant } from "./flagTexture";

const FLAG_WIDTH = 1.5;
const FLAG_HEIGHT = 1.0;
const FLAG_DEPTH = 0.16; // chunkiness
const SEGMENTS_X = 24;
const SEGMENTS_Y = 14;

interface FlagSceneProps {
  variant: FlagVariant;
  onReady?: () => void;
}

export default function FlagScene({ variant, onReady }: FlagSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flagMeshRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const pointer = useRef({ x: 0, y: 0 });
  const dragTilt = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);

  const texture = useMemo(() => createFlagTexture(variant), [variant]);

  // A chunky box, not a flat plane: front/back faces carry the flag
  // texture, the four thin edge faces get a plain "binding" color.
  const geometry = useMemo(
    () => new THREE.BoxGeometry(FLAG_WIDTH, FLAG_HEIGHT, FLAG_DEPTH, SEGMENTS_X, SEGMENTS_Y, 1),
    []
  );

  const basePositions = useMemo(() => {
    const pos = geometry.attributes.position;
    const arr = new Float32Array(pos.array.length);
    arr.set(pos.array as Float32Array);
    return arr;
  }, [geometry]);

  const faceMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.05,
        clearcoat: 0.7,
        clearcoatRoughness: 0.2,
      }),
    [texture]
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.5,
        clearcoatRoughness: 0.25,
      }),
    []
  );

  // BoxGeometry group order: 0:+x 1:-x 2:+y 3:-y 4:+z(front) 5:-z(back)
  const materials = useMemo(
    () => [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, faceMaterial, faceMaterial],
    [edgeMaterial, faceMaterial]
  );

  useEffect(() => {
    return () => {
      texture.dispose();
      faceMaterial.dispose();
    };
  }, [texture, faceMaterial]);
  useEffect(() => {
    return () => {
      geometry.dispose();
      edgeMaterial.dispose();
    };
  }, [geometry, edgeMaterial]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleTouchStart = () => {
      isTouching.current = true;
    };
    const handleTouchEnd = () => {
      isTouching.current = false;
      dragTilt.current.x = 0;
      dragTilt.current.y = 0;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching.current || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      const nx = ((t.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((t.clientY - rect.top) / rect.height) * 2 - 1);
      dragTilt.current.x = nx;
      dragTilt.current.y = ny;
    };

    // Track the cursor across the whole viewport, not just while over the
    // small flag canvas, so it reacts the moment the mouse gets close.
    window.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Vertex displacement wave along the depth axis: every vertex keeps
    // its own base Z (so front/back/edge faces stay the same thickness
    // apart) and just gets the wave added on top, growing toward the
    // right-hand edge.
    if (flagMeshRef.current && !prefersReducedMotion) {
      const posAttr = flagMeshRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const x = basePositions[i * 3];
        const y = basePositions[i * 3 + 1];
        const baseZ = basePositions[i * 3 + 2];
        const distFromEdge = (x + FLAG_WIDTH / 2) / FLAG_WIDTH; // 0 at left, 1 at right
        const amplitude = 0.06 * distFromEdge;
        const wave =
          Math.sin(x * 4.5 + t * 2.2) * amplitude +
          Math.sin(y * 3 + t * 1.6) * amplitude * 0.4;
        posAttr.setZ(i, baseZ + wave);
      }
      posAttr.needsUpdate = true;
      flagMeshRef.current.geometry.computeVertexNormals();
    }

    if (groupRef.current) {
      let targetRotY: number;
      let targetRotX: number;

      if (isTouching.current) {
        targetRotY = dragTilt.current.x * 0.7;
        targetRotX = -dragTilt.current.y * 0.4;
      } else if ("ontouchstart" in window) {
        // Touch device, idle: gentle sway, no cursor to follow.
        targetRotY = Math.sin(t * 0.5) * 0.12;
        targetRotX = Math.sin(t * 0.35) * 0.05;
      } else {
        // Full-viewport cursor tracking: turn fairly dramatically toward
        // the mouse, not just a subtle tilt.
        targetRotY = pointer.current.x * 0.7;
        targetRotX = -pointer.current.y * 0.4;
      }

      const lerpFactor = prefersReducedMotion ? 1 : 1 - Math.pow(0.001, delta);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        lerpFactor
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        lerpFactor
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={flagMeshRef} geometry={geometry} material={materials} />
    </group>
  );
}
