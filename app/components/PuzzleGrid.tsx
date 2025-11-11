'use client';

import { Tile as TileType } from '../types/game';
import Tile from './Tile';

interface PuzzleGridProps {
  tiles: TileType[];
  selectedTile: number | null;
  hintedTileId: number | null;
  onTileClick: (index: number) => void;
  onTileDragSwap: (fromIndex: number, toIndex: number) => void;
}

export default function PuzzleGrid({
  tiles,
  selectedTile,
  hintedTileId,
  onTileClick,
  onTileDragSwap,
}: PuzzleGridProps) {
  return (
    <div className="grid aspect-square w-full max-w-full grid-cols-3 gap-[2px] rounded-2xl border border-slate-200 bg-white p-[10px] shadow-sm sm:gap-[3px] sm:p-3">
      {tiles.map((tile, index) => (
        <Tile
          key={tile.id}
          imageData={tile.imageData}
          isSelected={selectedTile === index}
          isCorrect={tile.currentPos === tile.correctPos}
          isHinted={hintedTileId === tile.id}
          index={index}
          onClick={() => onTileClick(index)}
          onDragSwap={onTileDragSwap}
        />
      ))}
    </div>
  );
}

