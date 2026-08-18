'use client';

import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';
import type { AuthUser } from '@/lib/api';

type NavigationBarProps = {
  user: AuthUser;
  onLogout: () => void;
};

const navigationItems: Array<{
  href: string;
  label: string;
  icon: ReactElement;
}> = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <DashboardRoundedIcon fontSize="small" />,
  },
  {
    href: '/company',
    label: 'Company',
    icon: <BusinessRoundedIcon fontSize="small" />,
  },
  {
    href: '/order',
    label: 'Order',
    icon: <ShoppingCartRoundedIcon fontSize="small" />,
  },
  {
    href: '/user',
    label: 'User',
    icon: <PeopleAltRoundedIcon fontSize="small" />,
  },
];

export default function NavigationBar({ user, onLogout }: NavigationBarProps) {
  const pathname = usePathname();
  const activeTab =
    navigationItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.href ?? false;

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ minHeight: 68, gap: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 800,
            }}
          >
            W
          </Box>
          <Typography variant="subtitle1" fontWeight={800}>
            Workspace
          </Typography>
        </Stack>

        <Box component="nav" sx={{ flex: 1, minWidth: 0 }}>
          <Tabs
            value={activeTab}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="主导航"
            sx={{ minHeight: 68 }}
          >
            {navigationItems.map((item) => (
              <Tab
                key={item.href}
                component={NextLink}
                href={item.href}
                value={item.href}
                label={item.label}
                icon={item.icon}
                iconPosition="start"
                sx={{ minHeight: 68, minWidth: 'auto', px: { xs: 1.25, sm: 2 } }}
              />
            ))}
          </Tabs>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 220 }}
            noWrap
          >
            {user.email}
          </Typography>
          <Tooltip title="退出登录">
            <IconButton onClick={onLogout} aria-label="退出登录" color="inherit">
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
