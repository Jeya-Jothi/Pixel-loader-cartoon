"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PIXEL_GRID } from "../data/pixelPortraitData";

const DEFAULT_REVEAL_SPREAD = 1900;
const DEFAULT_POP_DURATION = 260;
const DONE_DELAY = 250;

type Pixel = { x: number; y: number; start: number; dur: number };

export type PixelLoaderProps = {
  onBuilt?: () => void;
  contentReady?: boolean;
  pixelGrid?: readonly string[];
  pixelColor?: string;
  revealSpreadMs?: number;
  popDurationMs?: number;
  className?: string;
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function computePixelSize(container: HTMLDivElement, gridWidth: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = container.getBoundingClientRect();
  return Math.max(2, Math.floor((rect.width * dpr) / gridWidth));
}

export default function PixelLoader({
  onBuilt,
  contentReady = true,
  pixelGrid = PIXEL_GRID,
  pixelColor = "#000",
  revealSpreadMs = DEFAULT_REVEAL_SPREAD,
  popDurationMs = DEFAULT_POP_DURATION,
  className = "",
}: PixelLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onBuiltRef = useRef(onBuilt);
  const pixelsRef = useRef<Pixel[]>([]);
  const builtRef = useRef(false);
  const [built, setBuilt] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const waiting = built && !contentReady && !reducedMotion;

  useEffect(() => {
    onBuiltRef.current = onBuilt;
  }, [onBuilt]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || pixelGrid.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      const timer = window.setTimeout(() => onBuiltRef.current?.(), 400);
      return () => window.clearTimeout(timer);
    }

    const gridHeight = pixelGrid.length;
    const gridWidth = pixelGrid[0].length;
    if (gridWidth === 0 || pixelGrid.some((row) => row.length !== gridWidth))
      return;

    const rng = mulberry32(20260925);
    const centerX = gridWidth / 2;
    const centerY = gridHeight / 2;
    const maxDistance = Math.hypot(centerX, centerY);

    const pixels: Pixel[] = [];
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (pixelGrid[y][x] !== "#") continue;
        const distance = Math.hypot(x - centerX, y - centerY) / maxDistance;
        const key = distance * 0.55 + rng() * 0.45;
        pixels.push({
          x,
          y,
          start: key * revealSpreadMs,
          dur: popDurationMs + rng() * 90,
        });
      }
    }
    pixels.sort((a, b) => a.start - b.start);
    pixelsRef.current = pixels;
    const lastFinish = Math.max(
      ...pixels.map((pixel) => pixel.start + pixel.dur),
    );

    const applySize = () => {
      const pixelSize = computePixelSize(container, gridWidth);
      canvas.width = pixelSize * gridWidth;
      canvas.height = pixelSize * gridHeight;
      return pixelSize;
    };

    let pixelSize = applySize();
    ctx.fillStyle = pixelColor;

    const redrawComplete = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const pixel of pixelsRef.current) {
        ctx.fillRect(
          pixel.x * pixelSize,
          pixel.y * pixelSize,
          pixelSize,
          pixelSize,
        );
      }
    };

    const handleResize = () => {
      pixelSize = applySize();
      ctx.fillStyle = pixelColor;
      if (builtRef.current) redrawComplete();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) {
      redrawComplete();
      const timer = window.setTimeout(() => {
        builtRef.current = true;
        setBuilt(true);
        onBuiltRef.current?.();
      }, 400);
      return () => {
        window.clearTimeout(timer);
        resizeObserver.disconnect();
      };
    }

    let animationFrame = 0;
    let completionTimer = 0;
    const startTime = performance.now();
    let finished = false;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const pixel of pixelsRef.current) {
        if (pixel.start > elapsed) break;
        const progress = Math.min((elapsed - pixel.start) / pixel.dur, 1);
        const size = Math.max(1, Math.round(pixelSize * easeOutBack(progress)));
        const offset = Math.round((pixelSize - size) / 2);
        ctx.fillRect(
          pixel.x * pixelSize + offset,
          pixel.y * pixelSize + offset,
          size,
          size,
        );
      }

      if (!finished && elapsed >= lastFinish + 90) {
        finished = true;
        redrawComplete();
        builtRef.current = true;
        setBuilt(true);
        completionTimer = window.setTimeout(
          () => onBuiltRef.current?.(),
          DONE_DELAY,
        );
        return;
      }
      animationFrame = requestAnimationFrame(frame);
    };

    animationFrame = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(completionTimer);
      resizeObserver.disconnect();
    };
  }, [pixelColor, pixelGrid, popDurationMs, revealSpreadMs]);

  return (
    <div ref={containerRef} className={`pixel-loader ${className}`.trim()}>
      <motion.canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        className="pixel-loader__canvas"
        animate={waiting ? { opacity: [1, 0.82, 1] } : { opacity: 1 }}
        transition={
          waiting
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      />
    </div>
  );
}
