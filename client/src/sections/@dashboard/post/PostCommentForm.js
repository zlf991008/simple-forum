import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Stack, TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'axios';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { addAvatarPrefix } from '../../../utils/addPrefix';

PostCommentForm.propTypes = {
  post: PropTypes.object.isRequired,
  setPost: PropTypes.func,
  dialogFormOpen: PropTypes.bool.isRequired,
  handleCloseDialogForm: PropTypes.func.isRequired,
};

export default function PostCommentForm({ post, setPost, dialogFormOpen, setDialogFormOpen, handleCloseDialogForm }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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
            postId: post.postId,
            parentId: null,
            userId: currentUser.userId,
            name: currentUser.name,
            replyToUserId: post.userId,
            replyToName: post.name,
            avatar: currentUser.avatar,
            content: values.reply,
          })
          .then((res) => {
            if (res.data.statusCode === 200)
              setPost({ ...post, commentsCount: post.commentsCount + 1, heat: post.heat + 20 });
          });
      };

      addComment();
      setTimeout(() => {
        setSubmitting(false);
        setDialogFormOpen(false);
        setTimeout(() => {
          setFieldValue('reply', '');
        }, 1000);
      }, 1000);
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  const handleChangeReply = (e) => {
    setFieldValue('reply', e.target.value);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={dialogFormOpen}
        onClose={handleCloseDialogForm}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{'Comment'}</DialogTitle>
        <DialogContent>
          <Box fullWidth minWidth={300} minHeight={100} mt={1}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Reply Content"
                    {...getFieldProps('reply')}
                    error={Boolean(touched.reply && errors.reply)}
                    helperText={touched.reply && errors.reply}
                    multiline
                    rows={3}
                    onChange={handleChangeReply}
                    value={formik.values.reply}
                  />
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Reply
                  </LoadingButton>
                </Stack>
              </Form>
            </FormikProvider>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
