'use client';

import Image from 'next/image';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  time: string;
  completedImage: string;
  completedImageName: string;
  stars: number;
  currentLevel: number | null;
  onPlayAgain: () => void;
  onNextLevel?: () => void;
}

export default function WinModal({
  isOpen,
  moves,
  time,
  completedImage,
  completedImageName,
  stars,
  currentLevel,
  onPlayAgain,
  onNextLevel,
}: WinModalProps) {
  if (!isOpen) return null;

  const renderStars = (starCount: number) => {
    return (
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((starNum) => (
          <svg
            key={starNum}
            width="32"
            height="32"
            viewBox="0 0 24 24"
            style={{
              fill: starNum <= starCount ? 'var(--color-primary)' : 'var(--color-light-gray)',
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-3 backdrop-blur-sm"
      style={{
        background: 'rgba(10, 10, 10, 0.35)',
      }}
    >
      <div 
        className="card card-elevated w-full max-w-[300px] p-4 text-center sm:max-w-[320px]"
        style={{
          padding: 'var(--spacing-lg)',
        }}
      >
        <h2 
          className="text-lg font-bold uppercase"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: '28px',
            lineHeight: '34px',
            fontWeight: 700,
          }}
        >
          Nice Work!
        </h2>

        {/* Stars Display */}
        <div className="mt-4">
          {renderStars(stars)}
        </div>

        <div 
          className="mt-3 overflow-hidden rounded-xl"
          style={{
            borderRadius: 'var(--radius-round-medium)',
            border: 'var(--border-thin)',
          }}
        >
          <Image
            src={completedImage || ''}
            alt={completedImageName || 'Completed puzzle'}
            width={360}
            height={360}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div 
          className="mt-3 text-xs uppercase tracking-wide"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            lineHeight: '18px',
            letterSpacing: '0.24em',
          }}
        >
          Moves {moves} · Time {time}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {currentLevel !== null && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="btn-primary w-full"
            >
              <span style={{ fontSize: '13px', letterSpacing: '0.24em' }}>Next Level</span>
            </button>
          )}
          <button
            onClick={onPlayAgain}
            className="btn-secondary w-full"
          >
            <span style={{ fontSize: '13px', letterSpacing: '0.24em' }}>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
