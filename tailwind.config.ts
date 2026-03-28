import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF8E7',
          100: '#FAF0C8',
          200: '#F5E18F',
          300: '#EFD256',
          400: '#E9C31D',
          500: '#D4AF37',
          600: '#B8960F',
          700: '#8A700B',
          800: '#5C4A07',
          900: '#2E2504',
        },
        forest: {
          50: '#E8F5EC',
          100: '#C6E7D0',
          200: '#8DCFA1',
          300: '#54B772',
          400: '#1B9F43',
          500: '#074C2A',
          600: '#063D22',
          700: '#042E1A',
          800: '#031F11',
          900: '#010F09',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D4AF37",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#074C2A",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        display: ['Cinzel', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'oil-pattern': "url('/patterns/oil-drop.svg')",
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #B8960F 100%)',
        'gradient-forest': 'linear-gradient(135deg, #074C2A 0%, #0A5C34 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config

