import { useEffect, useState } from "react";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";
import { useTheme, hslToHex } from "../theme.js";

export type LogoSize = "lg" | "md" | "sm" | "stack";

interface Props {
  size?: LogoSize;
}

// size → ink-big-text font 매핑
const FONT: Record<LogoSize, "block" | "simpleBlock" | "simple" | "tiny"> = {
  lg: "block",
  md: "simpleBlock",
  sm: "simple",
  stack: "tiny",
};

export default function Logo({ size = "lg" }: Props) {
  const { theme } = useTheme();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 100), 120);
    return () => clearInterval(id);
  }, []);

  // 테마 색상 기반 그라디언트 (lightness wave)
  const phase = tick * 0.15;
  const colors = [0, 1, 2, 3, 4].map((i) => {
    const l = 45 + Math.sin(phase + i * 0.8) * 25 + 15;
    return hslToHex(theme.hue, theme.saturation, l);
  });

  return (
    <Gradient colors={colors}>
      <BigText text="madness" font={FONT[size]} />
    </Gradient>
  );
}
