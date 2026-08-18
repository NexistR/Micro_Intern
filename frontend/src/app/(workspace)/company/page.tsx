import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import PageHeader from '@/components/workspace/PageHeader';

export default function CompanyPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <PageHeader
          eyebrow="Workspace data"
          title="Company"
          description="集中管理工作区中的企业资料和合作关系。"
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
              <BusinessRoundedIcon />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              公司目录已准备就绪
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
              连接公司数据源后，这里将提供搜索、详情和关系管理能力。
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
