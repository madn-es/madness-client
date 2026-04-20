import { useEffect, useState } from "react";
import { Text, Box } from "ink";

// lg / md / sm 모두 같은 로고
const LOGO = `\
  __  __           _
 |  \\/  | __ _  __| |_ __   ___  ___ ___
 | |\\/| |/ _\` |/ _\` | '_ \\ / _ \\/ __/ __|
 | |  | | (_| | (_| | | | |  __/\\__ \\__ \\
 |_|  |_|\\__,_|\\__,_|_| |_|\\___||___/___/`;

// 세로 스택일 때만 사용하는 작은 로고
const LOGO_STACK = `\
  __  __         _
 |  \\/  |__ _ __| |_ _  ___ ______
 | |\\/| / _\` / _\` | ' \\/ -_|_-<_-<
 |_|  |_\\__,_\\__,_|_||_\\___/__/__/`;

export type LogoSize = 'lg' | 'md' | 'sm' | 'stack';

interface Props {
  size?: LogoSize;
}

// 고정 hue 단색, lightness 만 파도치게
const HUE = 195; // 시안 계열
const SAT = 100;

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

export default function Logo({ size = 'lg' }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 100), 80);
    return () => clearInterval(id);
  }, []);

  const art = size === 'stack' ? LOGO_STACK : LOGO;
  const lines = art.split('\n');

  return (
    <Box flexDirection="column">
      {lines.map((line, y) => (
        <Box key={y}>
          {[...line].map((ch, x) => {
            if (ch === ' ') return <Text key={x}> </Text>;
            // lightness를 sin 파도로: 30~80 사이를 흐르게
            const wave = Math.sin((x * 0.4 + y * 0.8 - tick * 0.4) );
            const lightness = 30 + wave * 25 + 25;
            return <Text key={x} color={hslToHex(HUE, SAT, lightness)}>{ch}</Text>;
          })}
        </Box>
      ))}
    </Box>
  );
}
