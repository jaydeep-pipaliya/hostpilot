/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: '#0a0a0f',
                surface: '#111118',
                'surface-hover': '#1a1a24',
                border: 'rgba(255, 255, 255, 0.08)',
                'border-hover': 'rgba(255, 255, 255, 0.15)',
                accent: {
                    DEFAULT: '#8b5cf6',
                    hover: '#a78bfa',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
                'soft': '0 4px 20px rgba(0, 0, 0, 0.2)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-glow': 'pulseGlow 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' },
                },
            },
        },
    },
    plugins: [],
}
