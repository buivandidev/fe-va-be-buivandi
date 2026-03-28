# Next.js Phường Xã - Phase 1 Setup Complete ✅

Migration from React Vite to Next.js 15 with focus on SEO optimization.

## 📁 Project Structure

```
nextjs-phuongxa/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (public)/           # Public pages with layout
│   │   │   ├── layout.tsx      # PublicLayout (header + footer)
│   │   │   └── page.tsx        # HomePage (SSG)
│   │   ├── admin/              # Admin pages
│   │   │   ├── layout.tsx      # AdminLayout (sidebar + auth)
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login page
│   │   │   └── dashboard/
│   │   │       └── page.tsx    # Dashboard
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles with Tailwind
│   │   └── not-found.tsx       # 404 page
│   ├── components/             # React components
│   │   ├── layouts/
│   │   ├── auth/
│   │   ├── shared/
│   │   ├── news/
│   │   ├── services/
│   │   └── dashboard/
│   ├── lib/                    # Utilities and helpers
│   │   ├── api/
│   │   │   └── client.ts       # Axios client
│   │   ├── auth/
│   │   │   ├── session.ts      # Server-side auth
│   │   │   └── cookies.ts      # Cookie management
│   │   ├── utils/
│   │   │   ├── formatters.ts   # Date/text formatting
│   │   │   └── constants.ts    # Constants
│   │   └── config/
│   │       └── environment.ts  # Environment variables
│   ├── store/                  # Zustand stores
│   │   ├── auth.store.ts
│   │   └── toast.store.ts
│   └── middleware.ts           # Auth middleware
├── public/                     # Static files
├── .env.local                 # Environment variables
├── next.config.mjs            # Next.js config
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
├── postcss.config.js          # PostCSS config
└── package.json               # Dependencies
```

## ✅ Phase 1 Completed

- ✅ Created Next.js 15 project with TypeScript
- ✅ Setup folder structure (app router, components, lib, store)
- ✅ Copied and adapted Tailwind CSS config with custom styles
- ✅ Migrated core utilities (formatters, constants, environment)
- ✅ Setup authentication infrastructure:
  - ✅ `middleware.ts` - Auth protection for /admin routes
  - ✅ `lib/auth/session.ts` - Server-side session helpers
  - ✅ `lib/auth/cookies.ts` - HTTP-only cookie management
- ✅ Created API client layer with axios
- ✅ Created basic layouts and pages
- ⏳ Install dependencies (next: npm install)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd d:\febecuoiki\nextjs-phuongxa
npm install
```

Or with Yarn:
```bash
yarn install
```

Or with pnpm:
```bash
pnpm install
```

### 2. Setup Environment Variables

The `.env.local` file is already created with default values:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5187
API_BASE_URL=http://localhost:5187
NODE_ENV=development
```

Update these for your environment if needed.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: [http://localhost:3000](http://localhost:3000)

## 📋 Available Routes

### Public Routes
- `/` - Home page (SSG)
- `/admin/login` - Admin login (public)

### Admin Routes (protected)
- `/admin/dashboard` - Dashboard (requires auth)

More routes will be added in Phase 2!

## 🔐 Authentication

### How It Works

1. **Login**: User submits credentials to `/api/auth/login`
2. **Cookie Storage**: JWT token stored in HTTP-only cookie
3. **Middleware Protection**: `/admin/*` routes protected by middleware
4. **Session Verification**: `getSession()` verifies token with backend

### Key Files

- `middleware.ts` - Route protection
- `lib/auth/session.ts` - Server-side auth helpers
  - `getSession()` - Get current user session
  - `requireAuth()` - Require authentication
  - `requireRole()` - Require specific role
- `lib/auth/cookies.ts` - Cookie management

## 🎨 Tailwind CSS

Tailwind CSS v4 is configured with custom colors from CSS variables:

```css
--bg: #fdfcf9          /* Background */
--bg-soft: #ffffff     /* Soft background */
--ink: #0f172a         /* Text color */
--ink-muted: #475569   /* Muted text */
--brand: #0891b2       /* Primary brand color */
--brand-dark: #164e63  /* Darker brand */
--accent: #f59e0b      /* Accent color */
--success: #10b981     /* Success color */
--danger: #ef4444      /* Danger/error color */
```

Custom utility classes:
- `.container-page` - Max width container
- `.panel` - Card with shadow and hover effect
- `.glass` - Glassmorphism effect
- `.text-gradient` - Gradient text
- `.skeleton-line` / `.skeleton-block` - Loading skeleton

## 📦 Core Dependencies

- **next**: App framework
- **react**: UI library
- **axios**: HTTP client
- **zustand**: State management
- **date-fns**: Date utilities
- **chart.js**: Charts
- **react-chartjs-2**: React wrapper for charts
- **tailwindcss**: CSS framework
- **typescript**: Type safety

## 🔗 Next Steps (Phase 2)

1. Migrate API client services layer
2. Create shared components (Section, Button)
3. Implement layouts (PublicLayout, AdminLayout)
4. Implement authentication flow

## 📖 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

This project uses strict TypeScript and follows React best practices.

## 📝 Notes

- All environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Server-only environment variables should not have this prefix
- Authentication is handled server-side with middleware for security
- Cookies are HTTP-only to prevent XSS attacks
