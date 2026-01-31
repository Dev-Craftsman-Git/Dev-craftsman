
import { useState, useEffect } from 'react';

export const useDailyTheme = () => {
    const [dailyThemeId, setDailyThemeId] = useState<string>('ironman');

    useEffect(() => {
        const day = new Date().getDay();
        const dayMap: Record<number, string> = {
            0: 'spiderman', // Sunday
            1: 'captain',   // Monday
            2: 'panther',   // Tuesday
            3: 'captain',   // Wednesday
            4: 'panther',   // Thursday
            5: 'spiderman', // Friday
            6: 'captain',   // Saturday
        };

        const todayThemeId = dayMap[day] || 'captain';
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setDailyThemeId(todayThemeId);
    }, []);

    return dailyThemeId;
};
