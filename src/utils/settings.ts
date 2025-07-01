import { Settings } from '../context/SettingsContext';

export function restoreSettings(): Settings | null {
  let settings: Settings | null = null;

  try {
    const storedData = localStorage.getItem('settings');

    if (storedData) {
      settings = JSON.parse(storedData);
    }
  } catch (err) {
    // If stored data is not a strigified JSON this might fail,
    // that's why we catch the error
  }

  return settings;
}

export function storeSettings(settings: Settings): void {
  localStorage.setItem('settings', JSON.stringify(settings));
}
