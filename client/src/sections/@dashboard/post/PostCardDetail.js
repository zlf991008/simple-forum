import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import {
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  useMediaQuery,
  Stack,
  Dialog,
  Box,
  Divider,
} from '@mui/material';

// icons
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
import { red } from '@mui/material/colors';

import axios from 'axios';
// hooks
import useCurrentUser from '../../../hooks/useCurrentUser';

// components
import Label from '../../../components/Label';
// format
import { fType } from '../../../utils/formatType';
import { fDate } from '../../../utils/formatTime';

import PostComment from './PostComment';
import PostCommentForm from './PostCommentForm';

import { addAvatarPrefix, addCoverPrefix } from '../../../utils/addPrefix';

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

PostCardDetail.propTypes = {
  post: PropTypes.object.isRequired,
  setPost: PropTypes.func,
  handleCloseDetail: PropTypes.func,
  isOpenDetail: PropTypes.bool,
  comments: PropTypes.any,
};

export default function PostCardDetail({ post, setPost, handleCloseDetail, isOpenDetail, comments }) {
  console.log('PostCardDetail');
  // Card 扩展选项
  const [expanded, setExpanded] = React.useState(true);
  // Dialog设置
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const { title, content, cover, postCreateTime, type, likesCount, commentsCount, heat, email, name, avatar } = post;

  const { currentUser } = useCurrentUser();

  const handleClickLike = () => {
    const updateLikeStatus = async () => {
      const param = new URLSearchParams();
      param.append('userId', currentUser.userId);
      param.append('postId', post.postId);
      await axios({
        method: 'post',
        url: '/post/like',
        data: param,
      }).then((res) => {
        console.log('after click like');
        if (res.data.statusCode === 200) {
          // 点击后得到的结果是0，说明是取消点赞
          if (res.data.data === 0) setPost({ ...post, likesCount: likesCount - 1, likeStatus: 0, heat: heat - 10 });
          // 是1，说明是点赞，那么热度 +10
          else setPost({ ...post, likesCount: likesCount + 1, likeStatus: 1, heat: heat + 10 });
        }
      });
    };
    updateLikeStatus();
  };

  // comment
  const [dialogFormOpen, setDialogFormOpen] = React.useState(false);

  // 没有判断结果
  const handleCloseDialogForm = () => {
    setDialogFormOpen(false);
  };
  const handleClickComment = () => {
    setDialogFormOpen(true);
  };

  const handleClickDelete = async () => {
    await axios
      .delete('/post/delete', {
        params: {
          postId: post.postId,
        },
      })
      .then((res) => {
        console.log(res);
        setPost({ ...post });
      });
  };

  return (
    <div>
      <PostCommentForm
        post={post}
        setPost={setPost}
        dialogFormOpen={dialogFormOpen}
        setDialogFormOpen={setDialogFormOpen}
        handleCloseDialogForm={handleCloseDialogForm}
      />

      <Dialog
        fullScreen={fullScreen}
        open={isOpenDetail}
        onClose={handleCloseDetail}
        aria-labelledby="responsive-dialog-title"
        key={post.postId}
      >
        <Box fullHeight minWidth={500}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={addAvatarPrefix(avatar)}>
                  {/* R */}
                </Avatar>
              }
              title={
                <Stack direction="row">
                  <Typography variant="h6">{name}</Typography>
                  <Typography
                    variant="h6"
                    ml={2}
                    sx={{
                      color: 'grey',
                    }}
                  >
                    {email}
                  </Typography>
                </Stack>
              }
              subheader={fDate(postCreateTime)}
            />
            <CardMedia component="img" height="194" image={addCoverPrefix(cover)} alt="Paella dish" />
            <CardContent>
              <Label
                variant="ghost"
                color={type === 'SEEK_HELP' || type === 'SEEK_OWNER' || type === 'SEEK_LOST_PROP' ? 'error' : 'primary'}
              >
                <Typography variant="h5" color="text.primary" sx={{ textTransform: 'uppercase' }}>
                  {fType(type)}
                </Typography>
              </Label>
              <Typography variant="h6" color="text.primary" mt={2} ml={3}>
                {title}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="like" onClick={handleClickLike}>
                <FavoriteTwoToneIcon />
                <Typography>{likesCount}</Typography>
              </IconButton>

              <IconButton aria-label="comment" onClick={handleClickComment}>
                <ChatTwoToneIcon />
                <Typography>{commentsCount}</Typography>
              </IconButton>
              <IconButton aria-label="heat">
                <LocalFireDepartmentTwoToneIcon />
                <Typography>{heat}</Typography>
              </IconButton>
              <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                {/* <ExpandMoreIcon /> */}
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph variant="subtitle1">
                  {content}
                </Typography>

                <Divider textAlign="center">comments↓</Divider>

                <Box mt={2}>
                  {comments === null || comments === undefined ? (
                    <Typography paragraph variant="h6">
                      No Comment
                    </Typography>
                  ) : (
                    comments.map((topComment, index) => (
                      <PostComment key={index} comment={topComment} post={post} setPost={setPost} />
                    ))
                  )}
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        </Box>
      </Dialog>
    </div>
  );
}
