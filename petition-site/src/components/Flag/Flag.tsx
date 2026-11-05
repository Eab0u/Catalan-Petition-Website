import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import FlagScene from "./FlagScene";
import StaticFlagSvg from "./StaticFlagSvg";
import type { FlagVariant } from "./flagTexture";

export type { FlagVariant };

interface FlagProps {
  variant?: FlagVariant;
  className?: string;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Bridges drei's real asset-loading progress out to the plain-HTML page
// loader in index.html, which can't call React hooks directly.
function ProgressBridge() {
  const { progress } = useProgress();
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("ilp:flag-progress", { detail: progress }));
  }, [progress]);
  return null;
}

export default function Flag({ variant = "senyera", className }: FlagProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);

  const [useStatic] = useState(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slowDevice = (navigator.hardwareConcurrency ?? 8) <= 2;
    return reducedMotion || slowDevice || !supportsWebGL();
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || useStatic) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [useStatic]);

  useEffect(() => {
    if (useStatic) return;
    const handler = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [useStatic]);

  // Static fallback never mounts the Canvas/Suspense tree, so report the
  // page loader's flag-progress signal as done immediately — otherwise it
  // would wait on a 3D scene that will never load.
  useEffect(() => {
    if (!useStatic) return;
    window.dispatchEvent(new CustomEvent("ilp:flag-progress", { detail: 100 }));
  }, [useStatic]);

  if (useStatic) {
    return (
      <div className={className}>
        <StaticFlagSvg variant={variant} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        dpr={[1, 2]}
        frameloop={isVisible && tabVisible ? "always" : "never"}
        camera={{ position: [0, 0, 2.6], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 3]} intensity={1.1} />
        <directionalLight position={[-2, -1, 2]} intensity={0.4} />
        <Suspense fallback={<ProgressBridge />}>
          <FlagScene variant={variant} onReady={() => {}} />
          <ProgressBridge />
        </Suspense>
      </Canvas>
    </div>
  );
}
