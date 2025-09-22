# Micro-Task Market - React + Vite Demo

A complete micro-task marketplace demo built with **React 19.1.1**, **Vite**, and **Tailwind CSS v3.4.1**. This mobile-first application connects task posters with workers, featuring a trust system, proof verification, and dispute management.

## 🚀 Features

- **Task Management**: Post tasks with single-take or application modes
- **Trust System**: Users earn trusted badges after 3 completed tasks
- **Proof System**: Photo-based proof with before/after images
- **Dispute Resolution**: Task manager dashboard for handling disputes
- **Auto-pick Logic**: Intelligent worker selection based on trust, distance, and timing
- **Escrow System**: Required for high-value tasks (≥₦5000) with proof upload
- **Mobile-first Design**: Optimized for mobile devices with responsive design

## 🛠 Technology Stack

- **React 19.1.1** - Latest React with new features
- **Vite** - Fast build tool and development server
- **Tailwind CSS v3.4.1** - Utility-first CSS framework
- **JavaScript (ES6+)** - No TypeScript, pure JavaScript implementation
- **React Router** - Client-side routing
- **LocalStorage** - Data persistence (demo purposes)

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
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main app layout with navigation
│   ├── TaskCard.jsx    # Task display component
│   └── ImageUpload.jsx # Image upload handler
├── pages/              # Page components
│   ├── Home.jsx        # Task board / home page
│   ├── PostTask.jsx    # Task creation form
│   ├── TaskDetailPage.jsx # Individual task details
│   ├── ProfilePage.jsx # User profiles
│   ├── ManagerPage.jsx # Task manager dashboard
│   └── AdminPage.jsx   # Demo admin panel
├── hooks/              # Custom React hooks
│   └── useAppState.js  # Global state management
├── utils/              # Utility functions
│   ├── types.js        # JSDoc type definitions
│   ├── storage.js      # LocalStorage utilities
│   └── seedData.js     # Sample data
└── App.jsx             # Main app component
```

## ✨ Key Features Explained

### Task Modes

**Single Mode (First-come-first-served)**

- Workers can immediately "Take job"
- Task becomes reserved by first taker
- Suitable for urgent or simple tasks

**Applications Mode**

- Up to 3 workers can apply
- Poster reviews applications and chooses
- Auto-pick after 30 minutes (simulated via admin)

### Trust System

- Users start untrusted
- Complete 3 tasks successfully → earn "Trusted" badge
- Trusted users get priority in auto-pick algorithm
- Trust status shown on profiles and task applications

### Proof & Verification

- Tasks can require photo proof (before/after images)
- Images stored as base64 in localStorage
- Poster reviews proof and confirms completion
- 6-hour response window before Task Manager intervention

### Escrow System

- Automatically required for tasks ≥₦5000
- Poster uploads transfer screenshot as proof of funds
- Visual indicator on task cards
- Simulated payment system (no real money)

### Dispute Management

- Workers can report "I wasn't paid"
- Posters can dispute task completion
- Task Manager dashboard shows all disputes
- Resolution options: Mark Paid, Partial Pay, Rework, Escalate

## 👥 Demo Users

The app comes with pre-loaded demo users:

1. **Aunty Z** - Trusted user (5 completed tasks, ₦2400 earnings)
2. **Jide** - New user (2 completed tasks, ₦800 earnings)
3. **Ngozi** - Trusted user (8 completed tasks, ₦4200 earnings)
4. **Sani** - Task Manager (handles disputes and confirmations)

## 🎮 How to Use

### Homepage

Visit the root route `/` to see the landing page with:

- Hero section introducing the Micro-Task Market concept
- Feature cards explaining Quick Reserve, Apply & Choose, Proof & Pay, and Task Manager
- Visual flow diagrams showing Simple vs Skilled task workflows
- Links to sign up or login to access the full application

### Task Board

1. **Browse Tasks**: Home page shows all available tasks
2. **Post Task**: Use the "+" button to create new tasks
3. **Take/Apply**: Click "Take job" or "Apply" on task cards
4. **Complete Work**: Mark tasks done, upload proof if required
5. **Confirm Payment**: Posters review and confirm completion
6. **Admin Panel**: Switch users, trigger auto-picks, reset demo
7. **Manager Dashboard**: Handle disputes and overdue confirmations

## 🔧 Admin Features

- **Switch Users**: Act as any demo user to test flows
- **Trigger Auto-pick**: Force automatic worker selection
- **Simulate Delays**: Test 6-hour timeout alerts
- **Reset Demo**: Restore original sample data

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Micro-Task Market demo"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/micro-task-market.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project
   - Click "Deploy"
   - Your app will be live at `https://micro-task-market.vercel.app`

### Deploy to Netlify

1. **Build the project:**

```bash
npm run build
```

2. **Deploy to Netlify:**
   - Drag the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
   - Or connect your GitHub repo on [app.netlify.com](https://app.netlify.com)

## 📝 Technical Notes

- **No Backend**: Pure frontend app using localStorage
- **Simulated Payments**: No real money transactions
- **Image Storage**: Files converted to base64 and stored locally
- **Demo Data**: All data resets when localStorage is cleared
- **Mobile Optimized**: Designed mobile-first with responsive breakpoints

## 🎨 UI/UX Highlights

- **Accessibility**: High contrast, large touch targets, screen reader friendly
- **Micro-interactions**: Smooth transitions and hover states
- **Mobile-first**: Optimized for mobile with desktop responsive design
- **Visual Hierarchy**: Clear typography and spacing using Tailwind CSS
- **Status Indicators**: Color-coded badges and clear task states

## 🐛 Known Limitations

- Data is stored locally (clears when browser storage is cleared)
- No real payment integration (simulation only)
- Images stored as base64 (not optimized for large files)
- Single browser/device session (no sync across devices)

## 🤝 Contributing

This is a demo project. For production use, consider:

- Real backend API integration
- User authentication system
- Real payment processing (Stripe, PayStack, etc.)
- Image optimization and cloud storage
- Push notifications
- Offline support

## 📄 License

MIT License - Feel free to use this code for learning and development purposes.

---

**Built with React 19.1.1 + Vite + Tailwind CSS v3.4.1**

For questions or support, please check the GitHub repository issues.
