import { Box, Text, type BoxProps } from 'ink';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  width: number;
  borderColor?: BoxProps['borderColor'];
  labelColor?: string;
  children: ReactNode;
}

// 한글/CJK는 터미널에서 2칸 차지
function displayWidth(str: string): number {
  let w = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0) ?? 0;
    if (
      (code >= 0x1100 && code <= 0x115F) ||
      (code >= 0x2E80 && code <= 0x303E) ||
      (code >= 0x3041 && code <= 0x33FF) ||
      (code >= 0x3400 && code <= 0x4DBF) ||
      (code >= 0x4E00 && code <= 0x9FFF) ||
      (code >= 0xA000 && code <= 0xA4CF) ||
      (code >= 0xAC00 && code <= 0xD7A3) ||
      (code >= 0xF900 && code <= 0xFAFF) ||
      (code >= 0xFE30 && code <= 0xFE4F) ||
      (code >= 0xFF00 && code <= 0xFF60) ||
      (code >= 0xFFE0 && code <= 0xFFE6)
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

export default function LabeledBox({
  label,
  width,
  borderColor = 'gray',
  labelColor,
  children,
}: Props) {
  const labelW = displayWidth(label);
  // ╭─ label ─...─╮
  // 양쪽 코너 2칸 + " label " 4칸(라벨 양쪽 공백 + 좌우 dash 1칸씩) 빼고 남는 길이
  const leftDash = 1;
  const rightDash = Math.max(1, width - 2 - leftDash - 2 - labelW);

  return (
    <Box flexDirection="column" width={width}>
      <Box>
        <Text color={borderColor}>{'╭' + '─'.repeat(leftDash) + ' '}</Text>
        <Text color={labelColor ?? borderColor}>{label}</Text>
        <Text color={borderColor}>{' ' + '─'.repeat(rightDash) + '╮'}</Text>
      </Box>
      <Box>
        <Text color={borderColor}>│ </Text>
        <Box width={width - 4}>{children}</Box>
        <Text color={borderColor}> │</Text>
      </Box>
      <Box>
        <Text color={borderColor}>{'╰' + '─'.repeat(width - 2) + '╯'}</Text>
      </Box>
    </Box>
  );
}
