# Abhishek Chatterjee - Portfolio

A modern, responsive portfolio website showcasing professional experience as a Serverless Engineer and React Developer. Built with cutting-edge technologies including React 19, Vite 7, and Tailwind CSS 4, featuring an AI-powered chatbot for interactive visitor engagement.

**Live Site:** [abhishek1337chatterjee.github.io](https://abhishek1337chatterjee.github.io)

## Overview

This portfolio serves as both a professional showcase and a technical demonstration, implementing modern web development practices with a focus on performance, user experience, and SEO optimization. The site features an innovative AI chatbot integration that allows visitors to interactively learn about skills, projects, and experience.

## Key Features

- **AI-Powered ChatBot** - Streaming chatbot with markdown support, phone number detection, and word-by-word animation effects
- **Responsive Design** - Fully responsive from mobile (320px) to ultra-wide displays (1920px+)
- **Performance Optimized** - Code splitting with manual chunks for vendor libraries (React, Framer Motion, AI SDK, Markdown)
- **React Compiler** - Babel plugin integration for React 19's experimental compiler
- **Smooth Animations** - Framer Motion for all transitions, entrance effects, and micro-interactions
- **Dynamic Typewriter** - Rotating role display on hero section
- **GitHub Integration** - Live stats via GitHub API with contribution calendar and language distribution
- **SEO Optimized** - Comprehensive meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **Mobile FAB** - Floating action button with animated social links stack
- **Contact Form** - Working form with GetForm.io integration
- **Auto Deploy** - GitHub Actions CI/CD with Biome lint checks and commit SHA tracking

## Architecture Highlights

### Build Optimization
The project uses Vite's `rollupOptions` to implement strategic code splitting:
- **vendor-react**: Core React libraries isolated
- **vendor-motion**: Framer Motion (large library) separated
- **vendor-markdown**: Markdown rendering isolated
- **vendor-ai**: AI SDK components separated
- **vendor-icons**: Lucide React icons bundled

This approach ensures optimal initial load times and efficient caching strategies.

### AI ChatBot Architecture
The chatbot implementation demonstrates advanced streaming patterns:
- Streaming response handling with word-by-word display effect
- Custom markdown renderer with phone number detection and copy functionality
- In-memory message history management
- Error handling with user-friendly feedback
- Responsive modal interface with smooth animations

### Component Architecture
The application follows a clear separation of concerns:
- **Layout Components**: Persistent UI elements (Navbar, Footer, SocialSidebar)
- **Section Components**: Page sections (Hero, About, Skills, Projects, GitHubStats, Contact)
- **UI Components**: Reusable elements (SectionDivider)
- **Specialized Components**: ChatBot with complex state management

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.2.0 |
| **TypeScript** | Type Safety | 5.9.3 |
| **Vite** | Build Tool | 7.3.1 |
| **Tailwind CSS** | Styling Framework | 4.1.18 |
| **DaisyUI** | Component Library | 5.5.14 |
| **Framer Motion** | Animation Library | 12.24.11 |
| **AI SDK** | Chatbot Integration | 6.0.20 |
| **React Markdown** | Markdown Rendering | 10.1.0 |
| **Lucide React** | Icon System | 0.562.0 |
| **Biome** | Linting & Formatting | 2.3.10 |

## Project Structure

```
abhishek1337chatterjee.github.io/
├── .github/
│   └── workflows/       # GitHub Actions CI/CD pipeline
├── public/
│   ├── data.json        # Portfolio data
│   ├── favicon.svg      # Site favicon
│   ├── og-image.png     # OpenGraph preview image
│   ├── robots.txt       # Search engine directives
│   ├── sitemap.xml      # SEO sitemap
│   └── Abhishek_Chatterjee_Resume.pdf
├── src/
│   ├── assets/
│   │   └── images/      # Project screenshots, profile images
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Navigation with mobile menu
│   │   │   ├── Footer.tsx          # Footer with commit SHA display
│   │   │   └── SocialSidebar.tsx   # Fixed sidebar with social links
│   │   ├── sections/
│   │   │   ├── Hero.tsx            # Hero section with typewriter
│   │   │   ├── About.tsx           # Professional summary
│   │   │   ├── Skills.tsx          # Technical skills grid
│   │   │   ├── Projects.tsx        # Project showcase with tabs
│   │   │   ├── GitHubStats.tsx     # GitHub activity integration
│   │   │   └── Contact.tsx         # Contact form
│   │   ├── ui/
│   │   │   └── SectionDivider.tsx  # Animated section dividers
│   │   └── ChatBot.tsx              # AI chatbot with streaming
│   ├── data/
│   │   ├── projects.ts   # Project data with career phases
│   │   ├── skills.ts     # Technical skills and tools
│   │   └── socials.ts    # Social media links
│   ├── hooks/
│   │   └── useGitHubStats.ts  # GitHub API integration hook
│   ├── utils/
│   │   └── resume.ts     # Resume download utility
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # React application entry point
│   ├── index.css         # Global styles and Tailwind imports
│   └── vite-env.d.ts     # Vite environment types
├── biome.json            # Biome linter configuration
├── index.html            # HTML entry with SEO meta tags
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration (project references)
├── tsconfig.app.json     # App-specific TypeScript config
├── tsconfig.node.json    # Node environment TypeScript config
└── vite.config.ts        # Vite configuration with React compiler
```

## Getting Started

### Prerequisites

- Node.js 24+ (LTS recommended)
- npm 10+ or yarn 1.22+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/abhishek1337chatterjee/abhishek1337chatterjee.github.io.git

# Navigate to project directory
cd abhishek1337chatterjee.github.io

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev
```

### Development

```bash
# Run development server with hot reload
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Run both lint and format
npm run check

# Preview production build
npm run preview
```

### Build & Deploy

```bash
# Build for production
npm run build

# Output directory: dist/
```

**Automated Deployment**: Pushing to the `master` branch triggers GitHub Actions workflow:
1. Code checkout
2. Biome lint verification
3. TypeScript compilation check
4. Vite production build
5. Deployment to GitHub Pages
6. Commit SHA injection into footer

## Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_CHAT_API_URL` | No | ChatBot API endpoint | `http://localhost:3000/api/chat` |

Create `.env` file in project root:
```bash
VITE_CHAT_API_URL=https://your-api-endpoint.com/api/chat
```

### Customization Guide

#### Update Personal Information
1. **Meta Tags**: Edit `index.html` (lines 8-106) for SEO, Open Graph, and structured data
2. **GitHub Stats**: Update username in `src/components/sections/GitHubStats.tsx` and `src/hooks/useGitHubStats.ts`
3. **Contact Form**: Update action URL in `src/components/sections/Contact.tsx`
4. **Projects**: Modify `src/data/projects.ts` to add/remove projects
5. **Skills**: Edit `src/data/skills.ts` for technical skills
6. **Social Links**: Update `src/data/socials.ts` for social media profiles

#### Styling Customization
- **Colors**: Tailwind theme configuration in Tailwind CSS 4 format
- **Fonts**: Update `index.css` for custom font imports
- **Animations**: Framer Motion variants in component files

## Performance Features

### Code Splitting Strategy
Manual chunks defined in `vite.config.ts` optimize bundle size:
- Initial bundle: ~50KB (gzipped)
- Vendor chunks: Lazy loaded based on route/interaction
- Markdown renderer: Loaded only when chatbot opens

### Build Optimizations
- **React Compiler**: Experimental compiler reduces re-renders
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image compression and lazy loading
- **CSS Purging**: Tailwind CSS removes unused styles

### SEO Optimizations
- Semantic HTML structure
- Meta tags for social sharing
- JSON-LD structured data (Person, WebSite schemas)
- Sitemap and robots.txt
- Canonical URLs
- Open Graph and Twitter Card support

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari 14+
- Chrome Android (latest)

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build (TypeScript + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Biome linter on src/ |
| `npm run format` | Format code with Biome |
| `npm run check` | Lint + format with auto-fix |

## Deployment

The site is deployed to GitHub Pages via GitHub Actions. The workflow:

1. **Trigger**: Push to `master` branch
2. **Lint**: Biome checks code quality
3. **Build**: TypeScript compilation + Vite bundling
4. **Deploy**: Artifacts pushed to `gh-pages` branch
5. **Versioning**: Commit SHA displayed in footer for tracking

**Deploy URL**: [https://abhishek1337chatterjee.github.io/](https://abhishek1337chatterjee.github.io/)

## Troubleshooting

### ChatBot Not Responding
- Verify `VITE_CHAT_API_URL` environment variable
- Check API endpoint CORS configuration
- Inspect browser console for network errors

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Verify Node.js version: `node --version` (requires 24+)
- Check TypeScript errors: `npm run build`

### GitHub Actions Deployment Fails
- Check GitHub Pages is enabled in repository settings
- Verify workflow permissions allow writing to repository
- Review Actions logs for specific error messages

## Author

Abhishek Chatterjee <abhishek1337chatterjee@gmail.com>

- GitHub: [@abhishek1337chatterjee](https://github.com/abhishek1337chatterjee)
- LinkedIn: [abhishekchatterjee-saheb1337](https://www.linkedin.com/in/abhishekchatterjee-saheb1337/)
- Twitter: [@Abhishek1337C](https://x.com/Abhishek1337C)
