import { captainTheme } from './captain';
import { pantherTheme } from './panther';
import { spidermanTheme } from './spiderman';
import { Theme } from './types';

export const themes: Record<string, Theme> = {
    captain: captainTheme,
    panther: pantherTheme,
    spiderman: spidermanTheme,
};

export * from './types';
