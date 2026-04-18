import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import open from 'open';
import { login } from '../api/auth.js';
import Button from '../components/Button.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import Logo from '../components/Logo.js';

type Field = 'email' | 'password' | 'submit' | 'signup' | 'google';

const FIELDS: Field[] = ['email', 'password', 'submit', 'signup', 'google'];

interface Props {
  onLogin: (token: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const { columns, rows } = useTerminalSize();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focus, setFocus] = useState<Field>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 100컬럼 이상이면 좌우 분할, 미만이면 세로 스택
  const isWide = columns >= 100;
  const rightWidth = 38;
  const leftWidth = columns - rightWidth - 3;

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

  const formWidth = isWide ? rightWidth : columns - 4;

  const form = (
    <Box width={formWidth} flexDirection="column" justifyContent="center" paddingX={2} gap={1}>
      <Box flexDirection="column">
        <Text bold color="white">로그인</Text>
        <Text dimColor>계정에 접속하세요</Text>
      </Box>

      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text color={focus === 'email' ? 'cyan' : 'gray'}>이메일</Text>
          <Box borderStyle="round" borderColor={focus === 'email' ? 'cyan' : 'gray'} paddingX={1}>
            <TextInput
              value={email}
              onChange={setEmail}
              focus={focus === 'email' && !loading}
              placeholder="user@example.com"
            />
          </Box>
        </Box>

        <Box flexDirection="column">
          <Text color={focus === 'password' ? 'cyan' : 'gray'}>비밀번호</Text>
          <Box borderStyle="round" borderColor={focus === 'password' ? 'cyan' : 'gray'} paddingX={1}>
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

      <Box flexDirection="column" gap={1}>
        <Button label="로그인" focused={focus === 'submit'} width={formWidth - 4} />
        <Button label="회원가입" focused={focus === 'signup'} width={formWidth - 4} />
        <Button label="Google로 로그인" focused={focus === 'google'} width={formWidth - 4} />
      </Box>

      <Box>
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

  if (!isWide) {
    return (
      <Box flexDirection="column" alignItems="center" paddingY={1}>
        <Logo />
        {form}
      </Box>
    );
  }

  return (
    <Box height={rows}>
      <Box width={leftWidth} alignItems="center" justifyContent="center">
        <Logo />
      </Box>
      <Box flexDirection="column" alignItems="center">
        <Text dimColor>{'│\n'.repeat(rows)}</Text>
      </Box>
      {form}
    </Box>
  );
}
