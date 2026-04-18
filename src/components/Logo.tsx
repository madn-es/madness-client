import { useEffect, useState } from "react";
import { Text, Box } from "ink";

// 여기서 아스키아트를 바꿔보세요
const LOGO = `
 ██████   ██████               █████
▒▒██████ ██████               ▒▒███
 ▒███▒█████▒███   ██████    ███████  ████████    ██████   █████   █████
 ▒███▒▒███ ▒███  ▒▒▒▒▒███  ███▒▒███ ▒▒███▒▒███  ███▒▒███ ███▒▒   ███▒▒
 ▒███ ▒▒▒  ▒███   ███████ ▒███ ▒███  ▒███ ▒███ ▒███████ ▒▒█████ ▒▒█████
 ▒███      ▒███  ███▒▒███ ▒███ ▒███  ▒███ ▒███ ▒███▒▒▒   ▒▒▒▒███ ▒▒▒▒███
 █████     █████▒▒████████▒▒████████ ████ █████▒▒██████  ██████  ██████
▒▒▒▒▒     ▒▒▒▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒ ▒▒▒▒ ▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒▒▒
`.trimStart();

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function Logo() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const lines = LOGO.split('\n');

  return (
    <Box flexDirection="column">
      {lines.map((line, y) => (
        <Box key={y}>
          {[...line].map((ch, x) => {
            if (ch === ' ') return <Text key={x}> </Text>;
            const hue = (x * 6 + y * 4 - tick * 8 + 360 * 10) % 360;
            return <Text key={x} color={hslToHex(hue, 90, 60)} bold>{ch}</Text>;
          })}
        </Box>
      ))}
    </Box>
  );
}
