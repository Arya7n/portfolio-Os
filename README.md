# PORTFOLIO

An interactive developer portfolio that runs as a desktop OS. Boot in, open apps for experience, projects, and skills, or use the terminal.

> My resume is an operating system.

## What’s inside

- Boot sequence into a windowed desktop
- Apps: About, Experience, Projects, Skills, Resume, GitHub, Contact, Terminal, Files, Settings
- Recruiter Mode for a straight resume view
- Terminal with a small shell (`cat resume.txt`, `open projects`, `ps`, `top`, `hire`)
- Three.js wallpaper scenes (Harbor, Ember, Slate, Noir)
- Spotlight, app launcher, snap, Alt-Tab, lock screen

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · Zustand · Framer Motion · Three.js

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

```bash
npm run build
npm run preview
```

## Shortcuts

| Keys | Action |
| --- | --- |
| `Ctrl/Cmd + K` | App launcher |
| `Ctrl/Cmd + Space` | Spotlight |
| `Ctrl/Cmd + Tab` | Switch windows |
| `Ctrl/Cmd + \`` | Terminal |
| `Esc` | Close menus |

In the terminal, type `help`.
