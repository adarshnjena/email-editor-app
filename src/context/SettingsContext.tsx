import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { storeSettings } from '../utils/settings';

export const THEMES = {
  LIGHT: 'LIGHT',
  ONE_DARK: 'ONE_DARK',
  UNICORN: 'UNICORN',
} as const;

export type ThemeType = (typeof THEMES)[keyof typeof THEMES];

export interface Settings {
  direction: 'ltr' | 'rtl';
  responsiveFontSizes: boolean;
  theme: ThemeType;
}

interface SettingsContextType {
  settings: Settings;
  saveSettings: (updatedSettings?: Partial<Settings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  direction: 'ltr',
  responsiveFontSizes: true,
  theme: THEMES.LIGHT,
};

interface SettingsProviderProps {
  settings?: Settings;
  children: ReactNode;
}

export function SettingsProvider({ settings, children }: SettingsProviderProps) {
  const [currentSettings, setCurrentSettings] = useState<Settings>(settings || defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveSettings = useCallback(
    (updatedSettings: Partial<Settings> = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const mergedSettings = _.merge({}, currentSettings, updatedSettings);

        setCurrentSettings(mergedSettings);
        storeSettings(mergedSettings);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentSettings]
  );

  const resetSettings = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      setCurrentSettings(defaultSettings);
      storeSettings(defaultSettings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset settings';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      document.dir = currentSettings.direction;
    } catch (err) {}
  }, [currentSettings.direction]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<SettingsContextType>(
    () => ({
      settings: currentSettings,
      saveSettings: handleSaveSettings,
      resetSettings,
      isLoading,
      error,
    }),
    [currentSettings, handleSaveSettings, resetSettings, isLoading, error]
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

export const SettingsConsumer = SettingsContext.Consumer;

// Add custom hook following LeadSend standards
export const useSettingsContext = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
};

export { SettingsContext };
