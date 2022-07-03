import * as React from 'react';
import { faker } from '@faker-js/faker';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Link,
  Container,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

// utils
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'axios';

// hooks
import useResponsive from '../hooks/useResponsive';
import useCurrentUser from '../hooks/useCurrentUser';

// components
import Page from '../components/Page';
import Logo from '../components/Logo';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const Input = styled('input')({
  display: 'none',
});

export default function NewPost() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const NewPostSchema = Yup.object().shape({
    title: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Title required!'),
    content: Yup.string().min(10, 'Too Short! >=10').max(200, 'Too Long! <=200').required('Content required!'),
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      type: 'SHARE_MOOD',
      content: '',
    },
    validationSchema: NewPostSchema,
    onSubmit: (values, { setSubmitting }) => {
      const postData = new FormData();
      postData.append('userId', currentUser.userId);
      postData.append('title', values.title);
      postData.append('type', values.type);
      postData.append('content', values.content);
      postData.append('cover', cover);
      const fetchData = async () => {
        await axios.post(`/post/add${coverType}`, postData).then((res) => {
          if (res.data.statusCode === 200) navigate('/dashboard/post');
        });
      };
      setTimeout(() => {
        fetchData();
        setSubmitting(false);
      }, 3000);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  const handleChangeType = (e) => {
    setFieldValue('type', e.target.value);
  };

  const [isSubmittingCover, setIsSubmittingCover] = React.useState(false);
  const [cover, setCover] = React.useState(null);
  const [coverType, setCoverType] = React.useState('');
  const handleUploadCover = (e) => {
    setCover(e.target.files[0]);
    setCoverType('');
    setIsSubmittingCover(true);
    setTimeout(() => {
      setIsSubmittingCover(false);
      setDisabledPost(false);
    }, 1500);
  };

  const [disabledPost, setDisabledPost] = React.useState(true);
  const [isSubmittingDefaultCover, setIsSubmittingDefaultCover] = React.useState(false);
  const handleClickUseDefaultCover = () => {
    setIsSubmittingDefaultCover(true);
    setCoverType('WithDefaultCover');
    const num = Math.ceil(Math.random() * 23);
    setCover(`cover_${num + 1}.jpg`);
    console.log(cover);
    setTimeout(() => {
      setDisabledPost(false);
      setIsSubmittingDefaultCover(false);
    }, 1500);
  };

  return (
    <>
      <Page title="New Post">
        <RootStyle>
          {mdUp && (
            <SectionStyle>
              <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                {/* Manage the job more effectively with Minimal */}
                {/* @Let's do it! */}
              </Typography>
              <img alt="register" src="/static/illustrations/illustration_register.png" />
              <HeaderStyle>
                <Logo />
                {smUp && (
                  <Typography variant="body2" sx={{ mt: { md: -2 } }}>
                    {/* Already have an account? {''} */}
                    <Link variant="subtitle2" component={RouterLink} to="/login">
                      {/* Login */}
                    </Link>
                  </Typography>
                )}
              </HeaderStyle>
            </SectionStyle>
          )}

          <Container>
            <ContentStyle>
              <Typography variant="h4" gutterBottom>
                {/* Get started absolutely free. */}
                {/* @Post your new post. */}
                发布新的帖子
              </Typography>

              <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                {/* Free forever. No credit card needed. */}
                {/* @Automatic identification is under development. */}
                自动识别功能正在开发中...
              </Typography>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Title"
                      {...getFieldProps('title')}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Type</InputLabel>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formik.values.type}
                        label="Type"
                        onChange={handleChangeType}
                      >
                        {/* <MenuItem value="SHARE_MOOD" autoFocus>
                          Share Mood
                        </MenuItem>
                        <MenuItem value="SEEK_HELP">I Need Help</MenuItem>
                        <MenuItem value="SEEK_LOST_PROP">Seek Lost Property</MenuItem>
                        <MenuItem value="SEEK_OWNER">Seek Owner</MenuItem>
                        <MenuItem value="BUY_STH">Buy Something</MenuItem>
                        <MenuItem value="SELL_STH">Sell Something</MenuItem> */}

                        <MenuItem value="SHARE_MOOD" autoFocus>
                          分享心情
                        </MenuItem>
                        <MenuItem value="SEEK_HELP">求助</MenuItem>
                        <MenuItem value="SEEK_LOST_PROP">找失物</MenuItem>
                        <MenuItem value="SEEK_OWNER">找失主</MenuItem>
                        <MenuItem value="BUY_STH">买东西</MenuItem>
                        <MenuItem value="SELL_STH">卖东西</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Content"
                      {...getFieldProps('content')}
                      error={Boolean(touched.content && errors.content)}
                      helperText={touched.content && errors.content}
                      multiline
                      rows={5}
                    />
                    <Stack direction="row" spacing={5} pl={2} pr={2}>
                      <Box sx={{ width: 0.5 }}>
                        <label htmlFor="contained-button-file">
                          <Input
                            accept="image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={handleUploadCover}
                          />
                          <LoadingButton
                            fullWidth
                            variant="contained"
                            component="span"
                            size="large"
                            loading={isSubmittingCover}
                          >
                            {/* @Upload Cover */}
                            上传封面
                          </LoadingButton>
                        </label>
                      </Box>
                      <Box sx={{ width: 0.5 }}>
                        <LoadingButton
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          onClick={handleClickUseDefaultCover}
                          loading={isSubmittingDefaultCover}
                        >
                          {/* @Default cover */}
                          默认封面
                        </LoadingButton>
                      </Box>
                    </Stack>
                    <Box pl={2} pr={2}>
                      <LoadingButton
                        disabled={disabledPost}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        {/* @Post it */}
                        发布
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Form>
              </FormikProvider>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Page>
    </>
  );
}
