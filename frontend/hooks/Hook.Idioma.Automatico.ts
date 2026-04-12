
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Group } from '../types';

export const useAutoLanguage = (group: Group | null) => {
    const { i18n, t } = useTranslation();
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedData, setTranslatedData] = useState<any | null>(null);

    useEffect(() => {
        if (group) {
            setTranslatedData(group);
        }
    }, [group]);

    return {
        lang: i18n.language,
        isTranslating,
        translatedData,
        t
    };
};
