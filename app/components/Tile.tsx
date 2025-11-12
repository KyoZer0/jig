'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import type { TileMergeDirections } from '../types/game';

type WaterDirectionKey = keyof TileMergeDirections;

const WATER_DIRECTIONS: WaterDirectionKey[] = [
  'top',
  'right',
  'bottom',
  'left',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
];

const DEFAULT_WATER_STATE = (): Record<WaterDirectionKey, boolean> => ({
  top: false,
  right: false,
  bottom: false,
  left: false,
  topLeft: false,
  topRight: false,
  bottomLeft: false,
  bottomRight: false,
});

const BASE_BORDER_WIDTH = 1.5;
const WATER_EFFECT_TIMEOUT = 1200;

interface GroupBorderEdges {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

interface TileProps {
  imageData: string;
  isSelected: boolean;
  isCorrect: boolean;
  isHinted: boolean;
  index: number;
  onClick: () => void;
  onDragSwap: (fromIndex: number, toIndex: number) => void;
  mergeDirections: TileMergeDirections;
  groupBorderEdges: GroupBorderEdges;
}

export default function Tile({
  imageData,
  isSelected,
  isHinted,
  isCorrect,
  index,
  onClick,
  onDragSwap,
  mergeDirections,
  groupBorderEdges,
}: TileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [waterEffects, setWaterEffects] = useState<Record<WaterDirectionKey, boolean>>(DEFAULT_WATER_STATE);
  const tileRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);
  const previousMergeRef = useRef<TileMergeDirections>(mergeDirections);
  const waterTimeoutsRef = useRef<Map<WaterDirectionKey, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return () => {
      waterTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      waterTimeoutsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const updates: Partial<Record<WaterDirectionKey, boolean>> = {};
    let shouldUpdate = false;

    WATER_DIRECTIONS.forEach(direction => {
      const previouslyMerged = previousMergeRef.current[direction];
      const currentlyMerged = mergeDirections[direction];

      if (currentlyMerged && !previouslyMerged) {
        shouldUpdate = true;
        updates[direction] = true;

        const existingTimeout = waterTimeoutsRef.current.get(direction);
        if (existingTimeout) clearTimeout(existingTimeout);

        const timeout = setTimeout(() => {
          setWaterEffects(prevState => {
            if (!prevState[direction]) return prevState;
            return { ...prevState, [direction]: false };
          });
          waterTimeoutsRef.current.delete(direction);
        }, WATER_EFFECT_TIMEOUT);

        waterTimeoutsRef.current.set(direction, timeout);
      } else if (!currentlyMerged && previouslyMerged) {
        const existingTimeout = waterTimeoutsRef.current.get(direction);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          waterTimeoutsRef.current.delete(direction);
        }
        shouldUpdate = true;
        updates[direction] = false;
      }
    });

    if (shouldUpdate) {
      setWaterEffects(prevState => ({
        ...prevState,
        ...updates,
      }));
    }

