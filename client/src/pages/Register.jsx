import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../../api";
import { useAuthStore } from "../../store";

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Name too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  role: Yup.string().oneOf(['student', 'tutor'], 'Invalid role').required('Role is required'),
})

function Register() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const registerMutation = useMutation({
    mutationFn: (userData) => api.post('/api/auth/register', userData),
    onSuccess: (data) => {
      login(data.data)
      navigate('/')
    },
  })

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>

        {registerMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {registerMutation.error.response?.data?.error || 'Registration failed'}
          </Alert>
        )}

        <Formik
          initialValues={{ name: '', email: '', password: '', role: 'student' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            registerMutation.mutate(values)
          }}
        >
          {({ errors, touched, values, handleChange }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Full Name"
                name="name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />

              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={values.role}
                  label="Role"
                  name="role"
                  onChange={handleChange}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="tutor">Tutor</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={registerMutation.isLoading}
              >
                {registerMutation.isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Already have an account? Sign In
                </MuiLink>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  )
}

export default Register