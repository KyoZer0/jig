// LocalStorage utilities for game progress

export interface LevelProgress {
  level: number;
  stars: number; // 0-3
  bestTime: number; // in seconds
  completed: boolean;
}

const STORAGE_KEY = 'jigsolitaire-progress';

export function getAllProgress(): LevelProgress[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getLevelProgress(level: number): LevelProgress | null {
  const allProgress = getAllProgress();
  return allProgress.find(p => p.level === level) || null;
}

export function saveLevelProgress(level: number, timeInSeconds: number): LevelProgress {
  const allProgress = getAllProgress();
  
  // Calculate stars based on time
  // Under 10s: 3 stars, under 20s: 2 stars, 30s or more: 1 star
  let stars = 0;
  if (timeInSeconds < 10) {
    stars = 3;
  } else if (timeInSeconds < 20) {
    stars = 2;
  } else if (timeInSeconds >= 30) {
    stars = 1;
  } else {
    // 20-29 seconds: 2 stars (as per "20s 2 stars")
    stars = 2;
  }
  
  const existingIndex = allProgress.findIndex(p => p.level === level);
  const newProgress: LevelProgress = {
    level,
    stars,
    bestTime: timeInSeconds,
    completed: true,
  };
  
  if (existingIndex >= 0) {
    // Update if this is a better time or more stars
    const existing = allProgress[existingIndex];
    if (timeInSeconds < existing.bestTime || stars > existing.stars) {
      allProgress[existingIndex] = newProgress;
    } else {
      return existing;
    }
  } else {
    allProgress.push(newProgress);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  return newProgress;
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

