import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          light: 'var(--brand-light)',
          dark: 'var(--brand-dark)',
          ink: 'var(--brand-ink)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          soft: 'var(--bg-soft)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
        },
        accent: 'var(--accent)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        line: 'var(--line)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam)', 'sans-serif'],
        mono: ['var(--font-ibm-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
