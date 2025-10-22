import { Box, Container, Typography, Button, Grid } from '@mui/material'

function Home() {
  return (
    <Box>
      <Box
        sx={{
          height: '70vh',
          backgroundImage: 'url(/homepage.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                color="white"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Transform Your Future with Cway Academy
              </Typography>
              <Typography
                variant="h5"
                color="white"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Discover world-class courses taught by expert instructors. Start your learning journey today.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ mr: 2 }}
              >
                Explore Courses
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Featured Courses Section will be added here */}
    </Box>
  )
}

export default Home