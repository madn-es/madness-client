import { Box, Text } from 'ink';
import { useTheme, getAccent } from '../theme.js';

interface Props {
  label: string;
  focused?: boolean;
  width?: number;
}

export default function Button({ label, focused = false, width = 24 }: Props) {
  const { theme } = useTheme();
  const accent = getAccent(theme);
  return (
    <Box
      borderStyle="round"
      borderColor={focused ? accent : 'gray'}
      width={width}
      justifyContent="center"
    >
      <Text color={focused ? accent : 'white'}>{label}</Text>
    </Box>
  );
}
