'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div 
      className="flex min-h-screen items-center justify-center px-4 py-6"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="w-full max-w-md">
        {/* Hero Title */}
        <div className="card mb-8 p-6 sm:p-8 text-center">
          <h1 
            className="text-4xl font-extrabold uppercase tracking-tight sm:text-5xl"
            style={{ 
              color: 'var(--color-text-primary)',
              fontSize: '48px',
              lineHeight: '56px',
              letterSpacing: '0.02em'
            }}
          >
            JIGSOLITAIRE GAME
          </h1>
        </div>

        {/* Main Menu Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/game')}
            className="btn-primary w-full"
            style={{ fontSize: '18px', padding: 'var(--spacing-md) var(--spacing-lg)' }}
          >
            New Game
          </button>
          
          <button
            onClick={() => router.push('/levels')}
            className="btn-secondary w-full"
            style={{ fontSize: '18px', padding: 'var(--spacing-md) var(--spacing-lg)' }}
          >
            Select a Level
          </button>
          
          <button
            onClick={() => router.push('/settings')}
            className="btn-ghost w-full"
            style={{ fontSize: '18px', padding: 'var(--spacing-md) var(--spacing-lg)' }}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
