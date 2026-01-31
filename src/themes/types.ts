export type ThemeColors = {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
};

export type Theme = {
    id: string;
    name: string;
    colors: ThemeColors;
    gradient: string;
    pattern: string; // CSS or SVG path
    particleColor: string;
    buttonStyle: {
        primary: string;
        secondary: string;
    };
};
