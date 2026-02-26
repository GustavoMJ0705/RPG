@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.1 0.01 250);
  --foreground: oklch(0.92 0.01 250);
  --card: oklch(0.14 0.01 250 / 0.6);
  --card-foreground: oklch(0.92 0.01 250);
  --popover: oklch(0.12 0.015 250 / 0.9);
  --popover-foreground: oklch(0.92 0.01 250);
  --primary: oklch(0.75 0.15 220);
  --primary-foreground: oklch(0.1 0.01 250);
  --secondary: oklch(0.18 0.01 250);
  --secondary-foreground: oklch(0.85 0.01 250);
  --muted: oklch(0.18 0.01 250);
  --muted-foreground: oklch(0.6 0.02 250);
  --accent: oklch(0.8 0.16 85);
  --accent-foreground: oklch(0.1 0.01 250);
  --destructive: oklch(0.6 0.2 25);
  --destructive-foreground: oklch(0.95 0.02 25);
  --border: oklch(0.25 0.02 250 / 0.5);
  --input: oklch(0.2 0.015 250 / 0.6);
  --ring: oklch(0.75 0.15 220);
  --chart-1: oklch(0.75 0.15 220);
  --chart-2: oklch(0.8 0.16 85);
  --chart-3: oklch(0.6 0.2 25);
  --chart-4: oklch(0.7 0.15 170);
  --chart-5: oklch(0.65 0.18 300);
  --radius: 0.75rem;
  --sidebar: oklch(0.12 0.01 250);
  --sidebar-foreground: oklch(0.92 0.01 250);
  --sidebar-primary: oklch(0.75 0.15 220);
  --sidebar-primary-foreground: oklch(0.1 0.01 250);
  --sidebar-accent: oklch(0.18 0.01 250);
  --sidebar-accent-foreground: oklch(0.92 0.01 250);
  --sidebar-border: oklch(0.25 0.02 250 / 0.5);
  --sidebar-ring: oklch(0.75 0.15 220);

  --neon-cyan: oklch(0.8 0.15 195);
  --neon-gold: oklch(0.85 0.17 85);
  --neon-red: oklch(0.65 0.22 25);
  --glass-bg: oklch(0.12 0.015 250 / 0.4);
  --glass-border: oklch(0.4 0.05 220 / 0.25);
}

@theme inline {
  --font-sans: 'Orbitron', 'Geist', sans-serif;
  --font-mono: 'Share Tech Mono', 'Geist Mono', monospace;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-neon-cyan: var(--neon-cyan);
  --color-neon-gold: var(--neon-gold);
  --color-neon-red: var(--neon-red);
  --color-glass-bg: var(--glass-bg);
  --color-glass-border: var(--glass-border);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes coin-flash {
  0% { box-shadow: 0 0 5px oklch(0.85 0.17 85 / 0.5); }
  50% { box-shadow: 0 0 25px oklch(0.85 0.17 85 / 0.9), 0 0 50px oklch(0.85 0.17 85 / 0.4); }
  100% { box-shadow: 0 0 5px oklch(0.85 0.17 85 / 0.5); }
}

@keyframes border-glow {
  0%, 100% { border-color: oklch(0.75 0.15 220 / 0.3); }
  50% { border-color: oklch(0.75 0.15 220 / 0.7); }
}

@keyframes float-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

.animate-coin-flash {
  animation: coin-flash 0.6s ease-in-out;
}

.animate-border-glow {
  animation: border-glow 3s ease-in-out infinite;
}

.animate-float-in {
  animation: float-in 0.4s ease-out;
}

.glass-panel {
  background: oklch(0.12 0.015 250 / 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid oklch(0.4 0.05 220 / 0.2);
}

.glass-panel-gold {
  background: oklch(0.12 0.015 250 / 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid oklch(0.85 0.17 85 / 0.2);
}

.text-glow-cyan {
  text-shadow: 0 0 10px oklch(0.8 0.15 195 / 0.6), 0 0 20px oklch(0.8 0.15 195 / 0.3);
}

.text-glow-gold {
  text-shadow: 0 0 10px oklch(0.85 0.17 85 / 0.6), 0 0 20px oklch(0.85 0.17 85 / 0.3);
}

.text-glow-red {
  text-shadow: 0 0 10px oklch(0.65 0.22 25 / 0.6), 0 0 20px oklch(0.65 0.22 25 / 0.3);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: oklch(0.4 0.05 220 / 0.3);
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: oklch(0.5 0.08 220 / 0.5);
}
