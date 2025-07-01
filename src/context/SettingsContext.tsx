import React, { createContext, useState, useEffect, ReactNode } from "react";
import _ from "lodash";
import { storeSettings } from "../utils/settings";

export const THEMES = {
  LIGHT: 'LIGHT',
  ONE_DARK: 'ONE_DARK',
  UNICORN: 'UNICORN'
} as const;

export type ThemeType = typeof THEMES[keyof typeof THEMES];

export interface Settings {
    direction: "ltr" | "rtl";
    responsiveFontSizes: boolean;
    theme: ThemeType;
}

interface SettingsContextType {
    settings: Settings;
    saveSettings: (updatedSettings?: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
    direction: "ltr",
    responsiveFontSizes: true,
    theme: THEMES.LIGHT
};

interface SettingsProviderProps {
    settings?: Settings;
    children: ReactNode;
}

export function SettingsProvider({ settings, children }: SettingsProviderProps) {
    const [currentSettings, setCurrentSettings] = useState<Settings>(settings || defaultSettings);

    const handleSaveSettings = (updatedSettings: Partial<Settings> = {}) => {
        const mergedSettings = _.merge({}, currentSettings, updatedSettings);

        setCurrentSettings(mergedSettings);
        storeSettings(mergedSettings);
    };

    useEffect(() => {
        document.dir = currentSettings.direction;
    }, [currentSettings]);

    return (
        <SettingsContext.Provider
            value={{
                settings: currentSettings,
                saveSettings: handleSaveSettings
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
