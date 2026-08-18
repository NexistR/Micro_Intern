import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import PageHeader from '@/components/workspace/PageHeader';

export default function OrderPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <PageHeader
          eyebrow="Commerce operations"
          title="Order"
          description="跟踪订单状态、金额和关联公司，保持日常流程清晰可见。"
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
                bgcolor: 'rgba(178, 106, 0, 0.1)',
                color: 'secondary.main',
              }}
            >
              <ShoppingCartRoundedIcon />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              订单工作区已准备就绪
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
              完成订单 API 后，这里将展示筛选、状态流转和订单明细。
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
