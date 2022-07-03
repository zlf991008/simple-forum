import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import axios from 'axios';

// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Nickname required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().min(5, 'Too Short!').max(20, 'Too Long!').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {
      const fetchData = async () => {
        await axios
          .post('/user/register', {
            name: values.name,
            email: values.email,
            password: values.password,
          })
          .then((res) => {
            if (res.data.statusCode === 409) errors.email = res.data.message;
            else if (res.data.statusCode === 999) errors.email = res.data.message;
            else if (res.data.statusCode === 200)
              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 2000);
            else console.log('Unknown Error');
          });
      };

      fetchData();
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Nickname"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            fullWidth
            autoComplete="username"
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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm password"
            {...getFieldProps('confirmPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            {/* @Register */}
            注册
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
