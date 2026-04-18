import { render } from 'ink';
import App from './App.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

render(<App />);
