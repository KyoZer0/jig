'use client';

interface ControlsProps {
  onNewGame: () => void;
  onShuffle: () => void;
  onHint: () => void;
  showHints?: boolean;
  compact?: boolean;
}

export default function Controls({ onNewGame, onShuffle, onHint, showHints = true, compact = false }: ControlsProps) {
  const buttonStyle = compact 
    ? { fontSize: '11px', letterSpacing: '0.15em', padding: 'var(--spacing-xs) var(--spacing-sm)' }
    : { fontSize: '13px', letterSpacing: '0.2em' };

  return (
    <div 
      className="flex flex-col items-center justify-center sm:flex-row"
      style={{ gap: compact ? 'var(--spacing-xs)' : 'var(--spacing-sm)' }}
    >
      <button
        onClick={onNewGame}
        className="btn-secondary"
        style={compact ? { minHeight: '36px', ...buttonStyle } : {}}
      >
        <span style={buttonStyle}>New Puzzle</span>
      </button>
      <button
        onClick={onShuffle}
        className="btn-ghost"
        style={compact ? { minHeight: '36px', ...buttonStyle } : {}}
      >
        <span style={buttonStyle}>Shuffle</span>
      </button>
      {showHints && (
        <button
          onClick={onHint}
          className="btn-ghost"
          style={compact ? { minHeight: '36px', ...buttonStyle } : {}}
        >
          <span style={buttonStyle}>Hint</span>
        </button>
      )}
    </div>
  );
}
