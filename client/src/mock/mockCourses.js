
const mockCourses = [
  {
    id: 'course1',
    title: 'JavaScript Essentials',
    category: 'Programming',
    tutor: { name: 'Alice' },
    level: 'Beginner',
    duration: '6 weeks',
    enrolledCount: 42,
    description: 'Learn the basics of JavaScript, including variables, functions, and DOM manipulation.',
    sections: [
      {
        title: 'JavaScript Essentials',
        lessons: [
          {
            id: 'lesson1',
            title: 'Variables & Data Types',
            duration: '30 min',
            videoUrl: 'https://youtu.be/hdI2bqOjy3c',
            textNotes: 'Variables store data. Data types include string, number, boolean, etc.',
            quiz: {
              timeLimitSec: 300,
              passingScore: 80,
              description: 'Test your knowledge of variables and data types.',
              questions: [
                {
                  id: 'q1',
                  type: 'MCQ',
                  prompt: 'Which keyword is used to declare a variable in JavaScript?',
                  options: [
                    { key: 'var', text: 'var' },
                    { key: 'let', text: 'let' },
                    { key: 'const', text: 'const' },
                    { key: 'all', text: 'all of the above' }
                  ],
                  answer: ['all']
                },
                {
                  id: 'q2',
                  type: 'MCQ',
                  prompt: 'What does DOM stand for?',
                  options: [
                    { key: 'doc', text: 'Document Object Model' },
                    { key: 'data', text: 'Data Object Model' },
                    { key: 'desk', text: 'Desktop Object Model' },
                    { key: 'none', text: 'None' }
                  ],
                  answer: ['doc']
                }
              ]
            }
          },
          {
            id: 'lesson2',
            title: 'Functions',
            duration: '40 min',
            videoUrl: 'https://youtu.be/8zKuNo4ay8E',
            textNotes: 'Functions are reusable blocks of code.',
            quiz: null
          },
          {
            id: 'lesson3',
            title: 'DOM Manipulation',
            duration: '35 min',
            videoUrl: 'https://youtu.be/0ik6X4Drr_4',
            textNotes: 'Interact with web pages using the DOM.',
            quiz: null
          }
        ]
      }
    ]
  },
  {
    id: 'course2',
    title: 'Python for Beginners',
    category: 'Programming',
    tutor: { name: 'Bob' },
    level: 'Beginner',
    duration: '8 weeks',
    enrolledCount: 35,
    description: 'Start your Python journey with syntax, loops, and functions.',
    sections: [
      {
        title: 'Python for Beginners',
        lessons: [
          {
            id: 'lesson1',
            title: 'Syntax & Variables',
            duration: '30 min',
            videoUrl: 'https://youtu.be/rfscVS0vtbw',
            textNotes: 'Python syntax is simple. Variables store data.',
            quiz: {
              timeLimitSec: 300,
              passingScore: 80,
              description: 'Test your Python basics.',
              questions: [
                {
                  id: 'q1',
                  type: 'MCQ',
                  prompt: 'Which symbol is used for comments in Python?',
                  options: [
                    { key: '#', text: '#' },
                    { key: '//', text: '//' },
                    { key: '--', text: '--' },
                    { key: '/*', text: '/*' }
                  ],
                  answer: ['#']
                },
                {
                  id: 'q2',
                  type: 'MCQ',
                  prompt: 'Which loop is used to iterate over a sequence?',
                  options: [
                    { key: 'for', text: 'for' },
                    { key: 'while', text: 'while' },
                    { key: 'do', text: 'do-while' },
                    { key: 'none', text: 'None' }
                  ],
                  answer: ['for']
                }
              ]
            }
          },
          {
            id: 'lesson2',
            title: 'Loops',
            duration: '40 min',
            videoUrl: 'https://youtu.be/6iF8Xb7Z3wQ',
            textNotes: 'Loops repeat actions. For and while loops are common.',
            quiz: null
          },
          {
            id: 'lesson3',
            title: 'Functions',
            duration: '35 min',
            videoUrl: 'https://youtu.be/NSbOtFM1u6Y',
            textNotes: 'Functions organize code into reusable blocks.',
            quiz: null
          }
        ]
      }
    ]
  },
  {
    id: 'course3',
    title: 'React Intermediate',
    category: 'Programming',
    tutor: { name: 'Charlie' },
    duration: '5 weeks',
    enrolledCount: 28,
    description: 'Take your React skills to the next level with hooks, context, and advanced patterns.',
    level: 'Intermediate',
    sections: [
      {
        title: 'React Intermediate',
        lessons: [
          {
            id: 'lesson1',
            title: 'Hooks',
            duration: '30 min',
            videoUrl: 'https://youtu.be/f687hBjwFcM',
            textNotes: 'Learn useState, useEffect, and custom hooks.',
            quiz: {
              timeLimitSec: 300,
              passingScore: 80,
              description: 'Test your React hooks knowledge.',
              questions: [
                {
                  id: 'q1',
                  type: 'MCQ',
                  prompt: 'Which hook is used for side effects?',
                  options: [
                    { key: 'useState', text: 'useState' },
                    { key: 'useEffect', text: 'useEffect' },
                    { key: 'useContext', text: 'useContext' },
                    { key: 'useReducer', text: 'useReducer' }
                  ],
                  answer: ['useEffect']
                },
                {
                  id: 'q2',
                  type: 'MCQ',
                  prompt: 'What is Context API used for?',
                  options: [
                    { key: 'styling', text: 'Styling' },
                    { key: 'global', text: 'Global State' },
                    { key: 'routing', text: 'Routing' },
                    { key: 'testing', text: 'Testing' }
                  ],
                  answer: ['global']
                }
              ]
            }
          },
          {
            id: 'lesson2',
            title: 'Context API',
            duration: '40 min',
            videoUrl: 'https://youtu.be/35lXWvCuM8o',
            textNotes: 'Manage global state with context.',
            quiz: null
          },
          {
            id: 'lesson3',
            title: 'Advanced Patterns',
            duration: '35 min',
            videoUrl: 'https://youtu.be/0vVofAhAYjc',
            textNotes: 'Explore render props and HOCs.',
            quiz: null
          }
        ]
      }
    ]
  },
  {
    id: 'course4',
    title: 'Data Science Advanced',
    category: 'Data Science',
    tutor: { name: 'Dana' },
    duration: '10 weeks',
    enrolledCount: 15,
    description: 'Master machine learning, deep learning, and big data tools.',
    level: 'Advanced',
    sections: [
      {
        title: 'Data Science Advanced',
        lessons: [
          {
            id: 'lesson1',
            title: 'Machine Learning',
            duration: '45 min',
            videoUrl: 'https://youtu.be/GwIo3gDZCVQ',
            textNotes: 'Supervised and unsupervised learning.',
            quiz: {
              timeLimitSec: 300,
              passingScore: 80,
              description: 'Test your machine learning knowledge.',
              questions: [
                {
                  id: 'q1',
                  type: 'MCQ',
                  prompt: 'Which is a deep learning framework?',
                  options: [
                    { key: 'tf', text: 'TensorFlow' },
                    { key: 'np', text: 'NumPy' },
                    { key: 'pd', text: 'Pandas' },
                    { key: 'mpl', text: 'Matplotlib' }
                  ],
                  answer: ['tf']
                },
                {
                  id: 'q2',
                  type: 'MCQ',
                  prompt: 'What is supervised learning?',
                  options: [
                    { key: 'nolabel', text: 'Learning without labels' },
                    { key: 'label', text: 'Learning with labeled data' },
                    { key: 'images', text: 'Learning with images' },
                    { key: 'none', text: 'None' }
                  ],
                  answer: ['label']
                }
              ]
            }
          },
          {
            id: 'lesson2',
            title: 'Deep Learning',
            duration: '50 min',
            videoUrl: 'https://youtu.be/aircAruvnKk',
            textNotes: 'Neural networks and frameworks.',
            quiz: null
          },
          {
            id: 'lesson3',
            title: 'Big Data',
            duration: '40 min',
            videoUrl: 'https://youtu.be/2w5p5Qp5nTg',
            textNotes: 'Tools for handling large datasets.',
            quiz: null
          }
        ]
      }
    ]
  }
]

export default mockCourses
