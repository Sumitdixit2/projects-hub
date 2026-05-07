"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

type CursorStep = {
  x: string;
  y: string;
  duration: number; // Duration of the movement burst
  pause: number;    // Dwell time after arriving
  click?: boolean;  // Whether to trigger a click ripple upon arrival
};

type CursorProps = {
  id: string;
  name: string;
  color: string;
  initialPos: { x: string; y: string };
  sequence: CursorStep[];
};

// Orchestrated behavioral scripts for realistic human interaction
const CURSORS: CursorProps[] = [
  {
    id: "alex",
    name: "Alex",
    color: "#06b6d4", // Muted Cyan
    initialPos: { x: "110%", y: "20%" },
    sequence: [
      { x: "45%", y: "15%", duration: 0.7, pause: 2.5 },         // Inspect "Active Projects" card
      { x: "47%", y: "17%", duration: 0.3, pause: 0.8 },         // Micro-hesitation/reading
      { x: "72%", y: "15%", duration: 0.6, pause: 3, click: true }, // Select "System Load" card
      { x: "90%", y: "15%", duration: 0.5, pause: 1.5 },         // Move to "Client Requests"
      { x: "110%", y: "20%", duration: 0.9, pause: 4 },          // Idle out of frame
    ]
  },
  {
    id: "sarah",
    name: "Sarah",
    color: "#8b5cf6", // Soft Violet
    initialPos: { x: "50%", y: "110%" },
    sequence: [
      { x: "50%", y: "65%", duration: 0.8, pause: 1.5 },         // Enter Ledger area
      { x: "52%", y: "70%", duration: 0.4, pause: 0.6 },         // Reading row 1
      { x: "53%", y: "82%", duration: 0.5, pause: 2.5, click: true }, // Click row 2
      { x: "82%", y: "80%", duration: 0.6, pause: 1.2 },         // Move right to Actions
      { x: "82%", y: "82%", duration: 0.2, pause: 2, click: true }, // Click action menu
      { x: "50%", y: "110%", duration: 0.9, pause: 5 },          // Exit frame
    ]
  },
  {
    id: "devops",
    name: "System",
    color: "#10b981", // Desaturated Green
    initialPos: { x: "-10%", y: "40%" },
    sequence: [
      { x: "12%", y: "30%", duration: 0.6, pause: 1 },           // Enter sidebar
      { x: "12%", y: "42%", duration: 0.4, pause: 0.5 },         // Hover down navigation
      { x: "13%", y: "46%", duration: 0.3, pause: 2, click: true }, // Select navigation item
      { x: "11%", y: "45%", duration: 0.3, pause: 1.5 },         // Hesitation
      { x: "-10%", y: "50%", duration: 0.7, pause: 6 },          // Exit left
    ]
  }
];

function AnimatedCursor({ data }: { data: CursorProps }) {
  const [scope, animate] = useAnimate();
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    let isRunning = true;

    const runSequence = async () => {
      // Instantly position outside frame before entering
      if (!scope.current) return;
      await animate(scope.current, { left: data.initialPos.x, top: data.initialPos.y, opacity: 0 }, { duration: 0 });
      await animate(scope.current, { opacity: 1 }, { duration: 0.3 });

      while (isRunning) {
        for (const step of data.sequence) {
          if (!isRunning || !scope.current) break;
          
          // Human-like motion: snappy start, slow deceleration (easing)
          await animate(scope.current, { left: step.x, top: step.y }, { 
            duration: step.duration, 
            ease: [0.25, 1, 0.5, 1] 
          });
          
          // Trigger interactive feedback ring
          if (step.click && isRunning) {
            setIsClicking(true);
            setTimeout(() => {
              if (isRunning) setIsClicking(false);
            }, 400); // Pulse duration
          }

          // Dwell time
          if (isRunning) {
            await new Promise(resolve => setTimeout(resolve, step.pause * 1000));
          }
        }
      }
    };

    runSequence();

    return () => { isRunning = false; };
  }, [animate, data, scope]);

  return (
    <div 
      ref={scope} 
      className="absolute z-50 flex flex-col items-start pointer-events-none -translate-x-1/2 -translate-y-1/2"
    >
      {/* Interaction Feedback Pulse */}
      {isClicking && (
        <motion.div 
          className="absolute left-[2px] top-[2px] rounded-full z-0"
          style={{ backgroundColor: data.color }}
          initial={{ width: 14, height: 14, opacity: 0.8 }}
          animate={{ width: 45, height: 45, opacity: 0, x: -15, y: -15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Cursor Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={data.color}
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-md relative z-10"
        style={{ transform: "rotate(-10deg)", transformOrigin: "top left" }}
      >
        <path d="M4 4l16 5.333-6.667 2.667L10.667 20z" />
      </svg>
      
      {/* Label Tag */}
      <div
        className="mt-1.5 ml-4 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide text-white shadow-md border border-white/10 backdrop-blur-md relative z-10"
        style={{ backgroundColor: data.color }}
      >
        {data.name}
      </div>
    </div>
  );
}

export function CollaborativeCursors() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden rounded-xl">
      {CURSORS.map((cursor) => (
        <AnimatedCursor key={cursor.id} data={cursor} />
      ))}
    </div>
  );
}
