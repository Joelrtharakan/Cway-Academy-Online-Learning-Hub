import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

export class YouTubeService {
  /**
   * Search for educational videos related to a topic
   */
  static async searchEducationalVideos(query, maxResults = 10, duration = 'medium') {
    try {
      const searchResponse = await youtube.search.list({
        part: 'snippet',
        q: `${query} tutorial course education learn`,
        type: 'video',
        maxResults,
        order: 'relevance',
        safeSearch: 'strict',
        videoDuration: duration, // short, medium, long
        relevanceLanguage: 'en'
      })

      const videoIds = searchResponse.data.items.map(item => item.id.videoId)

      // Get detailed video information
      const videoResponse = await youtube.videos.list({
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(',')
      })

      return videoResponse.data.items.map(video => ({
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url
      }))
    } catch (error) {
      console.error('Error searching YouTube videos:', error)
      throw new Error('Failed to search YouTube videos')
    }
  }

  /**
   * Find the best video for a specific lesson topic
   */
  static async findBestVideoForLesson(lessonTitle, topics, preferredDuration = 'medium') {
    try {
      const query = `${lessonTitle} ${topics.slice(0, 3).join(' ')} tutorial`
      const videos = await this.searchEducationalVideos(query, 5, preferredDuration)

      // Score videos based on relevance
      const scoredVideos = videos.map(video => {
        let score = 0

        // Title relevance
        const titleLower = video.title.toLowerCase()
        const queryLower = query.toLowerCase()
        const titleWords = queryLower.split(' ')
        const matchingWords = titleWords.filter(word =>
          titleLower.includes(word) && word.length > 3
        ).length
        score += matchingWords * 10

        // Channel credibility (educational channels)
        const educationalChannels = ['freeCodeCamp', 'Traversy Media', 'Academind', 'The Net Ninja', 'Kevin Powell']
        if (educationalChannels.some(channel => video.channelTitle.includes(channel))) {
          score += 20
        }

        // View count (popularity)
        const views = parseInt(video.viewCount) || 0
        if (views > 100000) score += 15
        else if (views > 50000) score += 10
        else if (views > 10000) score += 5

        // Description length (more detailed = better)
        if (video.description && video.description.length > 200) {
          score += 5
        }

        return { ...video, relevanceScore: score }
      })

      // Return the highest scoring video
      scoredVideos.sort((a, b) => b.relevanceScore - a.relevanceScore)
      return scoredVideos[0] || null
    } catch (error) {
      console.error('Error finding best video for lesson:', error)
      return null
    }
  }

  /**
   * Extract video duration in seconds from YouTube duration format
   */
  static parseDuration(duration) {
    // YouTube duration format: PT4M13S (4 minutes 13 seconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return 0

    const hours = parseInt(match[1] || 0)
    const minutes = parseInt(match[2] || 0)
    const seconds = parseInt(match[3] || 0)

    return hours * 3600 + minutes * 60 + seconds
  }

  /**
   * Suggest time frames for a video based on lesson content
   */
  static async suggestTimeFrames(videoId, lessonContent, lessonDurationMinutes = 10) {
    try {
      // Get video details
      const videoResponse = await youtube.videos.list({
        part: 'contentDetails',
        id: videoId
      })

      const video = videoResponse.data.items[0]
      if (!video) return null

      const totalDuration = this.parseDuration(video.contentDetails.duration)
      const lessonDurationSeconds = lessonDurationMinutes * 60

      // If video is shorter than lesson duration, use whole video
      if (totalDuration <= lessonDurationSeconds) {
        return {
          startTime: 0,
          endTime: totalDuration,
          segments: [{
            title: 'Complete Video',
            startTime: 0,
            endTime: totalDuration
          }]
        }
      }

      // For longer videos, suggest segments
      const segmentDuration = Math.min(300, totalDuration / 3) // 5 minutes or divide into 3 parts
      const segments = []

      for (let i = 0; i < Math.min(3, Math.floor(totalDuration / segmentDuration)); i++) {
        const startTime = i * segmentDuration
        const endTime = Math.min((i + 1) * segmentDuration, totalDuration)

        segments.push({
          title: `Part ${i + 1}`,
          startTime,
          endTime
        })
      }

      return {
        startTime: 0,
        endTime: lessonDurationSeconds,
        segments
      }
    } catch (error) {
      console.error('Error suggesting time frames:', error)
      return {
        startTime: 0,
        endTime: lessonDurationMinutes * 60,
        segments: [{
          title: 'Full Lesson',
          startTime: 0,
          endTime: lessonDurationMinutes * 60
        }]
      }
    }
  }

  /**
   * Get channel information for credibility assessment
   */
  static async getChannelInfo(channelId) {
    try {
      const response = await youtube.channels.list({
        part: 'snippet,statistics',
        id: channelId
      })

      const channel = response.data.items[0]
      if (!channel) return null

      return {
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        viewCount: channel.statistics.viewCount,
        publishedAt: channel.snippet.publishedAt
      }
    } catch (error) {
      console.error('Error getting channel info:', error)
      return null
    }
  }
}