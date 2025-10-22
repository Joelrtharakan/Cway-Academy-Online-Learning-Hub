import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [{
    title: { type: String, required: true },
    order: { type: Number, required: true },
    videoUrl: { type: String, required: true },
    resources: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
    }],
    textNotes: { type: String },
    durationSec: { type: Number, default: 0 },
  }],
})

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sections: [sectionSchema],
  price: { type: Number },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MCQ', 'MAQ', 'TF'], required: true },
  prompt: { type: String, required: true },
  options: [{
    key: { type: String, required: true },
    text: { type: String, required: true },
  }],
  answerKeys: [{ type: String, required: true }],
  points: { type: Number, default: 1 },
})

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, required: true },
  timeLimitSec: { type: Number, default: 600 },
  attemptsAllowed: { type: Number, default: 1 },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
})

const attemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    qid: { type: String, required: true },
    selectedKeys: [{ type: String }],
  }],
  score: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date },
  detail: [{
    qid: { type: String, required: true },
    correct: { type: Boolean, default: false },
  }],
})

const discussionMessageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  scorePct: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
  verifyCode: { type: String, required: true, unique: true },
  pdfUrl: { type: String, required: true },
})

const pollSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  question: { type: String, required: true },
  options: [{
    key: { type: String, required: true },
    text: { type: String, required: true },
  }],
  counts: { type: Map, of: Number, default: {} },
  isOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

const badgeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
})

const userBadgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
  awardedAt: { type: Date, default: Date.now },
})

// Indexes
courseSchema.index({ slug: 1 })
discussionMessageSchema.index({ room: 1, createdAt: -1 })
attemptSchema.index({ quiz: 1, student: 1 })

export const User = mongoose.model('User', userSchema)
export const Course = mongoose.model('Course', courseSchema)
export const Quiz = mongoose.model('Quiz', quizSchema)
export const Attempt = mongoose.model('Attempt', attemptSchema)
export const DiscussionMessage = mongoose.model('DiscussionMessage', discussionMessageSchema)
export const Certificate = mongoose.model('Certificate', certificateSchema)
export const Poll = mongoose.model('Poll', pollSchema)
export const Badge = mongoose.model('Badge', badgeSchema)
export const UserBadge = mongoose.model('UserBadge', userBadgeSchema)