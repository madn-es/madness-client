import { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import Logo, { type LogoSize } from "../components/Logo.js";
import Button from "../components/Button.js";
import LabeledBox from "../components/LabeledBox.js";
import { useTerminalSize } from "../hooks/useTerminalSize.js";
import { useTheme, getAccent } from "../theme.js";
import { signup } from "../api/auth.js";

type Field = "email" | "username" | "password" | "passwordConfirm" | "submit" | "back";
const FIELDS: Field[] = [
  "email",
  "username",
  "password",
  "passwordConfirm",
  "submit",
  "back",
];

type Mode = "lg" | "md" | "sm" | "stack";
function getMode(columns: number): Mode {
  if (columns >= 115) return "lg";
  if (columns >= 80) return "md";
  if (columns >= 60) return "sm";
  return "stack";
}
const RIGHT_WIDTH: Record<Mode, number> = { lg: 40, md: 34, sm: 24, stack: 0 };
const LOGO_SIZE: Record<Mode, LogoSize> = {
  lg: "lg",
  md: "md",
  sm: "sm",
  stack: "stack",
};
const CONTENT_MAX = 34;

interface Props {
  onSignup: (token: string) => void;
  onBack: () => void;
}

export default function SignupScreen({ onSignup, onBack }: Props) {
  const { columns, rows } = useTerminalSize();
  const { theme } = useTheme();
  const accent = getAccent(theme);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [focus, setFocus] = useState<Field>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mode = getMode(columns);
  const rightWidth = RIGHT_WIDTH[mode];
  const leftWidth = columns - rightWidth - 3;
  const isStack = mode === "stack" || mode === "sm";
  const formWidth = isStack ? Math.min(columns - 4, 34) : rightWidth;
  const contentWidth = Math.min(formWidth - 4, CONTENT_MAX);

  function submit() {
    if (!email || !username || !password || !passwordConfirm) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    setError("");
    signup(email, username, password)
      .then((result) => onSignup(result.token))
      .catch((e: any) => {
        setError(e.message ?? "알 수 없는 오류");
        setLoading(false);
      });
  }

  useInput((input, key) => {
    if (loading) return;

    // 좌우 방향키 → 로그인 화면으로
    if (key.leftArrow || key.rightArrow) {
      onBack();
      return;
    }

    const idx = FIELDS.indexOf(focus);
    if (key.tab || key.downArrow || input === "j") {
      setFocus(FIELDS[(idx + 1) % FIELDS.length]);
      setError("");
    }
    if (key.upArrow || input === "k") {
      setFocus(FIELDS[(idx - 1 + FIELDS.length) % FIELDS.length]);
      setError("");
    }
    if (key.return) {
      if (focus === "email" && email) {
        setFocus("username");
        return;
      }
      if (focus === "username" && username) {
        setFocus("password");
        return;
      }
      if (focus === "password" && password) {
        setFocus("passwordConfirm");
        return;
      }
      if (focus === "passwordConfirm" || focus === "submit") {
        submit();
        return;
      }
      if (focus === "back") {
        onBack();
        return;
      }
    }
  });

  const form = (
    <Box
      width={formWidth}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={1}
    >
      <Box width={contentWidth} flexDirection="column">
        <Text bold color="white">
          회원가입
        </Text>
        <Text dimColor>새 계정을 만들어보세요</Text>
      </Box>

      <Box width={contentWidth} flexDirection="column" gap={1}>
        <LabeledBox
          label="이메일"
          width={contentWidth}
          borderColor={focus === "email" ? accent : "gray"}
          labelColor={focus === "email" ? accent : "gray"}
        >
          <TextInput
            value={email}
            onChange={setEmail}
            focus={focus === "email" && !loading}
            placeholder="user@example.com"
          />
        </LabeledBox>

        <LabeledBox
          label="닉네임"
          width={contentWidth}
          borderColor={focus === "username" ? accent : "gray"}
          labelColor={focus === "username" ? accent : "gray"}
        >
          <TextInput
            value={username}
            onChange={setUsername}
            focus={focus === "username" && !loading}
            placeholder="nickname"
          />
        </LabeledBox>

        <LabeledBox
          label="비밀번호"
          width={contentWidth}
          borderColor={focus === "password" ? accent : "gray"}
          labelColor={focus === "password" ? accent : "gray"}
        >
          <TextInput
            value={password}
            onChange={setPassword}
            focus={focus === "password" && !loading}
            mask="*"
            placeholder="••••••••"
          />
        </LabeledBox>

        <LabeledBox
          label="비밀번호 확인"
          width={contentWidth}
          borderColor={
            focus === "passwordConfirm"
              ? accent
              : passwordConfirm && password !== passwordConfirm
                ? "red"
                : "gray"
          }
          labelColor={
            focus === "passwordConfirm"
              ? accent
              : passwordConfirm && password !== passwordConfirm
                ? "red"
                : "gray"
          }
        >
          <TextInput
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            focus={focus === "passwordConfirm" && !loading}
            mask="*"
            placeholder="••••••••"
          />
        </LabeledBox>
      </Box>

      <Box width={contentWidth} flexDirection="column" gap={1}>
        <Button
          label="회원가입"
          focused={focus === "submit"}
          width={contentWidth}
        />
        <Button
          label="로그인으로 돌아가기"
          focused={focus === "back"}
          width={contentWidth}
        />
      </Box>

      <Box width={contentWidth} flexDirection="column">
        {loading ? (
          <Text color="yellow">처리 중...</Text>
        ) : error ? (
          <Text color="red" wrap="wrap">
            {error}
          </Text>
        ) : (
          <Text dimColor>↑↓ 이동 Enter 선택</Text>
        )}
      </Box>
    </Box>
  );

  if (isStack) {
    return (
      <Box
        height={rows}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
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
        <Text dimColor>{"│\n".repeat(rows)}</Text>
      </Box>
      {form}
    </Box>
  );
}
