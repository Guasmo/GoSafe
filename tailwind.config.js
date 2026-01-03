/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        "./App.tsx",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#2563EB',
                primaryDark: '#1E40AF',
                primaryLight: '#3B82F6',
                background: '#1A1D26',
                backgroundLight: '#242831',
                backgroundCard: '#2A2E3A',
                textPrimary: '#FFFFFF',
                textSecondary: '#9CA3AF',
                textTertiary: '#6B7280',
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',
                info: '#3B82F6',
                border: '#374151',
                inputBackground: '#2A2E3A',
                inputBorder: '#374151',
            },
        },
    },
    plugins: [],
}