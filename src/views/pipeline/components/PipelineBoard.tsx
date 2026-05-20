import React, { ReactNode } from 'react'
import { Box } from '@mui/material'

interface PipelineBoardProps {
  children: ReactNode
}

const PipelineBoard = ({ children }: PipelineBoardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        overflowX: 'auto',
        pb: 2, // Space for scrollbar
        height: 'calc(100vh - 250px)', // Adjust based on your header/layout
        minHeight: 500,
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.05)',
          borderRadius: 8
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.15)',
          borderRadius: 8,
          '&:hover': {
            background: 'rgba(0,0,0,0.25)'
          }
        }
      }}
    >
      {children}
    </Box>
  )
}

export default PipelineBoard
