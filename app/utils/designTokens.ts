// Design tokens extracted from design.json
export const designTokens = {
  colors: {
    brand: {
      primary: '#FFBF00',
      primaryVariant: '#F5B000',
      accent: '#FFDD66',
    },
    neutral: {
      black: '#0A0A0A',
      darkGray: '#2F2F2F',
      midGray: '#9A9A9A',
      lightGray: '#F3F3F2',
      offWhite: '#FFFDF6',
    },
    support: {
      success: '#00C853',
      danger: '#FF3B30',
      muted: '#CFCFCF',
    },
    semantic: {
      surface: '#FFFDF6',
      cardBackground: '#F8F6F2',
      textPrimary: '#1E1E1E',
      textSecondary: '#6A6A6A',
    },
  },
  typography: {
    fontFamily: "Helvetica Neue, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica', Arial, sans-serif",
    weights: {
      display: 800,
      heading: 700,
      medium: 500,
      regular: 400,
    },
    scale: {
      xxl: { size: '48px', lineHeight: '56px', letterSpacing: '0.02em' },
      xl: { size: '28px', lineHeight: '34px', letterSpacing: '0.01em' },
      lg: { size: '18px', lineHeight: '24px' },
      base: { size: '16px', lineHeight: '22px' },
      sm: { size: '13px', lineHeight: '18px' },
    },
  },
  spacing: {
    unit: 8,
    scale: {
      xxs: 4,
      xs: 8,
      sm: 12,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
  },
  radius: {
    pill: '9999px',
    roundLarge: '20px',
    roundMedium: '12px',
    roundSmall: '8px',
    sharp: '6px',
  },
  shadow: {
    soft: '0 6px 20px rgba(16,16,16,0.08)',
    elevated: '0 12px 30px rgba(16,16,16,0.12)',
    inner: 'inset 0 2px 6px rgba(0,0,0,0.04)',
  },
  borders: {
    thin: '1px solid rgba(16,16,16,0.06)',
    muted: '1px solid rgba(16,16,16,0.04)',
  },
  motion: {
    duration: {
      fast: '120ms',
      normal: '240ms',
      slow: '360ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
  },
} as const;

