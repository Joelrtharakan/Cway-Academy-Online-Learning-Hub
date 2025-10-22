import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import CoursePlayer from './pages/CoursePlayer'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import Certificates from './pages/Certificates'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="course/:courseId" element={<CoursePlayer />} />
        <Route path="course/:courseId/lesson/:lessonId" element={<CoursePlayer />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="certificates" element={<Certificates />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App