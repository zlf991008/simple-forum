import * as React from 'react';
import PropTypes from 'prop-types';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Stack, TextField, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'axios';
import useCurrentUser from '../../../hooks/useCurrentUser';

PostCommentForm.propTypes = {
  setShowTopReply: PropTypes.func,
  postDetail: PropTypes.object.isRequired,
  setPostDetail: PropTypes.func,
};

export default function PostCommentForm({ setShowTopReply, postDetail, setPostDetail }) {
  const { currentUser } = useCurrentUser();

  const NewReplySchema = Yup.object().shape({
    reply: Yup.string().min(5, 'Too Short!').max(100, 'Too Long!').required('Reply Content required!'),
  });
  const formik = useFormik({
    initialValues: {
      reply: '',
    },
    validationSchema: NewReplySchema,
    onSubmit: (values, { setSubmitting }) => {
      const addComment = async () => {
        console.log(currentUser.avatar);
        await axios
          .post('/comment/add', {
            postId: postDetail.postId,
            // 顶层评论
            parentId: null,
            content: values.reply,
            userId: currentUser.userId,
            replyToUserId: postDetail.userId,
          })
          .then((res) => {
            if (res.data.statusCode === 200) {
              setTimeout(() => {
                setShowTopReply(false);
                setPostDetail({
                  ...postDetail,
                  commentsCount: postDetail.commentsCount + 1,
                  heat: postDetail.heat + 20,
                });
                setTimeout(() => {
                  setFieldValue('reply', '');
                  setSubmitting(false);
                }, 1000);
              }, 1000);
            }
          });
      };
      addComment();
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  const handleChangeReply = (e) => {
    setFieldValue('reply', e.target.value);
  };

  return (
    <Box fullWidth minWidth={300} minHeight={100} mt={1}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              // label="Reply Content"
              label="回复内容"
              {...getFieldProps('reply')}
              error={Boolean(touched.reply && errors.reply)}
              helperText={touched.reply && errors.reply}
              multiline
              rows={3}
              onChange={handleChangeReply}
              value={formik.values.reply}
            />

            <Box pl={2} pr={2} sx={{ width: 1 }} alignItems="center">
              <Stack direction="row" spacing={5}>
                <Button
                  sx={{ width: '50%' }}
                  size="large"
                  variant="contained"
                  onClick={() => setShowTopReply(false)}
                  endIcon={<HighlightOffIcon />}
                >
                  {/* @Cancel */}
                  取消
                </Button>

                <LoadingButton
                  sx={{ width: '50%' }}
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  endIcon={<PlusOneIcon />}
                >
                  {/* @Reply */}
                  回复
                </LoadingButton>
              </Stack>
            </Box>
          </Stack>
        </Form>
      </FormikProvider>
    </Box>
  );
}
