const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');

router.get('/db-test', async (req, res) => {
    try {
        const courseCount = await Course.countDocuments();
        const userCount = await User.countDocuments();
        const courses = await Course.find().limit(5);
        
        res.json({
            status: 'success',
            data: {
                courseCount,
                userCount,
                recentCourses: courses
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;