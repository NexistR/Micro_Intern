import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import PageHeader from '@/components/workspace/PageHeader';

export default function UserPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <PageHeader
          eyebrow="Access management"
          title="User"
          description="管理工作区账户、访问权限和团队成员。"
        />
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 1.5 }}>
          <Stack spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 44,
                height: 44,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 1,
                bgcolor: 'rgba(0, 105, 92, 0.08)',
                color: 'primary.main',
              }}
            >
              <PeopleAltRoundedIcon />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              用户目录已准备就绪
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
              当前账户已通过后端会话验证；接入团队接口后可在这里维护成员。
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
