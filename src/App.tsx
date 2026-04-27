import { useState } from 'react';
import LoginScreen from './screens/LoginScreen.js';
import SignupScreen from './screens/SignupScreen.js';
import { ThemeProvider } from './theme.js';

type Screen = 'login' | 'signup' | 'feed';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [token, setToken] = useState('');

  function handleLogin(t: string) {
    setToken(t);
    setScreen('feed');
  }

  return (
    <ThemeProvider>
      {screen === 'login'  && <LoginScreen onLogin={handleLogin} onSignup={() => setScreen('signup')} />}
      {screen === 'signup' && <SignupScreen onSignup={handleLogin} onBack={() => setScreen('login')} />}
      {/* TODO: 피드 화면 */}
    </ThemeProvider>
  );
}
