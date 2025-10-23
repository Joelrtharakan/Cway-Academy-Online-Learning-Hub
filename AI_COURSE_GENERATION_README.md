# AI Course Generation Feature

This feature allows tutors and administrators to automatically generate complete courses using Google Gemini Pro AI and YouTube API integration.

## Setup

### 1. API Keys Required

Add the following environment variables to your `server/.env` file:

```env
# AI and Video APIs
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
YOUTUBE_API_KEY=your-youtube-api-key-here
```

### 2. Getting API Keys

#### Google Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

#### YouTube Data API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add it to your `.env` file

## Features

### 🤖 AI Course Generation
- **Complete Course Structure**: Automatically generates course outlines, sections, and lessons
- **Learning Objectives**: AI-generated learning goals and prerequisites
- **Detailed Content**: Comprehensive lesson notes and examples
- **Smart Difficulty**: Adapts content based on selected difficulty level

### 📺 YouTube Video Integration
- **Automatic Video Search**: Finds relevant educational videos for each lesson
- **Video Time Frames**: Suggests specific time segments for focused learning
- **Quality Filtering**: Prioritizes high-quality educational channels
- **Fallback Handling**: Gracefully handles cases where no suitable videos are found

### 🧠 AI Quiz Generation
- **Multiple Question Types**: MCQ, MAQ (Multiple Answer), TF (True/False)
- **Adaptive Difficulty**: Questions match the course difficulty level
- **Detailed Explanations**: AI-generated explanations for correct answers
- **Scoring System**: Automatic scoring with configurable passing thresholds

### 📊 Learning Path Generation
- **Personalized Paths**: Creates customized learning journeys
- **Skill Assessment**: Considers user's current skill level
- **Time Management**: Suggests realistic study schedules
- **Progress Tracking**: Milestones and checkpoints

## Usage

### For Tutors/Admins:

1. **Navigate to AI Generator**: Click "AI Generator" in the navigation (only visible for tutors/admins)
2. **Configure Course**:
   - Enter course topic (e.g., "React Development", "Machine Learning")
   - Select difficulty level (Beginner/Intermediate/Advanced)
   - Choose course duration (4-12 weeks)
   - Toggle video and quiz generation options
3. **Generate**: Click "Generate Course" and wait for AI processing
4. **Review & Publish**: Review the generated course and publish when ready

### API Endpoints

#### Generate Course
```http
POST /api/ai/generate-course
Content-Type: application/json

{
  "topic": "React Development",
  "difficulty": "intermediate",
  "duration": "8 weeks",
  "includeVideos": true,
  "includeQuizzes": true
}
```

#### Generate Learning Path
```http
POST /api/ai/generate-learning-path
Content-Type: application/json

{
  "skillLevel": "beginner",
  "interests": ["web development", "javascript"],
  "goals": "Become a full-stack developer",
  "availableTime": 10
}
```

#### Search YouTube Videos
```http
GET /api/ai/youtube/search?query=react%20tutorial&maxResults=5
```

## Technical Implementation

### Backend Services

#### GeminiService (`server/src/services/gemini.js`)
- Handles all AI content generation using Google Gemini Pro
- Generates course outlines, lesson content, and quiz questions
- Uses structured prompts for consistent output formatting

#### YouTubeService (`server/src/services/youtube.js`)
- Searches YouTube Data API for educational videos
- Scores videos based on relevance and educational value
- Extracts video metadata and suggests time frames

### AI Prompts

The system uses carefully crafted prompts to ensure:
- **Consistency**: Structured JSON outputs
- **Quality**: Educational focus and appropriate difficulty
- **Completeness**: Comprehensive course coverage
- **Relevance**: Topic-specific content generation

### Database Integration

Generated courses are stored with:
- Complete course structure (sections → lessons)
- YouTube video URLs with time frames
- AI-generated quiz questions
- Metadata for tracking generation source

## Limitations & Considerations

### API Limits
- **Gemini API**: Rate limits and token costs
- **YouTube API**: Daily quota limits (10,000 units/day for free tier)
- **Content Quality**: AI-generated content should be reviewed before publishing

### Content Review
- AI-generated courses are created as drafts (`published: false`)
- Manual review recommended for accuracy and appropriateness
- Content may need localization or cultural adaptation

### Video Availability
- YouTube videos may be removed or become unavailable
- Time frames are suggestions and may need adjustment
- Consider providing alternative video sources

## Future Enhancements

- **Multi-language Support**: Generate courses in different languages
- **Custom AI Models**: Fine-tune models for specific educational domains
- **Video Transcripts**: Extract and use video transcripts for content generation
- **Interactive Elements**: Generate code examples, diagrams, and interactive exercises
- **Progress Analytics**: Track learner engagement with AI-generated content

## Troubleshooting

### Common Issues

1. **API Key Errors**: Verify API keys are correctly set in `.env`
2. **Quota Exceeded**: Monitor API usage and upgrade plans if needed
3. **Video Not Found**: Some topics may not have suitable educational videos
4. **Generation Timeout**: Complex topics may take longer to generate

### Monitoring

Check server logs for:
- API call successes/failures
- Generation time metrics
- Error rates and types

## Security Considerations

- API keys should be stored securely (environment variables)
- Rate limiting should be implemented for API endpoints
- User authentication required for course generation
- Generated content should be moderated before publishing