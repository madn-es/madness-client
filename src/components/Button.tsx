import { Box, Text } from 'ink';

interface Props {
  label: string;
  focused?: boolean;
  width?: number;
}

export default function Button({ label, focused = false, width = 24 }: Props) {
  return (
    <Box
      borderStyle="round"
      borderColor={focused ? 'cyan' : 'gray'}
      width={width}
      justifyContent="center"
    >
      <Text color={focused ? 'cyan' : 'white'}>{label}</Text>
    </Box>
  );
}
