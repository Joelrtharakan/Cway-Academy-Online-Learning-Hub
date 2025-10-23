const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  outline: [{
    title: String,
    description: String,
    subsections: [{
      title: String,
      content: String
    }]
  }],
  content: [{
    sectionId: String,
    content: String,
    resources: [String]
  }],
  videos: [{
    videoId: String,
    title: String,
    description: String,
    thumbnail: String
  }],
  quizzes: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  enrollments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: Number,
      default: 0
    },
    completedSections: [String],
    quizScores: [{
      quizId: String,
      score: Number,
      completedAt: Date
    }],
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate average rating before saving
courseSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
  }
  next();
});

// Update total enrollments
courseSchema.pre('save', function(next) {
  if (this.enrollments) {
    this.totalEnrollments = this.enrollments.length;
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;