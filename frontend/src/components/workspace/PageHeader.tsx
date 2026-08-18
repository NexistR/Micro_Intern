import { Stack, Typography } from '@mui/material';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <Stack spacing={0.75}>
      <Typography
        variant="overline"
        color="primary.main"
        fontWeight={700}
        letterSpacing={1.2}
      >
        {eyebrow}
      </Typography>
      <Typography variant="h4" component="h1" fontWeight={750}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
        {description}
      </Typography>
    </Stack>
  );
}
