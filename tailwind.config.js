/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#14284F',
        accent: '#1D4ED8',
        'bg-muted': '#F5F6F8',
        'text-muted': '#6B7280',
        border: '#E5E7EB',
        success: {
          text: '#16A34A',
          bg: '#DCFCE7',
        },
        error: {
          text: '#DC2626',
          bg: '#FEE2E2',
        },
        info: {
          text: '#2563EB',
          bg: '#DBEAFE',
        },
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
    },
  },
  plugins: [],
}
