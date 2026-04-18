import { useState } from 'react';
import LoginScreen from './screens/LoginScreen.js';

type Screen = 'login' | 'feed';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [token, setToken] = useState('');

  function handleLogin(t: string) {
    setToken(t);
    setScreen('feed');
  }

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // TODO: 피드 화면
  return null;
}
