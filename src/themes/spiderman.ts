import { Theme } from './types';

export const spidermanTheme: Theme = {
    id: 'spiderman',
    name: 'Spider-Man',
    colors: {
        primary: '#FF5252', // Bright Red (Brightened)
        secondary: '#1976D2', // Spidey Blue
        accent: '#FFFFFF', // Web White
        background: '#0D0F19', // Dark Blue-Black
        card: 'rgba(211, 47, 47, 0.15)',
        text: '#FFFFFF',
        textSecondary: '#F0F9FF', // Very Light Blue (Brightened from #E3F2FD)
        border: '#D32F2F',
    },
    gradient: 'linear-gradient(135deg, #B71C1C 0%, #0D47A1 100%)',
    pattern: 'url("/patterns/spider-web.svg")',
    particleColor: '#FFFFFF',
    buttonStyle: {
        primary: 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_#1976D2]',
        secondary: 'border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white',
    },
};
