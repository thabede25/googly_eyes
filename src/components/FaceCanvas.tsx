import React, { useEffect, useRef } from 'react';
import { Mood, PALETTE } from '../types';
import { Spring } from '../utils/spring';

interface FaceCanvasProps {
  mood: Mood;
  targetGaze?: { x: number; y: number } | null;
  talkLevel?: number;
  isAwake?: boolean;
  onDoubleTap?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  onTouchMoveGaze?: (gaze: { x: number; y: number } | null) => void;
  className?: string;
}

export const FaceCanvas: React.FC<FaceCanvasProps> = ({
  mood,
  targetGaze,
  talkLevel = 0,
  isAwake = true,
  onDoubleTap,
  onPressStart,
  onPressEnd,
  onTouchMoveGaze,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Springs
  const gazeX = useRef(new Spring(0, 260, 0.82));
  const gazeY = useRef(new Spring(0, 260, 0.82));
  const pupil = useRef(new Spring(1, 160, 0.5));
  const browLift = useRef(new Spring(0, 180, 0.55));
  const browTilt = useRef(new Spring(0, 150, 0.6));
  const lean = useRef(new Spring(0, 60, 0.8));
  const hop = useRef(new Spring(0, 260, 0.35));
  const blush = useRef(new Spring(0.25, 40, 1));
  const squint = useRef(new Spring(0, 150, 0.7));

  // Anim state
  const talkRef = useRef(0);
  const currentMoodRef = useRef<Mood>(mood);
  const blinkStartRef = useRef(-1);
  const doubleBlinkRef = useRef(false);
  const nextBlinkRef = useRef(2.0);
  const nextSaccadeRef = useRef(0);
  const wanderTargetRef = useRef({ x: 0, y: -0.3 });
  const jitterRef = useRef({ x: 0, y: 0 });
  const nextJitterRef = useRef(0);
  const nextHopRef = useRef(6.0);
  const lastTimeRef = useRef<number | null>(null);

  // Sync mood change
  useEffect(() => {
    if (currentMoodRef.current !== mood) {
      currentMoodRef.current = mood;
      const now = performance.now() / 1000;
      blinkStartRef.current = now;
      if (mood !== 'sleepy' && mood !== 'resting') {
        hop.current.velocity += 260;
        pupil.current.velocity += 3;
      }
    }
  }, [mood]);

  // Touch & tap tracking
  const lastTapRef = useRef(0);
  const holdTimeoutRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const now = performance.now();
    if (now - lastTapRef.current < 320) {
      onDoubleTap?.();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      onTouchMoveGaze?.({ x, y });
    }

    holdTimeoutRef.current = window.setTimeout(() => {
      onPressStart?.();
    }, 280);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      onTouchMoveGaze?.({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    }
  };

  const handlePointerUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    onPressEnd?.();
    onTouchMoveGaze?.(null);
  };

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (timeMs: number) => {
      const now = timeMs / 1000;
      const dt = Math.min((now - (lastTimeRef.current ?? now)), 1.0 / 20);
      lastTimeRef.current = now;

      // Handle gaze wander and jitter
      let wantX = 0;
      let wantY = 0;

      if (targetGaze) {
        wantX = targetGaze.x;
        wantY = targetGaze.y;
      } else {
        if (now > nextSaccadeRef.current) {
          wanderTargetRef.current = {
            x: (Math.random() - 0.5) * 1.6,
            y: (Math.random() - 0.6) * 1.2,
          };
          nextSaccadeRef.current = now + 0.6 + Math.random() * 1.6;
        }
        wantX = wanderTargetRef.current.x;
        wantY = wanderTargetRef.current.y;
      }

      if (currentMoodRef.current === 'thinking') {
        wantX = 0.6 + 0.08 * Math.sin(now * 1.3);
        wantY = -0.85;
      }

      if (now > nextJitterRef.current) {
        const amount = !isAwake ? 0.015 : currentMoodRef.current === 'talking' ? 0.07 : currentMoodRef.current === 'thinking' ? 0.05 : 0.02;
        jitterRef.current = {
          x: (Math.random() - 0.5) * 2 * amount,
          y: (Math.random() - 0.5) * 2 * amount,
        };
        nextJitterRef.current = now + 0.5 + Math.random() * 0.9;
      }

      const gx = gazeX.current.step(wantX + jitterRef.current.x, dt);
      const gy = gazeY.current.step(wantY + jitterRef.current.y, dt);

      // Talk smoothing
      let wantTalk = talkLevel;
      if (currentMoodRef.current === 'talking' && talkLevel === 0) {
        wantTalk = 0.5 + 0.5 * Math.sin(now * 19) * Math.sin(now * 7.3);
      }
      talkRef.current += (wantTalk - talkRef.current) * Math.min(1, dt * 25);
      const talk = talkRef.current;

      // Mood values
      let wantPupil = 1.0;
      let wantLift = 0.0;
      let wantTilt = 0.0;
      let wantBlush = 0.25;
      let wantSquint = 0.0;

      switch (currentMoodRef.current) {
        case 'listening':
          wantPupil = 1.12;
          wantLift = 10;
          break;
        case 'talking':
          wantPupil = 1.05;
          wantLift = 6 + talk * 18;
          wantTilt = 0.05 * Math.sin(now * 2.3);
          break;
        case 'pointing':
          wantPupil = 0.95;
          wantLift = -4;
          wantTilt = -0.14;
          break;
        case 'thinking':
          wantPupil = 0.9;
          wantLift = 4;
          wantTilt = 0.22;
          break;
        case 'happy':
          wantPupil = 1.2;
          wantLift = 16;
          wantBlush = 0.85;
          wantSquint = 1.0;
          break;
        case 'resting':
          wantPupil = 0.9;
          wantLift = -8;
          wantBlush = 0.15;
          break;
        case 'sleepy':
          wantPupil = 0.88;
          wantLift = -10;
          wantTilt = 0.12;
          wantBlush = 0.15;
          break;
      }

      const curPupil = pupil.current.step(wantPupil, dt);
      const curLift = browLift.current.step(wantLift, dt);
      const curTilt = browTilt.current.step(wantTilt, dt);
      const curBlush = blush.current.step(wantBlush, dt);
      const curSquint = Math.max(0, Math.min(1, squint.current.step(wantSquint, dt)));
      const curLean = lean.current.step(-gx * 0.045, dt);

      // Idle hops
      if (now > nextHopRef.current) {
        if (talk < 0.05 && currentMoodRef.current !== 'sleepy' && currentMoodRef.current !== 'resting') {
          hop.current.velocity += 180 + Math.random() * 140;
        }
        nextHopRef.current = now + 7 + Math.random() * 7;
      }
      const curHop = hop.current.step(0, dt);

      // Blinks
      const drowsy = currentMoodRef.current === 'sleepy';
      if (now > nextBlinkRef.current) {
        blinkStartRef.current = now;
        doubleBlinkRef.current = !drowsy && Math.random() < 0.25;
        nextBlinkRef.current = now + (drowsy ? 1.6 + Math.random() * 1.4 : 2.0 + Math.random() * 3.0);
      }
      const blinkP = (now - blinkStartRef.current) / (drowsy ? 0.7 : 0.15);
      let closed = blinkP >= 0 && blinkP <= 1 ? Math.sin(Math.PI * blinkP) : 0;
      if (doubleBlinkRef.current && blinkP >= 1.3 && blinkP <= 2.3) {
        closed = Math.sin(Math.PI * (blinkP - 1.3));
      }

      const breathe = Math.sin(now * (currentMoodRef.current === 'resting' ? 1.1 : 1.8));

      // -------------------------------------------------------------
      // DRAW CANVAS (Design space: 844 x 390)
      // -------------------------------------------------------------
      const dWidth = 844;
      const dHeight = 390;

      // Handle high-DPI
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const targetW = rect.width * dpr;
      const targetH = rect.height * dpr;

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const cW = rect.width;
      const cH = rect.height;

      // Fill background pure black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cW, cH);

      const scale = Math.max(cW / dWidth, cH / dHeight);
      ctx.translate((cW - dWidth * scale) / 2, cH - dHeight * scale);
      ctx.scale(scale, scale);

      // Body bounds & bounce
      const bounce = -talk * 16 + breathe * 3 - curHop;
      const body = { x: 12, y: 44 + bounce, width: 820, height: 700 };
      const pivot = { x: body.x + body.width / 2, y: body.y + body.height };

      ctx.save();
      ctx.translate(pivot.x, pivot.y);
      ctx.rotate(curLean);
      const stretch = 1 + Math.min(0.03, Math.max(-0.03, curHop / 900));
      ctx.scale(2 - stretch, stretch);
      ctx.translate(-pivot.x, -pivot.y);

      // Create blob path
      const createBlobPath = (b: { x: number; y: number; width: number; height: number }) => {
        const w = b.width;
        const h = b.height;
        const tl = { width: 0.52 * w, height: 0.58 * h };
        const tr = { width: 0.48 * w, height: 0.56 * h };
        const br = { width: 0.46 * w, height: 0.44 * h };
        const bl = { width: 0.54 * w, height: 0.42 * h };
        const k = 0.5523;

        const path = new Path2D();
        path.moveTo(b.x + tl.width, b.y);
        path.lineTo(b.x + w - tr.width, b.y);
        path.bezierCurveTo(
          b.x + w - tr.width * (1 - k), b.y,
          b.x + w, b.y + tr.height * (1 - k),
          b.x + w, b.y + tr.height
        );
        path.lineTo(b.x + w, b.y + h - br.height);
        path.bezierCurveTo(
          b.x + w, b.y + h - br.height * (1 - k),
          b.x + w - br.width * (1 - k), b.y + h,
          b.x + w - br.width, b.y + h
        );
        path.lineTo(b.x + bl.width, b.y + h);
        path.bezierCurveTo(
          b.x + bl.width * (1 - k), b.y + h,
          b.x, b.y + h - bl.height * (1 - k),
          b.x, b.y + h - bl.height
        );
        path.lineTo(b.x, b.y + tl.height);
        path.bezierCurveTo(
          b.x, b.y + tl.height * (1 - k),
          b.x + tl.width * (1 - k), b.y,
          b.x + tl.width, b.y
        );
        path.closePath();
        return path;
      };

      const blobPath = createBlobPath(body);

      // Glow shadow
      ctx.save();
      ctx.shadowColor = 'rgba(108, 134, 245, 0.45)';
      ctx.shadowBlur = 45;
      ctx.shadowOffsetY = -10;
      ctx.fillStyle = PALETTE.berry3;
      ctx.fill(blobPath);
      ctx.restore();

      // Blueberry linear gradient fill (150 degrees)
      const grad = ctx.createLinearGradient(
        body.x + 0.25 * body.width,
        body.y + 0.067 * body.height,
        body.x + 0.75 * body.width,
        body.y + 0.933 * body.height
      );
      grad.addColorStop(0, PALETTE.berry1);
      grad.addColorStop(0.34, PALETTE.berry2);
      grad.addColorStop(0.68, PALETTE.berry3);
      grad.addColorStop(1, PALETTE.berry4);

      ctx.fillStyle = grad;
      ctx.fill(blobPath);

      // Radial soft shine clipped to blob
      ctx.save();
      ctx.clip(blobPath);
      const shineGrad = ctx.createRadialGradient(
        body.x + 246, body.y + 126, 0,
        body.x + 246, body.y + 126, 243
      );
      shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shineGrad;
      ctx.fill(blobPath);

      // Glossy sparkle on head
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(body.x + 213, body.y + 51, 23, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();
      ctx.restore();

      ctx.restore(); // end clip

      // Crown on top of his head
      const crownBox = {
        x: body.x + 368,
        y: body.y - 20 - curLift * 0.3,
        w: 84,
        h: 56,
      };
      const crownPts = [
        [30, 4], [36, 16], [52, 12], [40, 24], [46, 36],
        [30, 28], [14, 36], [20, 24], [8, 12], [24, 16]
      ];
      ctx.beginPath();
      crownPts.forEach(([px, py], i) => {
        const cx = crownBox.x + (px / 60) * crownBox.w;
        const cy = crownBox.y + (py / 40) * crownBox.h;
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.closePath();
      ctx.fillStyle = PALETTE.nose;
      ctx.fill();

      // Eyes positions
      const eyeY = body.y + 157;
      const eyes = [
        { x: body.x + 280, y: eyeY },
        { x: body.x + 540, y: eyeY },
      ];
      const squash = 1 - talk * 0.12;

      // Blushy rosy cheeks
      eyes.forEach((c, i) => {
        const side = i === 0 ? -1 : 1;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(c.x - 45 + side * 62 + 45, c.y + 96 + 21, 45, 21, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 166, 216, ${0.25 + 0.45 * curBlush})`;
        ctx.filter = 'blur(10px)';
        ctx.fill();
        ctx.restore();
      });

      // Eyebrows & Eyes
      eyes.forEach((c, i) => {
        const side = i === 0 ? -1 : 1;

        // Eyebrows
        ctx.save();
        const browY = c.y - 112 - Math.min(18, Math.max(-10, curLift)) * 0.7;
        ctx.translate(c.x + side * 6, browY);
        const thinkingBrow = currentMoodRef.current === 'thinking' && i === 1 ? -0.25 : 0;
        ctx.rotate(curTilt * side * -1 + thinkingBrow);
        ctx.beginPath();
        ctx.moveTo(-38, 6);
        ctx.quadraticCurveTo(0, -12, 38, 6);
        ctx.strokeStyle = PALETTE.nose;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // Eyes rendering
        if (currentMoodRef.current === 'resting') {
          // Peacefully closed: soft downward curve
          ctx.beginPath();
          ctx.moveTo(c.x - 62, c.y + 6);
          ctx.quadraticCurveTo(c.x, c.y + 52, c.x + 62, c.y + 6);
          ctx.strokeStyle = PALETTE.ink;
          ctx.lineWidth = 18;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (currentMoodRef.current === 'happy' && curSquint > 0.6) {
          // Joyful smiling squint arc
          ctx.beginPath();
          ctx.moveTo(c.x - 60, c.y + 34);
          ctx.quadraticCurveTo(c.x, c.y - 54, c.x + 60, c.y + 34);
          ctx.strokeStyle = PALETTE.ink;
          ctx.lineWidth = 24;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          const open = Math.max(0.06, 1 - closed) * squash;
          const whiteRadiusX = 95;
          const whiteRadiusY = 95 * open;

          ctx.beginPath();
          ctx.ellipse(c.x, c.y, whiteRadiusX, whiteRadiusY, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          if (open > 0.2) {
            ctx.save();
            // Clip to eye white
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, whiteRadiusX, whiteRadiusY, 0, 0, Math.PI * 2);
            ctx.clip();

            // Pupil position
            let pgX = gx;
            let pgY = gy;
            const len = Math.hypot(pgX, pgY);
            if (len > 1) {
              pgX /= len;
              pgY /= len;
            }
            const reach = 50;
            const r = 46 * curPupil;
            let pupilX = c.x + pgX * reach - side * 3;
            let pupilY = c.y + pgY * reach * open;
            if (currentMoodRef.current === 'sleepy') {
              pupilY = Math.max(pupilY, c.y) + 28;
            }

            // Draw pupil
            ctx.beginPath();
            ctx.arc(pupilX, pupilY, r, 0, Math.PI * 2);
            ctx.fillStyle = PALETTE.ink;
            ctx.fill();

            // Catchlight 1 (big top-left)
            ctx.beginPath();
            ctx.arc(pupilX - r * 0.58 + r * 0.28, pupilY - r * 0.72 + r * 0.28, r * 0.28, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Catchlight 2 (small bottom-right)
            ctx.beginPath();
            ctx.arc(pupilX + r * 0.28 + r * 0.12, pupilY + r * 0.22 + r * 0.12, r * 0.12, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fill();

            // Smiling cheeks push up from below
            if (curSquint > 0.02) {
              ctx.beginPath();
              ctx.ellipse(c.x, c.y + 95 * open - 70 * curSquint + 80, 110, 80, 0, 0, Math.PI * 2);
              ctx.fillStyle = PALETTE.berry2;
              ctx.fill();
            }

            // Heavy droopy lids when sleepy
            if (currentMoodRef.current === 'sleepy') {
              const droop = 0.5 + 0.06 * Math.sin(now * 1.3);
              const lidH = whiteRadiusY * 2 * droop + 10;
              ctx.fillStyle = PALETTE.berry2;
              ctx.fillRect(c.x - 100, c.y - whiteRadiusY - 10, 200, lidH);
              ctx.beginPath();
              ctx.moveTo(c.x - 92, c.y - whiteRadiusY + whiteRadiusY * 2 * droop);
              ctx.lineTo(c.x + 92, c.y - whiteRadiusY + whiteRadiusY * 2 * droop);
              ctx.strokeStyle = 'rgba(28, 31, 102, 0.7)';
              ctx.lineWidth = 8;
              ctx.lineCap = 'round';
              ctx.stroke();
            }

            // Soft upper lid when pointing
            if (currentMoodRef.current === 'pointing') {
              ctx.fillStyle = PALETTE.berry2;
              ctx.fillRect(c.x - 100, c.y - whiteRadiusY - 20, 200, 40);
            }

            ctx.restore(); // end eye clip
          }
        }
      });

      // Resting: Floating Z's
      if (currentMoodRef.current === 'resting') {
        for (let i = 0; i < 3; i++) {
          const phase = ((now * 0.35 + i / 3) % 1 + 1) % 1;
          const size = 26 + i * 8;
          const zX = body.x + 660 + phase * 70 + Math.sin(phase * 6) * 8;
          const zY = body.y + 90 - phase * 110;
          ctx.save();
          ctx.font = `bold ${size}px 'Fredoka', cursive, sans-serif`;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * Math.sin(Math.PI * phase)})`;
          ctx.fillText('z', zX, zY);
          ctx.restore();
        }
      }

      // Thinking: Animated dots
      if (currentMoodRef.current === 'thinking') {
        for (let i = 0; i < 3; i++) {
          const wobble = Math.sin(now * 3 + i) * 4;
          const dotX = body.x + 690 + i * 26 + 8;
          const dotY = body.y + 40 - i * 12 + wobble + 8;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${1 - i * 0.3})`;
          ctx.fill();
        }
      }

      // Mouth / nose
      const noseW = 60 - talk * 8;
      const noseH = 38 + talk * 34;
      const noseX = body.x + 410 - noseW / 2;
      const noseY = body.y + 272 - talk * 6;

      if (currentMoodRef.current === 'happy' && talk < 0.1) {
        ctx.beginPath();
        ctx.moveTo(noseX - 8, noseY + 8);
        ctx.quadraticCurveTo(noseX + noseW / 2, noseY + 58, noseX + noseW + 8, noseY + 8);
        ctx.closePath();
        ctx.fillStyle = PALETTE.nose;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(noseX + noseW / 2, noseY + noseH / 2, noseW / 2, noseH / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE.nose;
        ctx.fill();

        if (talk > 0.25) {
          ctx.beginPath();
          const tW = noseW * 0.56;
          const tH = noseH * 0.3;
          ctx.ellipse(noseX + noseW / 2, noseY + noseH - tH / 2 - 2, tW / 2, tH / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(229, 139, 196, 0.9)';
          ctx.fill();
        }
      }

      ctx.restore(); // end body transform
      ctx.restore(); // end main canvas transform

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [targetGaze, talkLevel, isAwake]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`block w-full h-full cursor-pointer touch-none select-none ${className}`}
    />
  );
};
