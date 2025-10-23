import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material'
import {
  Download,
  Visibility,
  Share,
  Verified,
  School,
  CalendarToday,
  Person,
} from '@mui/icons-material'
import { useAuthStore } from '../store'
import api from '../api/index.js'

function Certificates() {
  const { user } = useAuthStore()
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [verifyDialog, setVerifyDialog] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)

  // Fetch user's certificates
  const { data: certificates, refetch } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => api.get('/api/certificates/my-certificates'),
  })

  // Fetch all certificates (admin)
  const { data: allCertificates } = useQuery({
    queryKey: ['all-certificates'],
    queryFn: () => api.get('/api/certificates/all'),
    enabled: user?.role === 'admin',
  })

  const handleDownload = async (certificateId) => {
    try {
      const response = await api.get(`/api/certificates/${certificateId}/download`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `certificate-${certificateId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleVerify = async () => {
    try {
      const response = await api.post('/api/certificates/verify', {
        verificationCode,
      })
      setVerificationResult(response.data)
    } catch (error) {
      setVerificationResult({ valid: false, message: 'Invalid verification code' })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const CertificateCard = ({ certificate, showStudent = false }) => (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Verified sx={{ color: 'success.main', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Certificate of Completion
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
          {certificate.course.title}
        </Typography>

        {showStudent && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Awarded to: {certificate.student.name}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <School sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Issued by: {certificate.issuedBy.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Issued on: {formatDate(certificate.issuedAt)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={`Score: ${certificate.score}%`}
            color={certificate.score >= 80 ? 'success' : certificate.score >= 60 ? 'warning' : 'error'}
            size="small"
          />
          <Chip
            label="Verified"
            color="primary"
            size="small"
            icon={<Verified />}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Verification Code: {certificate.verificationCode}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title="View Certificate">
            <IconButton
              size="small"
              onClick={() => setSelectedCertificate(certificate)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download PDF">
            <IconButton
              size="small"
              onClick={() => handleDownload(certificate._id)}
            >
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton size="small">
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Certificates
        </Typography>

        <Button
          variant="outlined"
          onClick={() => setVerifyDialog(true)}
          sx={{ textTransform: 'none' }}
        >
          Verify Certificate
        </Button>
      </Box>

      {/* Admin View */}
      {user?.role === 'admin' && (
        <>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            All Certificates
          </Typography>

          <Grid container spacing={3}>
            {allCertificates?.certificates?.map((certificate) => (
              <Grid item xs={12} md={6} lg={4} key={certificate._id}>
                <CertificateCard certificate={certificate} showStudent={true} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Student/Tutor View */}
      {(user?.role === 'student' || user?.role === 'tutor') && (
        <>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Your Certificates
          </Typography>

          {certificates?.certificates?.length > 0 ? (
            <Grid container spacing={3}>
              {certificates.certificates.map((certificate) => (
                <Grid item xs={12} md={6} lg={4} key={certificate._id}>
                  <CertificateCard certificate={certificate} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                No Certificates Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Complete courses to earn certificates of completion
              </Typography>
              <Button
                variant="contained"
                component="a"
                href="/courses"
                sx={{ textTransform: 'none' }}
              >
                Browse Courses
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Certificate Preview Dialog */}
      <Dialog
        open={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Certificate Preview
        </DialogTitle>
        <DialogContent>
          {selectedCertificate && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 4,
                  bgcolor: 'background.paper',
                  mx: 'auto',
                  maxWidth: 600,
                }}
              >
                <Verified sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                  Certificate of Completion
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {selectedCertificate.course.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  This is to certify that
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {selectedCertificate.student.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  has successfully completed the course with a score of {selectedCertificate.score}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Issued on {formatDate(selectedCertificate.issuedAt)}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  Verification Code: {selectedCertificate.verificationCode}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
                  This certificate is awarded in recognition of the successful completion of the course requirements.<br />
                  Cway Academy - Empowering Learning Through Innovation
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Certificate ID: {selectedCertificate.verificationCode}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCertificate(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => handleDownload(selectedCertificate._id)}
            startIcon={<Download />}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verifyDialog}
        onClose={() => setVerifyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Verify Certificate
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Enter the verification code from the certificate"
          />

          {verificationResult && (
            <Alert
              severity={verificationResult.valid ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {verificationResult.message}
              {verificationResult.valid && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Course: {verificationResult.certificate?.course?.title}
                  </Typography>
                  <Typography variant="body2">
                    Student: {verificationResult.certificate?.student?.name}
                  </Typography>
                  <Typography variant="body2">
                    Issued: {formatDate(verificationResult.certificate?.issuedAt)}
                  </Typography>
                </Box>
              )}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={!verificationCode.trim()}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Certificates