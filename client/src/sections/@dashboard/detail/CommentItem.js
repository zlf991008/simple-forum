import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { fToNow } from '../../../utils/formatTime';
import { addAvatarPrefix } from '../../../utils/addPrefix';

CommentItem.propTypes = {
  comment: PropTypes.object,
  postDetail: PropTypes.object,
  setPostDetail: PropTypes.func,
};

const ExpandMore = styled((props) => {
  // eslint-disable-next-line no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function CommentItem({ comment, postDetail, setPostDetail }) {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
    touched.reply = false;
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
        await axios
          .post('/comment/add', {
            postId: comment.postId,
            parentId: comment.commentId,
            content: values.reply,
            userId: currentUser.userId,
            replyToUserId: comment.userId,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.statusCode === 200) {
              setExpanded(false);
              setTimeout(() => {
                setPostDetail({
                  ...postDetail,
                  commentsCount: postDetail.commentsCount + 1,
                  heat: postDetail.heat + 20,
                });
                setTimeout(() => {
                  setFieldValue('reply', '');
                  setSubmitting(false);
                  touched.reply = false;
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
  const { avatar, name, userId, content, replyToUserId, replyToUserName, replyToUserAvatar, commentTime, parentId } =
    comment;

  const navigate = useNavigate();
  const handleClickName = () => {
    if (userId === currentUser.userId) navigate('/dashboard/home');
    else {
      navigate('/dashboard/visit', {
        state: {
          userId,
        },
      });
    }
  };
  const handleClickReplyToUserName = () => {
    if (userId === currentUser.userId) navigate('/dashboard/home');
    else {
      navigate('/dashboard/visit', {
        state: {
          userId: replyToUserId,
        },
      });
    }
  };

  return (
    <Box mt={1}>
      <Card sx={{ boxShadow: 3, borderRadius: 0.8 }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={addAvatarPrefix(avatar)} />}
          action={
            parentId === null || parentId === '' || parentId === undefined ? null : (
              <Stack direction="row" spacing={2}>
                <Typography variant="h6" mt={2} mr={1}>
                  {replyToUserName !== null && replyToUserName !== '' ? 'To' : ''}
                </Typography>
                <Stack direction="column" pr={2}>
                  <Avatar src={addAvatarPrefix(replyToUserAvatar)} />
                  <Link underline="hover" color="inherit" onClick={handleClickReplyToUserName}>
                    <Typography variant="subtitle1" sx={{ cursor: 'pointer' }}>
                      {replyToUserName}
                    </Typography>
                  </Link>
                </Stack>
              </Stack>
            )
          }
          title={
            <Link underline="hover" color="inherit" variant="subtitle1" onClick={handleClickName}>
              <Typography variant="subtitle1" sx={{ cursor: 'pointer' }}>
                {name}
              </Typography>
            </Link>
          }
          subheader={fToNow(commentTime)}
        />
        <CardContent>
          <Typography variant="subtitle1" color="text.primary">
            {content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="reply">
            <ReplyIcon />
            <Typography>
              {/* @Reply  */}
              回复
            </Typography>
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
                    {/* @Reply */}
                    回复
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
