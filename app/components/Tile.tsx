'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

interface TileProps {
  imageData: string;
  isSelected: boolean;
  isCorrect: boolean;
  isHinted: boolean;
  index: number;
  onClick: () => void;
  onDragSwap: (fromIndex: number, toIndex: number) => void;
}

export default function Tile({
  imageData,
  isSelected,
  isCorrect,
  isHinted,
  index,
  onClick,
  onDragSwap,
}: TileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justMatched, setJustMatched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tileRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  useEffect(() => {
    if (isCorrect) {
      setJustMatched(true);
      const timeout = setTimeout(() => setJustMatched(false), 700);
      return () => clearTimeout(timeout);
    }

    setJustMatched(false);
    return undefined;
  }, [isCorrect]);

  const ringClass = useMemo(() => {
    if (isSelected) return 'border border-indigo-500 shadow-[0_6px_16px_rgba(79,70,229,0.18)]';
    if (isHinted) return 'border border-sky-400 shadow-[0_6px_16px_rgba(56,189,248,0.18)]';
    if (isCorrect) return 'border-0 shadow-[0_6px_16px_rgba(34,197,94,0.18)]';
    return 'border border-slate-200 hover:border-slate-300 shadow-sm';
  }, [isSelected, isHinted, isCorrect]);

  const baseScale = useMemo(() => {
    if (isDragging) return 1.05;
    if (isHovered || isSelected) return 1.02;
    return 1;
  }, [isDragging, isHovered, isSelected]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
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

  return (
    <div
      ref={tileRef}
      data-tile-index={index}
      className={`
        group relative aspect-square w-full cursor-grab overflow-hidden rounded-xl bg-white touch-none
        transition-shadow duration-200 ease-out ${ringClass}
        ${justMatched ? 'tile-just-matched' : ''}
        ${isDragging ? 'z-10 shadow-[0_16px_34px_-12px_rgba(15,23,42,0.35)]' : ''}
        active:cursor-grabbing
      `}
      style={{
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(${baseScale})`,
        transition: isDragging ? 'transform 70ms ease-out' : 'transform 200ms cubic-bezier(0.22, 0.61, 0.36, 1)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageData}
        alt="Puzzle piece"
        className="h-full w-full select-none object-cover"
        draggable={false}
      />

      {isCorrect && (
        <div className="pointer-events-none absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white shadow">
          ✓
        </div>
      )}

      {isHinted && !isCorrect && (
        <div className="pointer-events-none absolute inset-0 animate-[pulse_1.6s_ease-in-out_infinite] rounded-2xl border-2 border-sky-400/60" />
      )}
    </div>
  );
}

