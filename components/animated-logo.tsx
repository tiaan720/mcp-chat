"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface AnimatedLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function AnimatedLogo({
  width = 50,
  height = 50,
  className = "",
}: AnimatedLogoProps) {
  const { theme } = useTheme();

  // Color schemes based on theme
  const getColors = () => {
    const isDark = theme === "dark" || theme === "black" || theme === "tron" || theme === "slate";
    return {
      // Warm copper/orange colors
      outerCircleLight: "#E89A6B",
      outerCircleDark: "#C17348",
      innerCircle: "#A35D38",
      glow: isDark ? "rgba(209, 122, 71, 0.4)" : "rgba(209, 122, 71, 0.2)",
    };
  };

  const colors = getColors();

  // SVG coordinates
  const center = { x: 50, y: 50 };
  const outerRadius = 32;
  const innerRadius = 22;
  
  // Three nodes forming a triangle INSIDE the circle
  const triangleRadius = 12; // Distance from center
  const rotationOffset = -30; // Rotate triangle 30 degrees counterclockwise
  const triangleNodes = [
    { 
      x: center.x + triangleRadius * Math.cos((-90 + rotationOffset) * Math.PI / 180), 
      y: center.y + triangleRadius * Math.sin((-90 + rotationOffset) * Math.PI / 180) 
    }, // Top (now at ~11 o'clock)
    { 
      x: center.x + triangleRadius * Math.cos((150 + rotationOffset) * Math.PI / 180), 
      y: center.y + triangleRadius * Math.sin((150 + rotationOffset) * Math.PI / 180) 
    }, // Bottom left
    { 
      x: center.x + triangleRadius * Math.cos((30 + rotationOffset) * Math.PI / 180), 
      y: center.y + triangleRadius * Math.sin((30 + rotationOffset) * Math.PI / 180) 
    }, // Bottom right
  ];

  // Outer nodes for the arc (at 12 and 9 o'clock)
  const outerNodeRadius = outerRadius + 3;
  const outerNode12 = { 
    x: center.x, 
    y: center.y - outerNodeRadius 
  }; // 12 o'clock
  const outerNode9 = { 
    x: center.x - outerNodeRadius, 
    y: center.y 
  }; // 9 o'clock

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      style={{ width, height, display: "inline-block" }}
    >
      <svg
        viewBox="0 0 100 100"
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Radial gradient for outer circle - 3D sphere effect */}
          <radialGradient id="outerSphere" cx="45%" cy="35%">
            <stop offset="0%" stopColor={colors.outerCircleLight} />
            <stop offset="100%" stopColor={colors.outerCircleDark} />
          </radialGradient>

          {/* Soft glow filter */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow filter */}
          <filter id="nodeGlow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Atmospheric glow around logo */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={38}
          fill={colors.glow}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
          style={{ filter: "blur(12px)" }}
        />

        {/* Outer circle with gradient */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={outerRadius}
          fill="url(#outerSphere)"
          animate={{
            opacity: [0.98, 1, 0.98],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
          style={{ filter: "url(#softGlow)" }}
        />

        {/* Inner darker circle */}
        <circle
          cx={center.x}
          cy={center.y}
          r={innerRadius}
          fill={colors.innerCircle}
          opacity="0.9"
        />

        {/* Outer arc connecting 12 and 9 o'clock (quarter circle) */}
        <motion.path
          d={`M ${outerNode12.x} ${outerNode12.y} A ${outerNodeRadius} ${outerNodeRadius} 0 0 0 ${outerNode9.x} ${outerNode9.y}`}
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.7, 0.95, 0.7],
          }}
          transition={{
            pathLength: { duration: 1, delay: 0.3, ease: "easeOut" as const },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
          }}
          style={{ 
            filter: "url(#nodeGlow)",
            strokeDasharray: "4 2",
          }}
        />

        {/* Triangle connections between inner nodes */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Line from node 0 to node 1 */}
          <motion.line
            x1={triangleNodes[0].x}
            y1={triangleNodes[0].y}
            x2={triangleNodes[1].x}
            y2={triangleNodes[1].y}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ 
              pathLength: { duration: 0.5, delay: 0.6 },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
            }}
          />
          {/* Line from node 1 to node 2 */}
          <motion.line
            x1={triangleNodes[1].x}
            y1={triangleNodes[1].y}
            x2={triangleNodes[2].x}
            y2={triangleNodes[2].y}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ 
              pathLength: { duration: 0.5, delay: 0.7 },
              opacity: { duration: 3, repeat: Infinity, delay: 1, ease: "easeInOut" as const }
            }}
          />
          {/* Line from node 2 to node 0 */}
          <motion.line
            x1={triangleNodes[2].x}
            y1={triangleNodes[2].y}
            x2={triangleNodes[0].x}
            y2={triangleNodes[0].y}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ 
              pathLength: { duration: 0.5, delay: 0.8 },
              opacity: { duration: 3, repeat: Infinity, delay: 2, ease: "easeInOut" as const }
            }}
          />
        </motion.g>

        {/* Three white nodes forming the triangle */}
        {triangleNodes.map((node, index) => (
          <motion.g key={`triangle-node-${index}`}>
            {/* Node glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="5"
              fill="rgba(255, 255, 255, 0.4)"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.8,
                ease: "easeInOut" as const,
              }}
              style={{ filter: "blur(2px)" }}
            />
            {/* Main node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="3.2"
              fill="#FFFFFF"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{
                scale: {
                  duration: 0.3,
                  delay: 0.9 + index * 0.1,
                },
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.8,
                ease: "easeInOut" as const,
              }}
            />
          </motion.g>
        ))}

        {/* Outer nodes at 12 and 9 o'clock */}
        {[outerNode12, outerNode9].map((node, index) => (
          <motion.g key={`outer-node-${index}`}>
            {/* Node glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="4"
              fill="rgba(255, 255, 255, 0.5)"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut" as const,
              }}
              style={{ filter: "blur(2px)" }}
            />
            {/* Main node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="2.5"
              fill="#FFFFFF"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + index * 0.1,
                type: "spring" as const,
                stiffness: 400,
              }}
            />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}

// Text component for "MNI" with subtle animation
interface AnimatedLogoTextProps {
  collapsed?: boolean;
}

export function AnimatedLogoText({ collapsed = false }: AnimatedLogoTextProps) {
  if (collapsed) return null;

  return (
    <motion.span
      className="font-semibold text-lg"
      style={{ color: "#FF9A56" }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
    >
      MNI
    </motion.span>
  );
}

// Combined component for easy use
interface AnimatedLogoWithTextProps {
  collapsed?: boolean;
  logoWidth?: number;
  logoHeight?: number;
}

export function AnimatedLogoWithText({
  collapsed = false,
  logoWidth,
  logoHeight,
}: AnimatedLogoWithTextProps) {
  const width = collapsed ? 18 : (logoWidth || 50);
  const height = collapsed ? 18 : (logoHeight || 50);

  return (
    <div className="flex items-center gap-1">
      <AnimatedLogo
        width={width}
        height={height}
      />
      <AnimatedLogoText collapsed={collapsed} />
    </div>
  );
}
