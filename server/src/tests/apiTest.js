const axios = require('axios');

const API_URL = 'http://localhost:4001/api';
let token = '';

const testAPI = async () => {
  try {
    // 1. Test user registration
    console.log('\nTesting user registration...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123456'
    });
    console.log('Registration successful:', registerRes.data);

    // 2. Test login
    console.log('\nTesting login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test123456'
    });
    token = loginRes.data.token;
    console.log('Login successful, token received');

    // 3. Test course creation with AI
    console.log('\nTesting AI course creation...');
    const courseRes = await axios.post(
      `${API_URL}/courses`,
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming',
        category: 'Programming',
        price: 0,
        isAIGenerated: true
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const courseId = courseRes.data.course._id;
    console.log('Course created:', courseId);

    // 4. Test course enrollment
    console.log('\nTesting course enrollment...');
    await axios.post(
      `${API_URL}/courses/${courseId}/enroll`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Enrollment successful');

    // 5. Test progress update
    console.log('\nTesting progress update...');
    await axios.post(
      `${API_URL}/courses/${courseId}/progress`,
      {
        sectionComplete: '1',
        quizScore: 85
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Progress updated');

    // 6. Test getting enrolled courses
    console.log('\nTesting enrolled courses fetch...');
    const enrolledRes = await axios.get(
      `${API_URL}/courses/enrolled`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Enrolled courses:', enrolledRes.data.courses.length);

    console.log('\nAll tests passed successfully! ✅');
  } catch (error) {
    console.error('\nTest failed ❌');
    console.error('Error:', error.response?.data || error.message);
  }
};

testAPI();