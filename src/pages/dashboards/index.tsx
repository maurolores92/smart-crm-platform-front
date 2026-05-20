import { Box, Container } from '@mui/material'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const AnalyticsDashboard = () => {
  return (
    <ApexChartWrapper>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 6, md: 10 }
        }}
      >
        <Container maxWidth='lg'>
        </Container>
      </Box>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
