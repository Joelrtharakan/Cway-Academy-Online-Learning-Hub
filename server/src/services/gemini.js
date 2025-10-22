import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export class GeminiService {
  /**
   * Generate a comprehensive course outline with learning objectives
   */
  static async generateCourseOutline(topic, difficulty = 'intermediate', duration = '8 weeks') {
    const prompt = `
Create a comprehensive course outline for "${topic}" at ${difficulty} level, designed for ${duration} duration.

Please provide a detailed course structure with:
1. Course title and description
2. Learning objectives (5-8 main objectives)
3. Prerequisites
4. Target audience
5. Course sections with detailed breakdown:
   - Section title
   - Section description
   - Number of lessons in each section
   - Estimated time for each section
   - Key topics covered

Format the response as a valid JSON object with this structure:
{
  "title": "Course Title",
  "description": "Course description",
  "objectives": ["Objective 1", "Objective 2", ...],
  "prerequisites": ["Prerequisite 1", "Prerequisite 2", ...],
  "targetAudience": "Description of target audience",
  "difficulty": "${difficulty}",
  "duration": "${duration}",
  "sections": [
    {
      "title": "Section Title",
      "description": "Section description",
      "lessonCount": 5,
      "estimatedHours": 4,
      "topics": ["Topic 1", "Topic 2", ...]
    }
  ]
}
`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
      return JSON.parse(cleanedText)
    } catch (error) {
      console.error('Error generating course outline:', error)
      throw new Error('Failed to generate course outline')
    }
  }

  /**
   * Generate detailed lesson content with learning materials
   */
  static async generateLessonContent(sectionTitle, lessonTitle, topics, difficulty) {
    const prompt = `
Create detailed content for a lesson in the "${sectionTitle}" section.

Lesson: "${lessonTitle}"
Topics to cover: ${topics.join(', ')}
Difficulty level: ${difficulty}

Please provide:
1. Lesson objectives (3-5 specific objectives)
2. Key concepts to explain
3. Step-by-step learning approach
4. Practice exercises or examples
5. Common mistakes to avoid
6. Real-world applications

Format as JSON:
{
  "objectives": ["Objective 1", "Objective 2", ...],
  "keyConcepts": ["Concept 1", "Concept 2", ...],
  "learningApproach": ["Step 1", "Step 2", ...],
  "exercises": ["Exercise 1", "Exercise 2", ...],
  "commonMistakes": ["Mistake 1", "Mistake 2", ...],
  "applications": ["Application 1", "Application 2", ...],
  "textNotes": "Detailed lesson notes in markdown format"
}
`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
      return JSON.parse(cleanedText)
    } catch (error) {
      console.error('Error generating lesson content:', error)
      throw new Error('Failed to generate lesson content')
    }
  }

  /**
   * Generate quiz questions for a lesson
   */
  static async generateQuizQuestions(lessonTitle, topics, difficulty, questionCount = 5) {
    const prompt = `
Create ${questionCount} quiz questions for the lesson "${lessonTitle}" covering: ${topics.join(', ')}

Difficulty: ${difficulty}

Generate a mix of question types:
- Multiple Choice (MCQ): 40%
- Multiple Answer (MAQ): 30%
- True/False (TF): 30%

Each question should have:
- Question type
- Question prompt
- Options (for MCQ/MAQ/TF)
- Correct answers
- Points (1-3)
- Explanation

Format as JSON array:
[
  {
    "type": "MCQ",
    "prompt": "Question text",
    "options": [
      {"key": "A", "text": "Option A"},
      {"key": "B", "text": "Option B"}
    ],
    "answerKeys": ["A"],
    "points": 2,
    "explanation": "Explanation of the correct answer"
  }
]
`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
      return JSON.parse(cleanedText)
    } catch (error) {
      console.error('Error generating quiz questions:', error)
      throw new Error('Failed to generate quiz questions')
    }
  }

  /**
   * Generate learning path recommendations
   */
  static async generateLearningPath(userSkillLevel, interests, goals, availableTime) {
    const prompt = `
Create a personalized learning path based on:
- Current skill level: ${userSkillLevel}
- Interests: ${interests.join(', ')}
- Learning goals: ${goals}
- Available time per week: ${availableTime} hours

Provide:
1. Recommended courses in order
2. Estimated completion time for each
3. Prerequisites for each course
4. Weekly study schedule
5. Milestones and checkpoints

Format as JSON:
{
  "courses": [
    {
      "title": "Course Title",
      "description": "Why this course",
      "estimatedHours": 20,
      "prerequisites": ["Skill 1", "Skill 2"],
      "order": 1
    }
  ],
  "schedule": {
    "weeklyHours": ${availableTime},
    "sessionsPerWeek": 3,
    "sessionDuration": "1.5 hours",
    "schedule": ["Monday: Topic A", "Wednesday: Topic B", "Friday: Topic C"]
  },
  "milestones": ["Milestone 1", "Milestone 2", ...]
}
`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
      return JSON.parse(cleanedText)
    } catch (error) {
      console.error('Error generating learning path:', error)
      throw new Error('Failed to generate learning path')
    }
  }
}