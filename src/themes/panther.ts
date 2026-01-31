import { Theme } from './types';

export const pantherTheme: Theme = {
    id: 'panther',
    name: 'Black Panther',
    colors: {
        primary: '#C084FC', // Vibranium Purple (Brightened from Black)
        secondary: '#8B5CF6', // Kinetic Purple
        accent: '#E0E0E0', // Silver (Brightened)
        background: '#050505',
        card: 'rgba(40, 40, 40, 0.3)',
        text: '#FFFFFF',
        textSecondary: '#D1D5DB', // Light Gray (Brightened from #A3A3A3)
        border: '#8B5CF6',
    },
    gradient: 'linear-gradient(135deg, #000000 0%, #4B0082 100%)',
    pattern: 'url("/patterns/wakanda-tech.svg")',
    particleColor: '#8B5CF6',
    buttonStyle: {
        primary: 'bg-purple-900 hover:bg-purple-800 text-white shadow-[0_0_15px_#8B5CF6]',
        secondary: 'border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white',
    },
};
