import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <LockOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800}>
                Workspace
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Operations console
              </Typography>
            </Box>
          </Stack>

          <Paper
            component="section"
            variant="outlined"
            sx={{ p: { xs: 3, sm: 4 }, borderRadius: 1.5 }}
          >
            {children}
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
