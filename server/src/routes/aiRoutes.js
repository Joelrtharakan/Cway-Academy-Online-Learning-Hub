const express = require('express');
const router = express.Router();
const { generateCourseContent, generatePersonalizedPath } = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Generate content for a course
router.post('/courses/generate-content', auth, generateCourseContent);

// Generate personalized learning path
router.post('/generate-learning-path', auth, generatePersonalizedPath);

module.exports = router;