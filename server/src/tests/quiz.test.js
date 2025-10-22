import { jest } from '@jest/globals'

describe('Quiz Grading Logic', () => {
  const mockQuestions = [
    {
      _id: 'q1',
      type: 'MCQ',
      answerKeys: ['A'],
      points: 2,
    },
    {
      _id: 'q2',
      type: 'MAQ',
      answerKeys: ['B', 'C'],
      points: 2,
    },
    {
      _id: 'q3',
      type: 'TF',
      answerKeys: ['A'],
      points: 1,
    },
  ]

  it('should correctly grade MCQ answers', () => {
    const userAnswers = [
      { qid: 'q1', selectedKeys: ['A'] },
      { qid: 'q2', selectedKeys: ['B', 'C'] },
      { qid: 'q3', selectedKeys: ['A'] },
    ]

    let totalScore = 0
    const details = []

    for (const question of mockQuestions) {
      const userAnswer = userAnswers.find(a => a.qid === question._id.toString())

      if (userAnswer) {
        const isCorrect = JSON.stringify(userAnswer.selectedKeys.sort()) ===
                         JSON.stringify(question.answerKeys.sort())
        if (isCorrect) {
          totalScore += question.points
        }
        details.push({
          qid: question._id.toString(),
          correct: isCorrect,
        })
      } else {
        details.push({
          qid: question._id.toString(),
          correct: false,
        })
      }
    }

    expect(totalScore).toBe(5) // 2 + 2 + 1
    expect(details).toHaveLength(3)
    expect(details.every(d => d.correct)).toBe(true)
  })

  it('should handle incorrect answers', () => {
    const userAnswers = [
      { qid: 'q1', selectedKeys: ['B'] }, // Wrong
      { qid: 'q2', selectedKeys: ['B'] }, // Partial wrong
      { qid: 'q3', selectedKeys: ['B'] }, // Wrong
    ]

    let totalScore = 0
    const details = []

    for (const question of mockQuestions) {
      const userAnswer = userAnswers.find(a => a.qid === question._id.toString())

      if (userAnswer) {
        const isCorrect = JSON.stringify(userAnswer.selectedKeys.sort()) ===
                         JSON.stringify(question.answerKeys.sort())
        if (isCorrect) {
          totalScore += question.points
        }
        details.push({
          qid: question._id.toString(),
          correct: isCorrect,
        })
      } else {
        details.push({
          qid: question._id.toString(),
          correct: false,
        })
      }
    }

    expect(totalScore).toBe(0)
    expect(details.filter(d => d.correct)).toHaveLength(0)
  })

  it('should calculate percentage correctly', () => {
    const totalScore = 4
    const maxScore = 5
    const percentage = Math.round((totalScore / maxScore) * 100)

    expect(percentage).toBe(80)
  })
})