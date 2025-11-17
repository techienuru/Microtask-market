# JobBridge - React + Vite Demo

A complete micro-task marketplace frontend built with **React 19.1.1**, **Vite**, and **Tailwind CSS v3.4.1**. This mobile-first application connects task posters with workers, featuring authentication, task management, and API integration.

## 🚀 Features

- **User Authentication**: Sign up, login with email/phone, OTP verification
- **Task Management**: Post and browse tasks with single/application modes
- **API Integration**: RESTful API client with cookie-based authentication
- **Proof System**: Photo upload system for task completion
- **Role-based Access**: Worker and poster roles with different capabilities
- **Mobile-first Design**: Optimized for mobile devices with responsive design

## 🛠 Technology Stack

- **React 18.2.1** - Latest React with new features
- **Vite** - Fast build tool and development server
- **Tailwind CSS v3.4.1** - Utility-first CSS framework
- **JavaScript (ES6+)** - No TypeScript, pure JavaScript implementation
- **React Router** - Client-side routing
- **Fetch API** - HTTP client with cookie-based authentication

## 🏁 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone or download the project
cd micro-task-market

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── lib/                # API client and utilities
│   └── api.js         # Fetch wrapper and API endpoints
├── contexts/          # React contexts
│   └── AuthProvider.jsx # Authentication context and route protection
├── components/          # Reusable UI components
│   ├── Header.jsx      # App header with navigation
│   ├── Footer.jsx      # App footer
│   ├── TaskCard.jsx    # Task display component
│   ├── ProofUploader.jsx # File upload for task proof
│   ├── Modal.jsx       # Modal dialog component
│   ├── Toast.jsx       # Toast notifications
│   └── FeatureCard.jsx # Feature display card
├── pages/              # Page components
│   ├── HomePage.jsx    # Landing page with hero and features
│   ├── LoginPage.jsx   # User login with email/phone and OTP
│   ├── SignUpPage.jsx  # User registration with OTP verification
│   ├── TasksPage.jsx   # Task board / browse tasks
│   └── PostTaskPage.jsx # Task creation form
└── App.jsx             # Main app component
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

The frontend expects the backend API to be available at the specified URL.

## ✨ Key Features Explained

### Homepage Route

The homepage (`/`) serves as a landing page featuring:

- Hero section with app name "Jobbridge" and value proposition
- Feature cards explaining Quick Reserve, Apply & Choose, Proof & Pay, and Task Manager
- Visual flow diagrams showing Simple vs Skilled task workflows
- Links to sign up or login to access the full application
- Footer with team information and demo notes

### Authentication System

- **Sign Up**: Collects name, email, phone, password, role, location with OTP verification
- **Login**: Supports email/phone + password or OTP-only login
- **Route Protection**: Unauthenticated users redirected to login
- **Cookie-based Auth**: Uses `credentials: 'include'` for session management

### Task System

- **Browse Tasks**: Filter by all, available, or user's jobs
- **Post Tasks**: Create tasks with single/application modes
- **Task Actions**: Reserve jobs or apply with notes
- **Proof Upload**: Photo-based completion verification

## 📡 API Integration

The frontend expects these API endpoints:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/request-otp` - Request OTP code
- `POST /api/auth/verify-otp` - Verify OTP code

### Tasks

- `GET /api/tasks` - List tasks with optional filters
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks/:id/reserve` - Reserve a task
- `POST /api/tasks/:id/apply` - Apply for a task
- `POST /api/tasks/:id/proof` - Upload task completion proof

### Users

- `GET /api/users/me` - Get current user profile
- `GET /api/users/me/postings` - Get user's posted tasks
- `GET /api/users/me/jobs` - Get user's job history

### Admin

- `POST /api/admin/seed` - Seed demo data

## 🎮 Usage

### Development

1. **Start the frontend**: `npm run dev`
2. **Set up backend**: Ensure your backend API is running at `VITE_API_URL`
3. **Test authentication**: Sign up new users or login existing ones
4. **Browse tasks**: View and interact with tasks on the task board
5. **Post tasks**: Create new tasks using the post form

### Key User Flows

1. **New User**: Sign up → OTP verification → Login → Browse/Post tasks
2. **Existing User**: Login (password or OTP) → Task board → Take jobs or post tasks
3. **Task Completion**: Reserve job → Complete work → Upload proof → Get paid

## 🔧 Development Notes

### API Client

- All requests use `credentials: 'include'` for cookie-based auth
- Automatic JSON parsing and error handling
- Centralized endpoint definitions in `src/lib/api.js`

### Authentication Context

- React Context provides `currentUser`, `login()`, `logout()` helpers
- `RequireAuth` wrapper protects routes from unauthenticated access
- Automatic auth check on app mount

### Component Architecture

- Functional components with hooks
- Reusable UI components (Modal, Toast, TaskCard)
- Responsive design with Tailwind CSS
- Accessible forms with proper ARIA labels

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Build the project:**

```bash
npm run build
```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set environment variable `VITE_API_URL` to your backend URL
   - Vercel will auto-detect it's a Vite project and deploy

### Deploy to Netlify

1. **Build the project:**

```bash
npm run build
```

2. **Deploy to Netlify:**
   - Drag the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
   - Or connect your GitHub repo and set `VITE_API_URL` environment variable

## 📝 Technical Notes

- **Frontend Only**: This is a pure frontend application that requires a separate backend API
- **Cookie Authentication**: Uses HTTP-only cookies for secure authentication
- **File Uploads**: Supports FormData uploads for task proof images
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Proper loading indicators for all async operations

## 🎨 UI/UX Highlights

- **Mobile-First**: Designed for mobile with responsive breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Visual Feedback**: Loading states, error messages, success notifications
- **Modern Design**: Clean interface with consistent spacing and typography
- **Toast Notifications**: Non-intrusive feedback for user actions

## 🐛 Known Limitations

- Requires backend API to be fully functional
- Some pages show "Not implemented on server yet" placeholders
- File uploads limited to images only
- No offline support (requires internet connection)

## 🤝 Contributing

For production deployment, ensure:

- Backend API implements all expected endpoints
- Proper CORS configuration for frontend domain
- HTTPS for production (required for secure cookies)
- Environment variables properly configured

## 📄 License

MIT License - Feel free to use this code for learning and development purposes.

---

**Built with React 19.1.1 + Vite + Tailwind CSS v3.4.1**

**Frontend-only application - requires separate backend API**

For questions or support, please check the GitHub repository issues.
