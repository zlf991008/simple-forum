import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import axios from 'axios';

// hooks
import useCurrentUser from '../../../hooks/useCurrentUser';

// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // useCurrentUser
  const { setCurrentUser } = useCurrentUser();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      const fetchData = async () => {
        const loginData = new FormData();
        loginData.append('email', values.email);
        loginData.append('password', values.password);

        await axios.post('/user/login', loginData).then((res) => {
          console.log(res.data.data);
          if (res.data.statusCode === 404) errors.email = res.data.message;
          else if (res.data.statusCode === 401) errors.password = res.data.message;
          else if (res.data.statusCode === 200) {
            setCurrentUser(res.data.data);
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 2000);
          } else console.log('Unknown Error');
        });
      };

      fetchData();
      setTimeout(() => {
        setSubmitting(false);
      }, 2000);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            // label="@Remember me"
            label="记住我"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            {/* @Forgot password? */}
            忘记密码？
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {/* @Login */}登 录
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
