# Abhishek Chatterjee - Portfolio

A modern, responsive portfolio website built with React 19, Vite, and Tailwind CSS.

**Live Site:** [abhishek1337chatterjee.github.io](https://abhishek1337chatterjee.github.io)

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | React 19, Vite 7, TypeScript |
| **Styling** | Tailwind CSS 4, DaisyUI 5 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Linting** | Biome |
| **CI/CD** | GitHub Actions |
| **Deployment** | GitHub Pages |

## Features

- **Responsive Design** - Works on all devices (320px to 1920px+)
- **Dark Theme** - Navy/cyan/pink color scheme
- **Smooth Animations** - Framer Motion powered transitions
- **Dynamic Typewriter** - Cycling through roles on hero section
- **GitHub Integration** - Live stats from GitHub API
- **Contact Form** - Working form with GetForm.io
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- **Mobile FAB** - Floating action button with vertical stack animation for social links
- **Animated Hamburger** - Modern 3-line menu that morphs into X
- **Auto Deploy** - GitHub Actions CI/CD with Biome lint checks
- **Deployment Tracking** - Commit SHA displayed in footer for version verification

## Sections

| Section | Description |
|---------|-------------|
| **Hero** | Animated intro with typewriter effect, profile image |
| **About** | Professional summary, highlight cards, resume download |
| **Skills** | Cloud & Serverless, Backend, Tools & Platforms, Frontend |
| **Projects** | Featured work with live demos and source links |
| **GitHub Stats** | Custom stat cards, language bar, contribution calendar |
| **Contact** | Contact form with validation |

## Project Structure

```
src/
├── assets/           # Images, profile pic, project screenshots
├── components/
│   ├── layout/       # Navbar, SocialSidebar, Footer
│   └── sections/     # Hero, About, Skills, Projects, GitHubStats, Contact
├── data/             # Skills, projects, social links data
├── hooks/            # Custom hooks (useGitHubStats)
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 24+ (LTS)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/abhishek1337chatterjee/abhishek1337chatterjee.github.io.git

# Navigate to directory
cd abhishek1337chatterjee.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Deploy

```bash
# Build for production
npm run build
```

Deployment is automated via GitHub Actions. Push to `master` branch triggers:
1. Biome lint check
2. TypeScript + Vite build
3. Deploy to GitHub Pages

The commit SHA is injected at build time and displayed in the footer.

## Configuration

### Contact Form
The contact form uses [GetForm.io](https://getform.io/). Update the form action URL in `src/components/sections/Contact.tsx`.

### GitHub Stats
Update the username in `src/components/sections/GitHubStats.tsx` and `src/hooks/useGitHubStats.ts`.

### SEO
Update meta tags in `index.html` for your own information.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |
| `npm run check` | Run Biome lint + format |

---

Built with React 19 + Vite + Tailwind CSS
