const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// Get all courses
router.get('/courses', courseController.getCourses);

// Get enrolled courses
router.get('/courses/enrolled', auth, courseController.getEnrolledCourses);

// Get single course
router.get('/courses/:id', courseController.getCourse);

// Create course
router.post('/courses', auth, courseController.createCourse);

// Update course progress
router.post('/courses/:courseId/progress', auth, courseController.updateProgress);

// Enroll in course
router.post('/courses/:id/enroll', auth, courseController.enrollCourse);

// Add course rating
router.post('/courses/:id/rate', auth, courseController.addRating);

module.exports = router;