    previousMergeRef.current = mergeDirections;
  }, [mergeDirections]);

  const isMerged = useMemo(() => {
    return mergeDirections.top || mergeDirections.right || mergeDirections.bottom || mergeDirections.left ||
           mergeDirections.topLeft || mergeDirections.topRight || mergeDirections.bottomLeft || mergeDirections.bottomRight;
  }, [mergeDirections]);

  const baseScale = useMemo(() => {
    if (isDragging) return 1.05;
    if (isHovered || isSelected) return 1.02;
    return 1;
  }, [isDragging, isHovered, isSelected]);

  const borderStyles = useMemo(() => {
    // Remove borders on merged edges
    return {
      borderTopWidth: mergeDirections.top ? 0 : BASE_BORDER_WIDTH,
      borderRightWidth: mergeDirections.right ? 0 : BASE_BORDER_WIDTH,
      borderBottomWidth: mergeDirections.bottom ? 0 : BASE_BORDER_WIDTH,
      borderLeftWidth: mergeDirections.left ? 0 : BASE_BORDER_WIDTH,
      borderStyle: 'solid' as const,
      borderColor: 'rgba(255, 255, 255, 0.92)',
      ['--tile-gap' as const]: `${BASE_BORDER_WIDTH}px`,
    };
  }, [mergeDirections]);

  const borderRadiusStyles = useMemo(() => {
    if (!isCorrect) {
      return { borderRadius: 'var(--radius-round-medium)' };
    }
    
    // Only round corners that are on the outer edge of the merged group
    const topLeft = groupBorderEdges.top && groupBorderEdges.left ? 'var(--radius-round-small)' : '0';
    const topRight = groupBorderEdges.top && groupBorderEdges.right ? 'var(--radius-round-small)' : '0';
    const bottomLeft = groupBorderEdges.bottom && groupBorderEdges.left ? 'var(--radius-round-small)' : '0';
    const bottomRight = groupBorderEdges.bottom && groupBorderEdges.right ? 'var(--radius-round-small)' : '0';
    
    return { borderRadius: `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}` };
  }, [isCorrect, groupBorderEdges]);

  const groupBorderStyle = useMemo(() => {
    if (!isCorrect) return {};
    
    // Add subtle border around the outer edges of merged groups
    const borderWidth = '2px';
    const borderColor = 'rgba(255, 191, 0, 0.4)';
    
    return {
      borderTop: groupBorderEdges.top ? `${borderWidth} solid ${borderColor}` : 'none',
      borderRight: groupBorderEdges.right ? `${borderWidth} solid ${borderColor}` : 'none',
      borderBottom: groupBorderEdges.bottom ? `${borderWidth} solid ${borderColor}` : 'none',
      borderLeft: groupBorderEdges.left ? `${borderWidth} solid ${borderColor}` : 'none',
    };
  }, [isCorrect, groupBorderEdges]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isCorrect) {
      event.preventDefault();
      return;
    }
    
    if (event.button !== 0) return;
    event.preventDefault();

    pointerIdRef.current = event.pointerId;
    startPositionRef.current = { x: event.clientX, y: event.clientY };
    dragMovedRef.current = false;
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });

    tileRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) return;

    const dx = event.clientX - startPositionRef.current.x;
    const dy = event.clientY - startPositionRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const threshold = 6;

    if (!dragMovedRef.current && distance > threshold) {
      dragMovedRef.current = true;
    }

    if (distance === 0) {
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    const maxDistance = 92;
    const normalized = Math.min(distance / maxDistance, 1);
    const eased = 1 - Math.pow(1 - normalized, 2.4);
    const limitedDistance = eased * maxDistance;
    const factor = limitedDistance / distance;

    setDragOffset({
      x: dx * factor,
      y: dy * factor,
    });
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    if (!isDragging) return;

    if (pointerIdRef.current !== null) {
      tileRef.current?.releasePointerCapture(pointerIdRef.current);
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    if (!cancelled) {
      if (dragMovedRef.current) {
        const dropTarget = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
        const dropTile = dropTarget?.closest('[data-tile-index]') as HTMLElement | null;

        if (dropTile) {
          const dropIndex = Number(dropTile.dataset.tileIndex);
          if (!Number.isNaN(dropIndex) && dropIndex !== index) {
            onDragSwap(index, dropIndex);
          }
        }
      } else {
        onClick();
      }
    }

    pointerIdRef.current = null;
    dragMovedRef.current = false;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishDrag(event);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    finishDrag(event, true);
  };

  const isLocked = isCorrect;

  return (
    <div
      ref={tileRef}
      data-tile-index={index}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={() => !isLocked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative aspect-square w-full overflow-hidden touch-none
        transition-shadow duration-200 ease-out border border-transparent
        ${isLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
      `}
      style={{
        ...borderStyles,
        ...borderRadiusStyles,
        ...groupBorderStyle,
        background: 'var(--color-surface)',
        transform: isLocked ? 'none' : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(${baseScale})`,
        transition: isDragging ? 'transform 70ms ease-out' : 'transform 200ms var(--motion-easing)',
        boxShadow: isDragging ? 'var(--shadow-elevated)' : (isLocked ? 'none' : 'var(--shadow-soft)'),
        outline: isSelected || isHinted ? '2px solid var(--color-primary)' : 'none',
        outlineOffset: isSelected || isHinted ? '-2px' : '0',
        pointerEvents: isLocked ? 'none' : 'auto',
      }}
    >
      <img
        src={imageData}
        alt="Puzzle piece"
        className="h-full w-full select-none object-cover"
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-0">
        <span
          className={`tile-water-band tile-water-band-horizontal tile-water-band-top ${
            waterEffects.top ? 'tile-water-band--active' : ''
          }`}
        />
        <span
          className={`tile-water-band tile-water-band-horizontal tile-water-band-bottom ${
            waterEffects.bottom ? 'tile-water-band--active' : ''
          }`}
        />
        <span
          className={`tile-water-band tile-water-band-vertical tile-water-band-left ${
            waterEffects.left ? 'tile-water-band--active' : ''
          }`}
        />
        <span
          className={`tile-water-band tile-water-band-vertical tile-water-band-right ${
            waterEffects.right ? 'tile-water-band--active' : ''
          }`}
        />

        <span
          className={`tile-water-corner tile-water-corner-top-left ${
            waterEffects.topLeft ? 'tile-water-corner--active' : ''
          }`}
        />
        <span
          className={`tile-water-corner tile-water-corner-top-right ${
            waterEffects.topRight ? 'tile-water-corner--active' : ''
          }`}
        />
        <span
          className={`tile-water-corner tile-water-corner-bottom-left ${
            waterEffects.bottomLeft ? 'tile-water-corner--active' : ''
          }`}
        />
        <span
          className={`tile-water-corner tile-water-corner-bottom-right ${
            waterEffects.bottomRight ? 'tile-water-corner--active' : ''
          }`}
        />
      </div>

      {isHinted && !isCorrect && (
        <div 
          className="pointer-events-none absolute inset-0 animate-[pulse_1.6s_ease-in-out_infinite] rounded-2xl border-2"
          style={{
            borderColor: 'var(--color-primary)',
            opacity: 0.6,
            borderRadius: 'var(--radius-round-medium)',
          }}
        />
      )}
    </div>
  );
}
