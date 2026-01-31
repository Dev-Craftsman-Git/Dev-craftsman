import { Theme } from './types';

export const captainTheme: Theme = {
    id: 'captain',
    name: 'Captain America',
    colors: {
        primary: '#42A5F5', // Bright Blue (Brightened from Dark Blue)
        secondary: '#C41230', // Red
        accent: '#FFFFFF', // White
        background: '#0A0E17',
        card: 'rgba(0, 38, 84, 0.15)',
        text: '#FFFFFF',
        textSecondary: '#B0C4DE',
        border: '#C41230',
    },
    gradient: 'linear-gradient(135deg, #002654 0%, #C41230 100%)',
    pattern: 'url("/patterns/shield-mesh.svg")',
    particleColor: '#FFFFFF',
    buttonStyle: {
        primary: 'bg-blue-800 hover:bg-blue-700 text-white shadow-[0_0_15px_#C41230]',
        secondary: 'border border-blue-500 text-white hover:bg-blue-500 hover:text-white',
    },
};
