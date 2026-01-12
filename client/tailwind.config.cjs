/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                clay: ['"Fredoka"', 'sans-serif'],
            },
            colors: {
                clay: {
                    bg: '#EBE5CE', // Stone/Beige
                    red: '#EF4444',
                    blue: '#3B82F6',
                    green: '#22C55E',
                    yellow: '#EAB308',
                    purple: '#A855F7',
                }
            },
            boxShadow: {
                'clay-card': '8px 8px 16px #d1cca0, -8px -8px 16px #ffffff, inset 2px 2px 5px rgba(0,0,0,0.05)',
                'clay-btn': '4px 4px 8px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.4)',
                'clay-btn-active': 'inset 4px 4px 8px rgba(0,0,0,0.2)',
                'clay-input': 'inset 6px 6px 12px #d1cca0, inset -6px -6px 12px #ffffff',
            },
            backgroundImage: {
                'clay-texture': "url('/src/assets/clay-bg.png')",
            }
        },
    },
    plugins: [],
}
