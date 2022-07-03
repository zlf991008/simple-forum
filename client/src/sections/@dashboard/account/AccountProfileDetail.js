import * as Yup from 'yup';
import * as React from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import axios from 'axios';
import useCurrentUser from '../../../hooks/useCurrentUser';
import Iconify from '../../../components/Iconify';

export default function AccountProfileDetail() {
  const { currentUser, setCurrentUser } = useCurrentUser();

  const LoginSchema = Yup.object().shape({
    name: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Nickname required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: currentUser.name,
      email: currentUser.email,
      password: currentUser.password,
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      const updateUser = async () => {
        await axios
          .post('/user/updateDetail', {
            userId: currentUser.userId,
            name: values.name,
            email: values.email,
            password: values.password,
          })
          .then((res) => {
            if (res.data.statusCode === 200) setCurrentUser(res.data.data);
            if (res.data.statusCode === 409) errors.email = res.data.message;
            else errors.name = 'Update failed';
          });
      };

      updateUser();
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    },
  });
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleChangeName = (e) => {
    setFieldValue('name', e.target.value);
  };
  const handleChangeEmail = (e) => {
    setFieldValue('email', e.target.value);
  };
  const handleChangePassword = (e) => {
    setFieldValue('password', e.target.value);
  };

  return (
    <Card>
      {/* <CardHeader subheader="The information can be edited" title="Account setting" /> */}
      <CardHeader subheader="以下内容可编辑" title="账户设置" />
      <Box mt={2}>
        <Divider />
      </Box>
      <CardContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoComplete="name"
                type="name"
                label="Nick name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
                onChange={handleChangeName}
                value={formik.values.name}
              />
              <TextField
                fullWidth
                autoComplete="email"
                type="email"
                label="Email address"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                onChange={handleChangeEmail}
                value={formik.values.email}
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
                onChange={handleChangePassword}
                value={formik.values.password}
              />
            </Stack>
            <Box mt={3}>
              <Divider />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2,
              }}
              mt={1}
            >
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                {/* @Save details */}
                保存
              </LoadingButton>
            </Box>
          </Form>
        </FormikProvider>
      </CardContent>
      <Divider />
    </Card>
  );
}
