import * as Yup from 'yup';
import * as React from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { Box, Card, CardContent, CardHeader, Divider, TextField, Stack, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import axios from 'axios';
import useCurrentUser from '../hooks/useCurrentUser';

// components
import Page from '../components/Page';

export default function AccountProfileDetail() {
  const { currentUser } = useCurrentUser();
  const [profile, setProfile] = React.useState({});

  React.useEffect(() => {
    const fetchProfile = async () => {
      await axios
        .get('/profile/get', {
          params: {
            userId: currentUser.userId,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.statusCode === 200) setProfile(res.data.data);
        });
    };

    fetchProfile();
  }, [currentUser]);

  React.useEffect(() => {
    if (profile) {
      setFieldValue('university', profile.university || '');
      setFieldValue('college', profile.college || '');
      setFieldValue('major', profile.major || '');
      setFieldValue('goodAt', profile.goodAt || '');
    }
  }, [profile]);

  const LoginSchema = Yup.object().shape({
    university: Yup.string().min(0, 'Too Short!').max(50, 'Too Long!').nullable(),
    college: Yup.string().min(0, 'Too Short!').max(50, 'Too Long!').nullable(),
    major: Yup.string().min(0, 'Too Short!').max(50, 'Too Long!').nullable(),
    goodAt: Yup.string().min(0, 'Too Short!').max(200, 'Too Long!').nullable(),
  });

  const formik = useFormik({
    initialValues: {
      university: profile.university || '',
      college: profile.college || '',
      major: profile.major || '',
      goodAt: profile.goodAt || '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      const updateProfile = async () => {
        await axios
          .post('/profile/update', {
            userId: currentUser.userId,
            university: values.university,
            college: values.college,
            major: values.major,
            goodAt: values.goodAt,
          })
          .then((res) => {
            console.log(res);
            if (res.data.statusCode === 200) setProfile(res.data.data);
            else {
              errors.university = res.data.message;
            }
          });
      };

      updateProfile();
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    },
  });
  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleChangeUniversity = (e) => {
    setFieldValue('university', e.target.value);
  };
  const handleChangeCollege = (e) => {
    setFieldValue('college', e.target.value);
  };
  const handleChangeMajor = (e) => {
    setFieldValue('major', e.target.value);
  };
  const handleChangeGoodAt = (e) => {
    setFieldValue('goodAt', e.target.value);
  };

  return (
    <Page title="Profile">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {/* @Profile */}
            简介
          </Typography>
        </Stack>
        <Card>
          {/* <CardHeader subheader="The information can be edited" title="Your Profile" /> */}
          <CardHeader subheader="以下内容可编辑" title="我的简介" />
          <Box mt={2}>
            <Divider />
          </Box>
          <CardContent>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    autoComplete="university"
                    type="text"
                    label="University"
                    {...getFieldProps('university')}
                    error={Boolean(touched.university && errors.university)}
                    helperText={touched.university && errors.university}
                    onChange={handleChangeUniversity}
                    value={formik.values.university}
                  />
                  <TextField
                    fullWidth
                    autoComplete="college"
                    type="text"
                    label="College"
                    {...getFieldProps('college')}
                    error={Boolean(touched.college && errors.college)}
                    helperText={touched.college && errors.college}
                    onChange={handleChangeCollege}
                    value={formik.values.college}
                  />
                  <TextField
                    fullWidth
                    autoComplete="major"
                    type="text"
                    label="Major"
                    {...getFieldProps('major')}
                    error={Boolean(touched.major && errors.major)}
                    helperText={touched.major && errors.major}
                    onChange={handleChangeMajor}
                    value={formik.values.major}
                  />
                  <TextField
                    fullWidth
                    autoComplete="goodAt"
                    type="text"
                    label="Good At"
                    {...getFieldProps('goodAt')}
                    error={Boolean(touched.goodAt && errors.goodAt)}
                    helperText={touched.goodAt && errors.goodAt}
                    onChange={handleChangeGoodAt}
                    value={formik.values.goodAt}
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
                    {/* @Save profile */}
                    保存
                  </LoadingButton>
                </Box>
              </Form>
            </FormikProvider>
          </CardContent>
          <Divider />
        </Card>
      </Container>
    </Page>
  );
}
