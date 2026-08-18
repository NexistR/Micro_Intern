'use client';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout, type AuthUser } from '@/lib/api';
import NavigationBar from './NavigationBar';

export default function WorkspaceShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((response) => {
        if (active) {
          setUser(response.user);
        }
      })
      .catch(() => {
        if (active) {
          router.replace('/login');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    router.replace('/login');
  };

  if (loading || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Stack alignItems="center" spacing={1.5}>
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">
            正在验证登录状态
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7f8' }}>
      <NavigationBar user={user} onLogout={handleLogout} />
      <Box component="main">{children}</Box>
    </Box>
  );
}
