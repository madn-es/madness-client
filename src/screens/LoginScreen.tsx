import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import open from 'open';
import { login } from '../api/auth.js';
import Button from '../components/Button.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import Logo, { type LogoSize } from '../components/Logo.js';
import { useTheme, getAccent } from '../theme.js';

type Field = 'email' | 'password' | 'submit' | 'signup' | 'google';
const FIELDS: Field[] = ['email', 'password', 'submit', 'signup', 'google'];

type Mode = 'lg' | 'md' | 'sm' | 'stack';

function getMode(columns: number): Mode {
  if (columns >= 115) return 'lg';
  if (columns >= 80)  return 'md';
  if (columns >= 60)  return 'sm';
  return 'stack';
}

const RIGHT_WIDTH: Record<Mode, number> = {
  lg: 40, md: 34, sm: 24, stack: 0,
};

const LOGO_SIZE: Record<Mode, LogoSize> = {
  lg: 'lg', md: 'md', sm: 'sm', stack: 'stack',
};

// 컨텐츠(입력칸, 버튼) 최대 너비
const CONTENT_MAX = 34;

interface Props {
  onLogin: (token: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const { columns, rows } = useTerminalSize();
  const { theme } = useTheme();
  const accent = getAccent(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focus, setFocus] = useState<Field>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mode = getMode(columns);
  const rightWidth = RIGHT_WIDTH[mode];
  const leftWidth = columns - rightWidth - 3;
  const isStack = mode === 'stack' || mode === 'sm';
  const formWidth = isStack ? Math.min(columns - 4, 34) : rightWidth;
  // 컨텐츠는 폼 안에서 최대 28까지만, 가운데 정렬
  const contentWidth = Math.min(formWidth - 4, CONTENT_MAX);

  function submit() {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력하세요.');
      return;
    }
    setLoading(true);
    setError('');
    login(email, password)
      .then(result => onLogin(result.token))
      .catch((e: any) => {
        setError(e.message ?? '알 수 없는 오류');
        setLoading(false);
      });
  }

  useInput((input, key) => {
    if (loading) return;
    const idx = FIELDS.indexOf(focus);
    if (key.tab || key.downArrow || input === 'j') {
      setFocus(FIELDS[(idx + 1) % FIELDS.length]);
      setError('');
    }
    if (key.upArrow || input === 'k') {
      setFocus(FIELDS[(idx - 1 + FIELDS.length) % FIELDS.length]);
      setError('');
    }
    if (key.return) {
      if (focus === 'email' && email) { setFocus('password'); return; }
      if (focus === 'password' || focus === 'submit') { submit(); return; }
      if (focus === 'signup') { setError('회원가입 — 준비 중'); return; }
      if (focus === 'google') { open('https://google.com'); return; }
    }
  });

  const form = (
    <Box width={formWidth} flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
      <Box width={contentWidth} flexDirection="column">
        <Text bold color="white">로그인</Text>
        <Text dimColor>계정에 접속하세요</Text>
      </Box>

      <Box width={contentWidth} flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text color={focus === 'email' ? accent : 'gray'}>이메일</Text>
          <Box borderStyle="round" borderColor={focus === 'email' ? accent : 'gray'} paddingX={1}>
            <TextInput
              value={email}
              onChange={setEmail}
              focus={focus === 'email' && !loading}
              placeholder="user@example.com"
            />
          </Box>
        </Box>

        <Box flexDirection="column">
          <Text color={focus === 'password' ? accent : 'gray'}>비밀번호</Text>
          <Box borderStyle="round" borderColor={focus === 'password' ? accent : 'gray'} paddingX={1}>
            <TextInput
              value={password}
              onChange={setPassword}
              focus={focus === 'password' && !loading}
              mask="*"
              placeholder="••••••••"
            />
          </Box>
        </Box>
      </Box>

      <Box width={contentWidth} flexDirection="column" gap={1}>
        <Button label="로그인" focused={focus === 'submit'} width={contentWidth} />
        <Button label="회원가입" focused={focus === 'signup'} width={contentWidth} />
        <Button label="Google로 로그인" focused={focus === 'google'} width={contentWidth} />
      </Box>

      <Box width={contentWidth}>
        {loading ? (
          <Text color="yellow">로그인 중...</Text>
        ) : error ? (
          <Text color="red" wrap="wrap">{error}</Text>
        ) : (
          <Text dimColor>↑↓ 이동  Enter 선택</Text>
        )}
      </Box>
    </Box>
  );

  if (isStack) {
    return (
      <Box height={rows} flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
        <Logo size={LOGO_SIZE[mode]} />
        {form}
      </Box>
    );
  }

  return (
    <Box height={rows}>
      <Box width={leftWidth} alignItems="center" justifyContent="center">
        <Logo size={LOGO_SIZE[mode]} />
      </Box>
      <Box flexDirection="column" alignItems="center">
        <Text dimColor>{'│\n'.repeat(rows)}</Text>
      </Box>
      {form}
    </Box>
  );
}
