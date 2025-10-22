# Cway Academy - Online Learning Management System

A comprehensive MERN stack learning management system with quizzes, discussions, certificates, and analytics.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Student/Tutor/Admin)
- **Course Management**: Create, manage, and enroll in courses with video lessons
- **Interactive Quizzes**: Multiple choice, multiple answer, and true/false questions with auto-grading
- **Real-time Discussions**: Socket.IO powered chat rooms for courses and lessons
- **Certificates**: PDF certificate generation with QR code verification
- **Live Polls**: Real-time polling during lessons
- **Analytics Dashboard**: Comprehensive analytics for tutors and admins
- **Gamification**: Badges and leaderboards
- **AI Quiz Assist**: Mock AI-powered quiz question generation

## Tech Stack

### Frontend
- React 18 with Vite
- Material UI for components
- React Query for data fetching
- Zustand for state management
- Socket.IO client for real-time features
- React Player for video playback
- Chart.js for analytics

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- PDFKit for certificate generation
- Multer for file uploads

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone and setup the monorepo:**
   ```bash
   git clone <repository-url>
   cd cway-academy
   npm install
   ```

2. **Environment Setup:**

   Copy the example environment files:
   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

   Update `server/.env` with your MongoDB connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/cway-academy
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

   This will start both the client (http://localhost:5173) and server (http://localhost:4000).

## Demo Accounts

After seeding, you can login with these accounts:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@cway.ac         | P@ssw0rd!  |
| Tutor   | tutor.ai@cway.ac      | P@ssw0rd!  |
| Tutor   | tutor.math@cway.ac    | P@ssw0rd!  |
| Student | ali.student@cway.ac   | P@ssw0rd!  |
| Student | rina.student@cway.ac  | P@ssw0rd!  |
| Student | dev.student@cway.ac   | P@ssw0rd!  |

## Demo Flow

1. **Login as a student** (e.g., ali.student@cway.ac)
2. **Browse courses** and enroll in "Intro to Data Structures"
3. **Watch lesson videos** and complete the quiz
4. **View quiz results** and download certificate
5. **Participate in discussions** using the chat feature
6. **Login as tutor** (tutor.ai@cway.ac) to see analytics

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - List courses (with pagination/search)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (tutor/admin)
- `POST /api/courses/:id/enrol` - Enroll in course (student)

### Quizzes
- `GET /api/quizzes/:id` - Get quiz questions
- `POST /api/quizzes/:id/attempts` - Start quiz attempt
- `PATCH /api/attempts/:id/submit` - Submit quiz answers

### Certificates
- `POST /api/certificates` - Generate certificate
- `GET /api/certificates/verify/:code` - Verify certificate

### Analytics
- `GET /api/analytics/course/:id` - Course analytics (tutor/admin)
- `GET /api/analytics/system` - System analytics (admin)

## Project Structure

```
cway-academy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   └── services/      # API and socket services
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth/validation middleware
│   │   └── utils/         # Helper utilities
│   └── storage/           # File uploads and mock data
└── docs/                  # Documentation
```

## Development

### Running Tests
```bash
# Run all tests
npm run test

# Run client tests only
cd client && npm run test

# Run server tests only
cd server && npm run test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
# Build client
cd client && npm run build

# Build server
cd server && npm run build
```

## Deployment

### Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment Variables

#### Client (.env)
```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

#### Server (.env)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/cway-academy
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
CLIENT_URL=http://localhost:5173
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the MIT License.