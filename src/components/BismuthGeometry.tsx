import { motion } from "framer-motion";

interface BismuthBlockProps {
  size: number;
  x: string;
  y: string;
  color: string;
  delay: number;
  rotation?: number;
}

const BismuthBlock = ({ size, x, y, color, delay, rotation = 0 }: BismuthBlockProps) => (
  <motion.div
    className="absolute"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      backgroundColor: color,
      opacity: 0.08,
    }}
    animate={{
      rotate: [rotation, rotation + 360],
      y: [0, -15, 0],
    }}
    transition={{
      rotate: { duration: 40, repeat: Infinity, ease: "linear", delay },
      y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
    }}
  >
    <div
      className="absolute"
      style={{
        width: size * 0.6,
        height: size * 0.6,
        top: size * 0.1,
        left: size * 0.1,
        backgroundColor: color,
        opacity: 0.3,
      }}
    />
  </motion.div>
);

export const BismuthGeometry = () => {
  const blocks: BismuthBlockProps[] = [
    { size: 120, x: "5%", y: "10%", color: "hsl(174, 60%, 45%)", delay: 0 },
    { size: 80, x: "80%", y: "20%", color: "hsl(270, 60%, 55%)", delay: 2 },
    { size: 100, x: "70%", y: "60%", color: "hsl(330, 70%, 60%)", delay: 4 },
    { size: 60, x: "15%", y: "70%", color: "hsl(43, 90%, 55%)", delay: 1 },
    { size: 90, x: "50%", y: "40%", color: "hsl(190, 70%, 50%)", delay: 3 },
    { size: 70, x: "90%", y: "80%", color: "hsl(270, 60%, 55%)", delay: 5 },
    { size: 50, x: "30%", y: "85%", color: "hsl(174, 60%, 45%)", delay: 2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blocks.map((block, i) => (
        <BismuthBlock key={i} {...block} rotation={i * 45} />
      ))}
    </div>
  );
};

export const BismuthSeparator = () => (
  <div className="relative h-32 overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center gap-8">
      {[
        { color: "hsl(174, 60%, 45%)", size: 40, delay: 0 },
        { color: "hsl(270, 60%, 55%)", size: 30, delay: 0.5 },
        { color: "hsl(330, 70%, 60%)", size: 50, delay: 1 },
        { color: "hsl(43, 90%, 55%)", size: 35, delay: 1.5 },
        { color: "hsl(190, 70%, 50%)", size: 45, delay: 2 },
      ].map((block, i) => (
        <motion.div
          key={i}
          style={{
            width: block.size,
            height: block.size,
            backgroundColor: block.color,
            opacity: 0.15,
          }}
          animate={{
            rotate: [0, 360],
            y: [0, -10, 0],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear", delay: block.delay },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: block.delay },
          }}
        />
      ))}
    </div>
  </div>
);
