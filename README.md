# TaskTrack

A comprehensive full-stack task management application designed specifically for university students to enhance productivity and academic success. Built with modern web technologies and featuring an intuitive user interface, TaskTrack helps students organize assignments, track deadlines, and maintain academic progress.

## Overview

TaskTrack addresses the common challenges university students face in managing multiple assignments, projects, and exam deadlines. The application provides a centralized platform for task organization, progress tracking, and productivity insights, helping students stay on top of their academic responsibilities.

## Key Features

### Task Management
- **Comprehensive Task Creation**: Create tasks with titles, descriptions, due dates, and categorization
- **Task Categorization**: Organize tasks by type (Assignments, Exams, Daily Tasks)
- **Status Tracking**: Monitor task progress with status indicators (Pending, In Progress, Completed)
- **Due Date Management**: Visual indicators for approaching deadlines and overdue tasks
- **Task Editing**: Full CRUD operations for task management

### Calendar Integration
- **Interactive Calendar View**: Monthly calendar with task visualization
- **Date-based Task Display**: See all tasks scheduled for specific dates
- **Quick Task Creation**: Add tasks directly from calendar dates
- **Visual Task Indicators**: Color-coded task types for easy identification

### Analytics & Insights
- **Performance Dashboard**: Comprehensive statistics and progress tracking
- **Completion Rates**: Visual progress indicators and completion percentages
- **Task Distribution**: Breakdown of tasks by type and status
- **Time-based Analytics**: Weekly and monthly completion statistics
- **Motivational Feedback**: Performance-based encouragement messages

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface built with Material-UI
- **Real-time Updates**: Instant task status updates and synchronization
- **Secure Authentication**: JWT-based user authentication and authorization

## Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server
- **Date-fns** - Date manipulation and formatting

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Nodemon** - Development server auto-restart
- **Git** - Version control

## Project Structure

```
TaskTrack/
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Authentication middleware
│   │   └── config/          # Database configuration
│   └── package.json
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context providers
│   │   └── assets/          # Static assets
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Task Management
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/tasktrack
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
```

## Development

### Running in Development Mode
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend start
cd backend
npm start
```

## Features in Detail

### Dashboard
- **Task Overview**: Quick statistics and task summaries
- **Status-based Organization**: Tasks grouped by completion status
- **Quick Actions**: One-click task status updates
- **Progress Tracking**: Visual indicators for task completion

### Calendar View
- **Monthly Calendar**: Full month view with task indicators
- **Interactive Dates**: Click to view or create tasks for specific dates
- **Task Badges**: Visual indicators showing number of tasks per day
- **Responsive Design**: Optimized for all screen sizes

### Statistics & Analytics
- **Performance Metrics**: Completion rates and productivity insights
- **Task Distribution**: Breakdown by type and status
- **Time-based Analysis**: Weekly and monthly completion trends
- **Visual Charts**: Progress bars and completion indicators

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for password security
- **User Authorization**: Route protection and user-specific data access
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Configured cross-origin resource sharing

## Performance Optimizations

- **React Context**: Efficient state management
- **Component Optimization**: Memoized components for better performance
- **Lazy Loading**: Optimized component loading
- **Database Indexing**: Optimized database queries
- **Responsive Images**: Optimized asset loading

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**TaskTrack** - Empowering students to achieve academic excellence through effective task management and productivity tracking.