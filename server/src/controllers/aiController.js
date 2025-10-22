const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');
const Course = require('../models/Course');

// Initialize Gemini-pro
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize YouTube API
const youtube = google.youtube('v3');

const generateCourseContent = async (req, res) => {
  try {
    const { courseId, topic } = req.body;

    // Generate course content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate course outline
    const outlinePrompt = `Create a detailed course outline for ${topic} with the following structure:
    1. Course Overview
    2. 5 Main Sections (each with 3-4 subsections)
    3. Key Learning Objectives
    4. Quiz Questions for each section (3 multiple choice questions per section)`;

    const outlineResult = await model.generateContent(outlinePrompt);
    const outline = outlineResult.response.text();

    // Generate detailed content for each section
    const contentPrompt = `Create detailed educational content for a course about ${topic}. Include:
    1. Comprehensive explanations
    2. Real-world examples
    3. Practice exercises
    4. Key takeaways`;

    const contentResult = await model.generateContent(contentPrompt);
    const content = contentResult.response.text();

    // Search for relevant YouTube videos
    const videoSearchResult = await youtube.search.list({
      part: ['snippet'],
      q: `${topic} tutorial education`,
      maxResults: 5,
      type: ['video'],
      videoEmbeddable: 'true',
      key: process.env.YOUTUBE_API_KEY
    });

    const videos = videoSearchResult.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url
    }));

    // Generate quizzes
    const quizPrompt = `Create 5 multiple choice quiz questions about ${topic}. For each question, provide:
    1. Question text
    2. 4 possible answers
    3. The correct answer
    4. An explanation of why it's correct`;

    const quizResult = await model.generateContent(quizPrompt);
    const quizzes = quizResult.response.text();

    // Update the course in the database
    await Course.findByIdAndUpdate(courseId, {
      outline,
      content,
      videos,
      quizzes,
      isAIGenerated: true,
      lastUpdated: new Date()
    });

    res.json({
      success: true,
      message: 'Course content generated successfully',
      data: { outline, content, videos, quizzes }
    });
  } catch (error) {
    console.error('Error generating course content:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating course content',
      error: error.message
    });
  }
};

const generatePersonalizedPath = async (req, res) => {
  try {
    const { userId, interests, skillLevel } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Create a personalized learning path for a student with:
    Interests: ${interests.join(', ')}
    Skill Level: ${skillLevel}
    
    Include:
    1. Recommended course sequence
    2. Estimated time commitment
    3. Learning milestones
    4. Practical projects`;

    const result = await model.generateContent(prompt);
    const learningPath = result.response.text();

    res.json({
      success: true,
      data: {
        learningPath,
        userId,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating learning path',
      error: error.message
    });
  }
};

module.exports = {
  generateCourseContent,
  generatePersonalizedPath
};