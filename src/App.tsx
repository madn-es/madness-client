import { useState } from 'react';
import LoginScreen from './screens/LoginScreen.js';
import { ThemeProvider } from './theme.js';

type Screen = 'login' | 'feed';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [token, setToken] = useState('');

  function handleLogin(t: string) {
    setToken(t);
    setScreen('feed');
  }

  return (
    <ThemeProvider>
      {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
      {/* TODO: 피드 화면 */}
    </ThemeProvider>
  );
}
