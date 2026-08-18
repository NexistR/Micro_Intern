'use client';


import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { ApiError, login, signUp, type AuthCredentials } from '@/lib/api';
import {
  validateCredentials,
  type AuthField,
  type AuthFieldErrors,
} from '@/features/auth/validation';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

const EMPTY_CREDENTIALS: AuthCredentials = {
  email: '',
  password: '',
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === 'signup';
  const [credentials, setCredentials] =
    useState<AuthCredentials>(EMPTY_CREDENTIALS);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<AuthField, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const updateField =
    (field: AuthField) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextCredentials = {
        ...credentials,
        [field]: event.target.value,
      };
      setCredentials(nextCredentials);
      setAlertMessage(undefined);

      if (touched[field] || submitAttempted) {
        setFieldErrors(validateCredentials(nextCredentials));
      }
    };

  const blurField = (field: AuthField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setFieldErrors((current) => ({
      ...current,
      [field]: validateCredentials(credentials)[field],
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setTouched({ email: true, password: true });

    const errors = validateCredentials(credentials);
    setFieldErrors(errors);
    setAlertMessage(undefined);
    setSuccessMessage(undefined);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setBusy(true);

    try {
      const result = isSignup
        ? await signUp(credentials)
        : await login(credentials);

      if (isSignup) {
        setCredentials({ email: credentials.email.trim(), password: '' });
        setFieldErrors({});
        setTouched({});
        setSubmitAttempted(false);
        setSuccessMessage(result.message);
      } else {
        router.replace('/dashboard');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'AUTH_USER_NOT_FOUND') {
          setTouched((current) => ({ ...current, email: true }));
          setFieldErrors((current) => ({ ...current, email: error.message }));
        } else if (error.code === 'AUTH_INVALID_PASSWORD') {
          setTouched((current) => ({ ...current, password: true }));
          setFieldErrors((current) => ({
            ...current,
            password: error.message,
          }));
        } else if (error.code === 'AUTH_EMAIL_EXISTS') {
          setTouched((current) => ({ ...current, email: true }));
          setFieldErrors((current) => ({ ...current, email: error.message }));
        } else {
          setAlertMessage(error.message);
        }
      } else {
        setAlertMessage('请求失败，请稍后重试');
      }
    } finally {
      setBusy(false);
    }
  };

  const emailError = Boolean(fieldErrors.email && (touched.email || submitAttempted));
  const passwordError = Boolean(
    fieldErrors.password && (touched.password || submitAttempted),
  );

  return (
    <Stack component="form" onSubmit={submit} spacing={2.5} noValidate>
      <Stack spacing={0.75}>
        <Typography variant="h5" fontWeight={700}>
          {isSignup ? '创建账户' : '欢迎回来'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isSignup ? '使用电子邮箱创建工作区账户' : '登录以继续访问工作区'}
        </Typography>
      </Stack>

      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      {successMessage && (
        <Alert severity="success">
          <Stack spacing={1}>
            <span>{successMessage}</span>
            <MuiLink component={NextLink} href="/login" underline="hover">
              前往登录
            </MuiLink>
          </Stack>
        </Alert>
      )}

      <TextField
        fullWidth
        required
        autoFocus
        id="email"
        name="email"
        label="电子邮箱"
        type="email"
        value={credentials.email}
        onChange={updateField('email')}
        onBlur={() => blurField('email')}
        error={emailError}
        helperText={emailError ? fieldErrors.email : '请输入可接收邮件的地址'}
        autoComplete={isSignup ? 'email' : 'username'}
        disabled={busy}
      />

      <TextField
        fullWidth
        required
        id="password"
        name="password"
        label="密码"
        type={showPassword ? 'text' : 'password'}
        value={credentials.password}
        onChange={updateField('password')}
        onBlur={() => blurField('password')}
        error={passwordError}
        helperText={
          passwordError
            ? fieldErrors.password
            : '至少 8 位，包含字母、数字和特殊字符'
        }
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        disabled={busy}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={showPassword ? '隐藏密码' : '显示密码'}>
                  <IconButton
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <VisibilityRoundedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={busy}
        sx={{ mt: 0.5, py: 1.35 }}
      >
        {busy ? (
          <CircularProgress color="inherit" size={22} />
        ) : isSignup ? (
          '注册'
        ) : (
          '登录'
        )}
      </Button>

      <Typography variant="body2" color="text.secondary" textAlign="center">
        {isSignup ? '已有账户？' : '还没有账户？'}{' '}
        <MuiLink
          component={NextLink}
          href={isSignup ? '/login' : '/signup'}
          underline="hover"
          fontWeight={600}
        >
          {isSignup ? '前往登录' : '创建账户'}
        </MuiLink>
      </Typography>
    </Stack>
  );
}
