import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PageHeader from '@/components/workspace/PageHeader';

const metrics = [
  { label: 'Companies', value: '—', note: '等待业务数据接入' },
  { label: 'Open orders', value: '—', note: '等待业务数据接入' },
  { label: 'Team members', value: '1', note: '当前登录账户' },
];

export default function DashboardPage() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <PageHeader
          eyebrow="Workspace overview"
          title="Dashboard"
          description="从这里查看工作区概览，并进入公司、订单和用户管理。"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {metrics.map((metric) => (
            <Paper
              key={metric.label}
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 1.5 }}
            >
              <Typography variant="body2" color="text.secondary">
                {metric.label}
              </Typography>
              <Typography variant="h4" fontWeight={750} sx={{ mt: 1 }}>
                {metric.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {metric.note}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={1}
            sx={{ p: 2.5 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Recent orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                订单数据接入后会显示在这里。
              </Typography>
            </Box>
            <Button
              href="/order"
              variant="text"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              查看订单
            </Button>
          </Stack>
          <Table size="small" aria-label="订单概览">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">暂无订单</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </Container>
  );
}
