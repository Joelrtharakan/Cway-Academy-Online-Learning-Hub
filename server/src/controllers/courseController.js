const Course = require('../models/Course');
const { generateCourseContent } = require('./aiController');

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const { aiGenerated, published } = req.query;
    const query = {};
    
    if (aiGenerated) query.isAIGenerated = aiGenerated === 'true';
    if (published) query.isPublished = published === 'true';

    const courses = await Course.find(query)
      .populate('tutor', 'name email')
      .sort('-createdAt');

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// Get enrolled courses for a user
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      'enrollments.user': req.user._id
    }).populate('tutor', 'name email');

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrolled courses',
      error: error.message
    });
  }
};

// Get a single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'name email')
      .populate('enrollments.user', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price, isAIGenerated } = req.body;

    const course = new Course({
      title,
      description,
      category,
      price,
      tutor: req.user._id,
      isAIGenerated
    });

    await course.save();

    if (isAIGenerated) {
      // Generate content using AI
      await generateCourseContent({
        body: { courseId: course._id, topic: title }
      }, res);
    } else {
      res.json({
        success: true,
        message: 'Course created successfully',
        course
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// Update course progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sectionComplete, quizScore } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Find user's enrollment
    const enrollment = course.enrollments.find(
      e => e.user.toString() === req.user._id.toString()
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Update progress
    if (sectionComplete && !enrollment.completedSections.includes(sectionComplete)) {
      enrollment.completedSections.push(sectionComplete);
    }

    if (quizScore) {
      enrollment.quizScores.push({
        quizId: sectionComplete,
        score: quizScore,
        completedAt: new Date()
      });
    }

    // Calculate overall progress
    const totalSections = course.outline.length;
    enrollment.progress = (enrollment.completedSections.length / totalSections) * 100;

    // Check if course is completed
    if (enrollment.progress === 100) {
      enrollment.completedAt = new Date();
    }

    await course.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: enrollment.progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrollments.some(
      enrollment => enrollment.user.toString() === req.user._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add enrollment
    course.enrollments.push({
      user: req.user._id,
      enrolledAt: new Date()
    });

    await course.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in the course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// Add course rating
exports.addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has completed the course
    const enrollment = course.enrollments.find(
      e => e.user.toString() === req.user._id.toString()
    );

    if (!enrollment || !enrollment.completedAt) {
      return res.status(400).json({
        success: false,
        message: 'Must complete the course before rating'
      });
    }

    // Remove existing rating if any
    course.ratings = course.ratings.filter(
      r => r.user.toString() !== req.user._id.toString()
    );

    // Add new rating
    course.ratings.push({
      user: req.user._id,
      rating,
      review,
      createdAt: new Date()
    });

    await course.save();

    res.json({
      success: true,
      message: 'Rating added successfully',
      averageRating: course.averageRating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
};

module.exports = exports;