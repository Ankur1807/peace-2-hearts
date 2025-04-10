import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Peace2Hearts colorful palette based on the new logo
				peacefulBlue: '#0EA5E9',  // Blue from the peace symbol
				vibrantPurple: '#8B5CF6',  // Purple from the peace symbol
				brightOrange: '#F97316',   // Orange from the peace symbol
				softPink: '#F9A8D4',      // Pink from the heart gradient
				vividPink: '#D946EF',     // Pink from the heart gradient
				lightBlue: '#93C5FD',     // Blue from the sparkles
				paleYellow: '#FDE68A',    // Yellow from the sparkles
				softGreen: '#86EFAC'      // Green from the sparkles
			},
			fontFamily: {
				lora: ['Lora', 'serif'],
				opensans: ['Open Sans', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'wave': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'marquee': {
					'0%': { transform: 'translateX(5%)' },
					'100%': { transform: 'translateX(-105%)' }
				},
				// Updated heartbeat animation to be a subtle glow effect
				'heartbeat-glow': {
					'0%': { filter: 'drop-shadow(0 0 2px rgba(14, 165, 233, 0.3))' },
					'25%': { filter: 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.7))' },
					'50%': { filter: 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.9))' },
					'75%': { filter: 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.7))' },
					'100%': { filter: 'drop-shadow(0 0 2px rgba(14, 165, 233, 0.3))' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'wave': 'wave 3s ease-in-out infinite',
				'marquee': 'marquee 15s linear infinite'
			},
			backgroundImage: {
				'gradient-wave': 'linear-gradient(90deg, #8B5CF6 0%, #0EA5E9 100%)',
				'gradient-peach': 'linear-gradient(90deg, #F9A8D4 0%, #D946EF 100%)',
				'gradient-sunset': 'linear-gradient(90deg, #F97316 0%, #D946EF 100%)',
				'gradient-ocean': 'linear-gradient(90deg, #0EA5E9 0%, #86EFAC 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
