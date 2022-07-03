import * as React from 'react';
import PropTypes from 'prop-types';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Link,
  Box,
  Stack,
  Avatar,
  IconButton,
  Typography,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'axios';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { fDateTime } from '../../../utils/formatTime';
import { addAvatarPrefix } from '../../../utils/addPrefix';

PostCommentItem.propTypes = {
  comment: PropTypes.object,
  post: PropTypes.object,
  setPost: PropTypes.func,
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PostCommentItem({ comment, post, setPost }) {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
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
        const res = await axios.post('/comment/add', {
          postId: comment.postId,
          parentId: comment.commentId,
          userId: currentUser.userId,
          name: currentUser.name,
          replyToUserId: comment.userId,
          replyToName: comment.name,
          avatar: currentUser.avatar,
          content: values.reply,
        });
        if (res.data.statusCode === 200) {
          return true;
        }
        return false;
      };

      if (addComment()) setPost({ ...post, commentsCount: post.commentsCount + 1, heat: post.heat + 20 });
      setTimeout(() => {
        setExpanded(false);
        setSubmitting(false);
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
    <Box mt={3}>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={addAvatarPrefix(comment.avatar)}>
              {/* R */}
            </Avatar>
          }
          action={
            <Stack direction="row" spacing={2}>
              <Typography variant="subtitle1">
                {comment.replyToUserName !== null && comment.replyToUserName !== '' ? 'To' : ''}
              </Typography>
              <Link underline="hover" color="inherit" variant="subtitle1">
                {comment.replyToUserName}
              </Link>
            </Stack>
          }
          title={comment.name}
          subheader={fDateTime(comment.commentTime)}
        />
        {/* <CardMedia component="img" height="194" image="/static/images/cards/paella.jpg" alt="Paella dish" /> */}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {comment.content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="reply">
            <ReplyIcon />
            <Typography> Reply </Typography>
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
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
                    onChange={handleChangeReply}
                    value={formik.values.reply}
                  />
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Reply
                  </LoadingButton>
                </Stack>
              </Form>
            </FormikProvider>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
}
