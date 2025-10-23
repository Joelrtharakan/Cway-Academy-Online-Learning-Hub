const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Test route to check database connection and data
router.get('/check-data', async (req, res) => {
    try {
        // Get course count
        const courseCount = await Course.countDocuments();
        
        // Get a sample of courses with their details
        const courses = await Course.find()
            .select('title description category totalEnrollments averageRating')
            .limit(5);
        
        // Get enrollment statistics
        const enrollmentStats = await Course.aggregate([
            {
                $group: {
                    _id: null,
                    totalEnrollments: { $sum: "$totalEnrollments" },
                    averageRating: { $avg: "$averageRating" }
                }
            }
        ]);

        res.json({
            status: 'success',
            connection: 'MongoDB connected successfully',
            data: {
                totalCourses: courseCount,
                sampleCourses: courses,
                statistics: enrollmentStats[0] || { totalEnrollments: 0, averageRating: 0 }
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