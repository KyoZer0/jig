// Settings management with localStorage

export interface GameSettings {
  playWithTime: boolean;
  showHints: boolean;
  muted: boolean;
}

const SETTINGS_KEY = 'jigsolitaire-settings';

const defaultSettings: GameSettings = {
  playWithTime: true,
  showHints: true,
  muted: false,
};

export function getSettings(): GameSettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function updateSetting<K extends keyof GameSettings>(
  key: K,
  value: GameSettings[K]
): void {
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
}

