import * as React from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
// import { styled } from '@mui/material/styles';
import {
  Container,
  Stack,
  Typography,
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Divider,
  Link,
} from '@mui/material';
import { red } from '@mui/material/colors';
// icons
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
// components
import Page from '../components/Page';
import Label from '../components/Label';
// format
import { fType } from '../utils/formatType';
import { fDate } from '../utils/formatTime';
import { addAvatarPrefix, addCoverPrefix } from '../utils/addPrefix';

// sections
import DetailComment from '../sections/@dashboard/detail/DetailComment';
import CommentForm from '../sections/@dashboard/detail/CommentForm';

// hooks
import useCurrentUser from '../hooks/useCurrentUser';

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

export default function Detail() {
  console.log('Details render');
  const [expanded, setExpanded] = React.useState(false);
  const [commentList, setCommentList] = React.useState([{}]);
  const location = useLocation();
  const [postDetail, setPostDetail] = React.useState(location.state.post);
  const { avatar, userId, name, email, postCreateTime, cover, type, title, likesCount, commentsCount, heat, content } =
    postDetail;
  React.useEffect(() => {
    const fetchCommentList = async () => {
      await axios
        .get('/comment/all', {
          params: {
            postId: postDetail.postId,
          },
        })
        .then((res) => {
          setCommentList(res.data.data);
          setExpanded(true);
        });
    };
    fetchCommentList();
  }, [postDetail]);

  const { currentUser } = useCurrentUser();
  const handleClickLike = () => {
    const updateLikeStatus = async () => {
      const param = new URLSearchParams();
      param.append('userId', currentUser.userId);
      param.append('postId', postDetail.postId);
      await axios({
        method: 'post',
        url: '/post/like',
        data: param,
      }).then((res) => {
        console.log('after click like');
        if (res.data.statusCode === 200) {
          // 点击后得到的结果是0，说明是取消点赞
          if (res.data.data === 0)
            setPostDetail({ ...postDetail, likesCount: likesCount - 1, likeStatus: 0, heat: heat - 10 });
          // 是1，说明是点赞，那么热度 +10
          else setPostDetail({ ...postDetail, likesCount: likesCount + 1, likeStatus: 1, heat: heat + 10 });
        }
      });
    };
    updateLikeStatus();
  };

  const [showTopReply, setShowTopReply] = React.useState(false);
  const handleClickComment = () => {
    setShowTopReply(true);
  };

  const navigate = useNavigate();
  const handleClickPostName = () => {
    if (userId === currentUser.userId) navigate('/dashboard/home');
    else {
      navigate('/dashboard/visit', {
        state: {
          userId,
        },
      });
    }
  };

  return (
    <Page title="Post Details">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Post Details
          </Typography>
        </Stack>

        <Stack direction="row">
          <Card sx={{ width: 1 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={addAvatarPrefix(avatar)}>
                  {/* R */}
                </Avatar>
              }
              title={
                <Stack direction="row">
                  <Link underline="hover" color="inherit" onClick={handleClickPostName}>
                    <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                      {name}
                    </Typography>
                  </Link>
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
                sx={{ pt: 2, pb: 2 }}
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
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Box sx={{ ml: 2 }}>
                  <Typography paragraph variant="subtitle1">
                    {content}
                  </Typography>
                </Box>

                <Divider textAlign="center" variant="subtitle2">
                  {/* @Comments↓ */}
                  评论
                </Divider>

                <Box mt={2}>
                  {showTopReply === true ? (
                    <CommentForm
                      postDetail={postDetail}
                      setPostDetail={setPostDetail}
                      setShowTopReply={setShowTopReply}
                    />
                  ) : null}
                </Box>

                <Box mt={2}>
                  {commentList === null || commentList === undefined || commentList.length === 0 ? (
                    <Typography paragraph variant="h6">
                      {/* @No Comment */}
                      无评论
                    </Typography>
                  ) : (
                    commentList.map((topComment) => (
                      <DetailComment
                        key={topComment.commentId}
                        comment={topComment}
                        postDetail={postDetail}
                        setPostDetail={setPostDetail}
                        indentationNum={0}
                      />
                    ))
                  )}
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}
