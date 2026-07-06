# Axita Infrastructure ERP - Agents & AI Integration

Axita Infrastructure ERP is an enterprise construction management platform built with modern TypeScript and React technologies.

## Project Overview

**Framework:** TanStack Start (React + TanStack Router)  
**Styling:** Tailwind CSS  
**State Management:** TanStack Query, React Context  
**Backend:** Nitro (SSR with Netlify deployment)  
**Language:** TypeScript

## Core Features

- **Project Management** - Track construction projects with real-time updates
- **DPR (Daily Progress Report)** - Centralized daily reporting system
- **Labour Tracking** - Contractor management, attendance, productivity
- **Materials Management** - Inventory tracking, purchase orders, GRN workflow
- **Tasks & Approvals** - Task assignment, approval workflows
- **Reports & Analytics** - Comprehensive analytics dashboard
- **Financial Management** - Budgets, payables, site expenses

## Architecture

```
Axita Infrastructure ERP
├── src/
│   ├── routes/           # TanStack Router route definitions
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── styles.css       # Tailwind CSS configuration
├── server/              # Backend services & APIs (separate repo)
├── public/              # Static assets
└── netlify.toml         # Deployment configuration
```

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment

Deployed on **Netlify** with automatic builds from git. The app uses Nitro for server-side rendering and serverless functions.

Live at: https://buildflow-erp-demo.netlify.app (Powered by Axita Infrastructure)
