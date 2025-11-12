'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tile, GameImage, PuzzleSet } from '../types/game';
import { splitImage, shuffleArray } from '../utils/imageSplitter';
import { saveLevelProgress } from '../utils/storage';
import { getSettings } from '../utils/settings';
import PuzzleGrid from '../components/PuzzleGrid';
import Stats from '../components/Stats';
import Controls from '../components/Controls';
import WinModal from '../components/WinModal';

// Calculate stars from time
function calculateStars(timeInSeconds: number): number {
  if (timeInSeconds < 10) return 3;
  if (timeInSeconds < 20) return 2;
  if (timeInSeconds >= 30) return 1;
  return 2; // 20-29 seconds
}

function formatImageName(filename: string): string {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  const spaced = withoutExtension.replace(/[_\-]+/g, ' ').trim();

  if (!spaced) {
    return 'Puzzle Image';
  }

  return spaced
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [puzzleSets, setPuzzleSets] = useState<PuzzleSet[]>([]); // For hard levels
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [time, setTime] = useState('0:00');
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentImage, setCurrentImage] = useState<GameImage | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [isHardLevel, setIsHardLevel] = useState(false);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0); // For hard levels
  const [isLoading, setIsLoading] = useState(true);
  const [availableImages, setAvailableImages] = useState<GameImage[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hintedTileId, setHintedTileId] = useState<number | null>(null);
  const [settings, setSettings] = useState(getSettings());
  const [earnedStars, setEarnedStars] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (!isComplete && tiles.length > 0 && settings.playWithTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeInSeconds(elapsed);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (!settings.playWithTime) {
      setTime('--:--');
    }
  }, [startTime, isComplete, tiles.length, settings.playWithTime]);

  const shuffleTiles = useCallback((tilesToShuffle: Tile[]): Tile[] => {
    const positions = tilesToShuffle.map(t => t.currentPos);
    const shuffledPositions = shuffleArray(positions);

    const shuffled = tilesToShuffle.map((tile, index) => ({
      ...tile,
      currentPos: shuffledPositions[index],
    }));

    return shuffled.sort((a, b) => a.currentPos - b.currentPos);
  }, []);

  const createNewGame = useCallback(async (image: GameImage, puzzleIdx = 0) => {
    const pieces = await splitImage(image.url);
    const newTiles: Tile[] = pieces.map((piece, index) => ({
      id: index + (puzzleIdx * 1000), // Unique IDs for multiple puzzles
      currentPos: index,
      correctPos: index,
      imageData: piece,
      puzzleIndex: puzzleIdx,
    }));

    const shuffledTiles = shuffleTiles(newTiles);
    return shuffledTiles;
  }, [shuffleTiles]);

  const createHardLevel = useCallback(async (images: GameImage[]) => {
    const sets: PuzzleSet[] = [];
    for (let i = 0; i < images.length; i++) {
      const tiles = await createNewGame(images[i], i);
      sets.push({
        tiles,
        isComplete: false,
        image: images[i],
      });
    }
    setPuzzleSets(sets);
    setTiles(sets[0].tiles); // Start with first puzzle
    setCurrentImage(sets[0].image);
    setCurrentPuzzleIndex(0);
  }, [createNewGame]);

  const initializeGame = useCallback(async () => {
    if (availableImages.length === 0) {
      setLoadError('No puzzle images available.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSettings(getSettings());
    
    // Check if a specific level was requested via URL
    const levelParam = searchParams.get('level');
    let level: number | null = null;
    const isHard = levelParam ? parseInt(levelParam, 10) % 5 === 0 : false;
    setIsHardLevel(isHard);
    
    if (levelParam) {
      const levelNum = parseInt(levelParam, 10);
      if (!isNaN(levelNum) && levelNum > 0 && levelNum <= availableImages.length) {
        level = levelNum;
        
        if (isHard) {
          // Hard level: use 3 different images
          const imageIndices: number[] = [];
          const baseIndex = levelNum - 1;
          // Use the level's image and 2 nearby images
          for (let i = 0; i < 3; i++) {
            const idx = (baseIndex + i) % availableImages.length;
            imageIndices.push(idx);
          }
          const hardImages = imageIndices.map(idx => availableImages[idx]);
          await createHardLevel(hardImages);
        } else {
          // Normal level: single image
          const selectedImage = availableImages[levelNum - 1];
          const tiles = await createNewGame(selectedImage, 0);
          setTiles(tiles);
          setCurrentImage(selectedImage);
          setPuzzleSets([]);
        }
      } else {
        const selectedImage = availableImages[0];
        const tiles = await createNewGame(selectedImage, 0);
        setTiles(tiles);
        setCurrentImage(selectedImage);
        setPuzzleSets([]);
      }
    } else {
      // Random game (no level)
      const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      const tiles = await createNewGame(selectedImage, 0);
      setTiles(tiles);
      setCurrentImage(selectedImage);
      setPuzzleSets([]);
    }

    setCurrentLevel(level);
    setSelectedTile(null);
    setMoves(0);
    setStartTime(Date.now());
    setTimeInSeconds(0);
    setIsComplete(false);
    setHintedTileId(null);
    setEarnedStars(0);
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setLoadError(null);
    setIsLoading(false);
  }, [availableImages, createNewGame, createHardLevel, searchParams]);

  const loadManifest = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/jig-images/manifest.json');

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Manifest is empty or invalid');
      }

      const mappedImages = (data as string[])
        .sort()
        .map(filename => ({
          name: formatImageName(filename),
          url: `/jig-images/${filename}`,
        }));

      setAvailableImages(mappedImages);
      setLoadError(null);
    } catch (error) {
      console.error('Failed to load image manifest:', error);
      setAvailableImages([]);
      setLoadError('Failed to load puzzle collection. Please retry.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManifest();
  }, [loadManifest]);

  useEffect(() => {
    if (availableImages.length > 0) {
      initializeGame();
    }
  }, [availableImages, initializeGame]);

  const handleRetry = useCallback(() => {
    if (availableImages.length > 0) {
      setLoadError(null);
      initializeGame();
    } else {
      setLoadError(null);
      loadManifest();
    }
  }, [availableImages.length, initializeGame, loadManifest]);

  const progress = useMemo(() => {
    if (isHardLevel && puzzleSets.length > 0) {
      // For hard levels, calculate progress across all puzzles
      const totalTiles = puzzleSets.reduce((sum, set) => sum + set.tiles.length, 0);
      const completedTiles = puzzleSets.reduce((sum, set) => {
        return sum + set.tiles.filter(tile => tile.currentPos === tile.correctPos).length;
      }, 0);
      return totalTiles > 0 ? (completedTiles / totalTiles) * 100 : 0;
    }
    if (tiles.length === 0) return 0;
    const completed = tiles.filter(tile => tile.currentPos === tile.correctPos).length;
    return (completed / tiles.length) * 100;
  }, [tiles, puzzleSets, isHardLevel]);

  const handleTileClick = (index: number) => {
    if (isComplete) return;
    // Don't allow clicking on correct tiles (they're locked/merged)
    const tile = tiles[index];
    if (tile && tile.currentPos === tile.correctPos) {
      return;
    }
    setHintedTileId(null);

    if (selectedTile === null) {
      setSelectedTile(index);
    } else if (selectedTile === index) {
      setSelectedTile(null);
    } else {
      swapTiles(selectedTile, index);
      setSelectedTile(null);
      setMoves(prev => prev + 1);
    }
  };

  const swapTiles = (index1: number, index2: number) => {
    // Don't allow swapping correct tiles
    const tile1 = tiles[index1];
    const tile2 = tiles[index2];
    if ((tile1 && tile1.currentPos === tile1.correctPos) || 
        (tile2 && tile2.currentPos === tile2.correctPos)) {
      return;
    }

    if (isHardLevel && puzzleSets.length > 0) {
      // Update the current puzzle set
      const newSets = [...puzzleSets];
      const currentSet = newSets[currentPuzzleIndex];
      const newTiles = [...currentSet.tiles];
      const tempPos = newTiles[index1].currentPos;
      newTiles[index1].currentPos = newTiles[index2].currentPos;
      newTiles[index2].currentPos = tempPos;
      
      const sorted = newTiles.sort((a, b) => a.currentPos - b.currentPos);
      currentSet.tiles = sorted;
      
      // Check if current puzzle is complete
      if (checkWin(sorted)) {
        currentSet.isComplete = true;
        
        // Check if all puzzles are complete
        if (newSets.every(set => set.isComplete)) {
          setTimeout(() => {
            setIsComplete(true);
            const stars = calculateStars(timeInSeconds);
            setEarnedStars(stars);
            if (currentLevel !== null && settings.playWithTime) {
              saveLevelProgress(currentLevel, timeInSeconds);
            }
          }, 300);
        } else {
          // Move to next puzzle
          const nextIndex = newSets.findIndex(set => !set.isComplete);
          if (nextIndex >= 0) {
            setCurrentPuzzleIndex(nextIndex);
            setTiles(newSets[nextIndex].tiles);
            setCurrentImage(newSets[nextIndex].image);
            setSelectedTile(null);
            setHintedTileId(null);
          }
        }
      }
      
      setPuzzleSets(newSets);
      setTiles(sorted);
    } else {
      // Normal level
      const newTiles = [...tiles];
      const tempPos = newTiles[index1].currentPos;
      newTiles[index1].currentPos = newTiles[index2].currentPos;
      newTiles[index2].currentPos = tempPos;

      const sorted = newTiles.sort((a, b) => a.currentPos - b.currentPos);
      setTiles(sorted);

      // Check win condition
      if (checkWin(sorted)) {
        setTimeout(() => {
          setIsComplete(true);
          const stars = calculateStars(timeInSeconds);
          setEarnedStars(stars);
          // Save progress if this is a level
          if (currentLevel !== null && settings.playWithTime) {
            saveLevelProgress(currentLevel, timeInSeconds);
          }
        }, 300);
      }
    }
  };

  const handleTileDragSwap = (fromIndex: number, toIndex: number) => {
    if (isComplete) return;
    if (fromIndex === toIndex) return;

    // Don't allow swapping correct tiles (they're locked/merged)
    const fromTile = tiles[fromIndex];
    const toTile = tiles[toIndex];
    if ((fromTile && fromTile.currentPos === fromTile.correctPos) || 
        (toTile && toTile.currentPos === toTile.correctPos)) {
      return;
    }

    setSelectedTile(null);
    setHintedTileId(null);
    swapTiles(fromIndex, toIndex);
    setMoves(prev => prev + 1);
  };

  const checkWin = (tilesToCheck: Tile[]): boolean => {
    return tilesToCheck.every(tile => tile.currentPos === tile.correctPos);
  };

  const handleShuffle = () => {
    if (tiles.length > 0) {
      const shuffled = shuffleTiles(tiles);
      setTiles(shuffled);
      setSelectedTile(null);
      setHintedTileId(null);
    }
  };

  const handleHint = () => {
    if (!settings.showHints) return;
    
    const misplacedTile = tiles.find(tile => tile.currentPos !== tile.correctPos);
    if (misplacedTile) {
      const index = tiles.findIndex(t => t.currentPos === misplacedTile.currentPos);
      setSelectedTile(index);
      setHintedTileId(misplacedTile.id);
      
      // Clear previous timeout
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      
      // Auto-deselect after 2 seconds
      hintTimeoutRef.current = setTimeout(() => {
        setSelectedTile(null);
        setHintedTileId(null);
      }, 2000);
    }
  };

  const handleNewGame = () => {
    router.push('/');
  };

  const handlePlayAgain = () => {
    setIsComplete(false);
    initializeGame();
  };

  const handleNextLevel = () => {
    if (currentLevel !== null && currentLevel < availableImages.length) {
      router.push(`/game?level=${currentLevel + 1}`);
    } else {
      router.push('/levels');
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--color-surface)' }}>
        <div className="card card-elevated w-full max-w-md p-8 text-center">
          <h1 
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Something went wrong
          </h1>
          <p 
            className="mt-4 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {loadError}
          </p>
          <button
            onClick={handleRetry}
            className="btn-primary mt-6 w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div 
          className="flex h-14 w-14 items-center justify-center rounded-full border-2"
          style={{ borderColor: 'var(--color-light-gray)' }}
        >
          <div 
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)' }}
          />
        </div>
      </div>
    );
  }

  const backgroundColor = isHardLevel ? 'var(--color-primary)' : 'var(--color-surface)';

  return (
    <div 
      className="flex min-h-screen items-center justify-center px-2 py-2 sm:px-3 sm:py-3"
      style={{ background: backgroundColor }}
    >
      <div 
        className="card flex h-full w-full flex-col"
        style={{
          padding: isHardLevel ? 'var(--spacing-sm)' : 'var(--spacing-lg)',
          maxHeight: isHardLevel ? '95svh' : '92svh',
          maxWidth: isHardLevel ? '95vw' : '1080px',
        }}
      >
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <div className="flex flex-col items-center gap-2 mb-2" style={{ gap: isHardLevel ? 'var(--spacing-xs)' : 'var(--spacing-sm)' }}>
            {isHardLevel && (
              <div 
                className="card-elevated px-3 py-1.5 rounded-lg flex items-center gap-2 shrink-0"
                style={{
                  background: 'var(--color-black)',
                  borderRadius: 'var(--radius-round-medium)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  boxShadow: 'var(--shadow-elevated)',
                }}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="var(--color-primary)"
                  style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div className="flex items-center gap-2">
                  <span 
                    className="font-bold uppercase tracking-wide"
                    style={{
                      color: 'var(--color-primary)',
                      fontSize: '11px',
                      lineHeight: '14px',
                      letterSpacing: '0.15em',
                    }}
                  >
                    HARD
                  </span>
                  {puzzleSets.length > 0 && (
                    <span 
                      className="font-medium"
                      style={{
                        color: 'var(--color-off-white)',
                        fontSize: '11px',
                        lineHeight: '14px',
                      }}
                    >
                      {currentPuzzleIndex + 1}/{puzzleSets.length}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div style={{ width: '100%', maxWidth: isHardLevel ? '100%' : 'auto' }}>
              <Stats moves={moves} time={time} progress={progress} compact={isHardLevel} />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden min-h-0 px-1 sm:px-2">
            <div 
              className="flex w-full flex-col items-center" 
              style={{ 
                maxWidth: isHardLevel ? 'min(100%, 60vh, 60vw)' : 'min(100%, 85vh, 85vw)',
                gap: isHardLevel ? 'var(--spacing-xs)' : 'var(--spacing-sm)',
              }}
            >
              {currentImage && !isHardLevel && (
                <div 
                  className="block overflow-hidden rounded-lg border sm:hidden"
                  style={{
                    borderRadius: 'var(--radius-round-medium)',
                    border: 'var(--border-thin)',
                  }}
                >
                  <Image
                    src={currentImage.url}
                    alt={currentImage.name}
                    width={192}
                    height={128}
                    className="h-16 w-24 object-cover"
                    priority
                  />
                </div>
              )}
              <div className="w-full" style={{ maxWidth: '100%' }}>
                <PuzzleGrid
                  tiles={tiles}
                  selectedTile={selectedTile}
                  hintedTileId={hintedTileId}
                  onTileClick={handleTileClick}
                  onTileDragSwap={handleTileDragSwap}
                  compact={isHardLevel}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center shrink-0" style={{ marginTop: isHardLevel ? 'var(--spacing-xs)' : 'var(--spacing-md)' }}>
          <Controls
            onNewGame={handleNewGame}
            onShuffle={handleShuffle}
            onHint={handleHint}
            showHints={settings.showHints}
            compact={isHardLevel}
          />
        </div>
      </div>

      <WinModal
        isOpen={isComplete}
        moves={moves}
        time={time}
        completedImage={currentImage?.url || ''}
        completedImageName={currentImage?.name || ''}
        stars={earnedStars}
        currentLevel={currentLevel}
        onPlayAgain={handlePlayAgain}
        onNextLevel={currentLevel !== null ? handleNextLevel : undefined}
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-surface)' }}>
          <div 
            className="flex h-14 w-14 items-center justify-center rounded-full border-2"
            style={{ borderColor: 'var(--color-light-gray)' }}
          >
            <div 
              className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: 'var(--color-primary)' }}
            />
          </div>
        </div>
      }
    >
      <GamePageContent />
    </Suspense>
  );
}
