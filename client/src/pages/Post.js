import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// mui
import { Grid, Container, Stack, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

// components
import Page from '../components/Page';
// import { BlogPostsSearch } from '../sections/@dashboard/blog';
import { PostCard, PostsSort, PostsTypeSort, PostSearch } from '../sections/@dashboard/post';
import Iconify from '../components/Iconify';

// mock
// import POSTS from '../_mock/blog';
import useCurrentUser from '../hooks/useCurrentUser';
import { PostsFilter } from '../sections/@dashboard/post/PostsFilter';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  // { value: 'latest', label: 'Latest' },
  // { value: 'oldest', label: 'Oldest' },
  // { value: 'popular', label: 'Popular' },
  { value: 'latest', label: '最新' },
  { value: 'oldest', label: '最老' },
  { value: 'popular', label: '最热' },
];
const TYPE_SORT_OPTIONS = [
  // { value: 'ALL', label: 'All' },
  // { value: 'SHARE_MOOD', label: 'Share Mood' },
  // { value: 'SEEK_HELP', label: 'Seek Help' },
  // { value: 'SEEK_LOST_PROP', label: 'Seek Lost Property' },
  // { value: 'SEEK_OWNER', label: 'Seek Owner' },
  // { value: 'BUY_STH', label: 'Buy Something' },
  // { value: 'SELL_STH', label: 'Sell Something' },
  { value: 'ALL', label: '所有' },
  { value: 'SHARE_MOOD', label: '分享' },
  { value: 'SEEK_HELP', label: '求助' },
  { value: 'SEEK_LOST_PROP', label: '找失物' },
  { value: 'SEEK_OWNER', label: '找失主' },
  { value: 'BUY_STH', label: '买东西' },
  { value: 'SELL_STH', label: '卖东西' },
];

// ----------------------------------------------------------------------

export default function Post() {
  console.log('Post render');
  const [postList, setPostList] = React.useState([]);
  const [typeSortOptionValue, setTypeSortOptionValue] = React.useState('ALL');
  const [sortOptionValue, setSortOptionValue] = React.useState('latest');
  const { currentUser } = useCurrentUser();
  React.useEffect(() => {
    const fetchPostList = async () => {
      await axios
        .get('/post/latest', {
          params: {
            // 用来查询当前用户对帖子的状态
            userId: currentUser.userId,
          },
        })
        .then((res) => {
          if (res.data.data !== null) {
            res.data.data.forEach((element) => {
              const num = Math.ceil(Math.random() * 23);
              if (element.cover === null) element.cover = `/static/mock-images/covers/cover_${num + 1}.jpg`;
            });
            setPostList(res.data.data);
          }
        });
    };
    fetchPostList();
    // 可不填内容**************************
  }, [currentUser.userId]);
  // **************************

  const onTypeSort = (e) => {
    const index = TYPE_SORT_OPTIONS.findIndex((item) => item.value === e.target.value);
    setTypeSortOptionValue(TYPE_SORT_OPTIONS[index].value);
    filterPostList(`${TYPE_SORT_OPTIONS[index].value}`, sortOptionValue);
  };

  const onSort = (e) => {
    const index = SORT_OPTIONS.findIndex((item) => item.value === e.target.value);
    setSortOptionValue(SORT_OPTIONS[index].value);
    filterPostList(typeSortOptionValue, `${SORT_OPTIONS[index].value}`);
  };

  async function filterPostList(filterRuleOne, filterRuleTwo) {
    const res = await PostsFilter(currentUser.userId, filterRuleOne, filterRuleTwo);
    setPostList(res);
  }

  return (
    <Page title="Post">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {/* @Post */}
            帖子
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/newpost"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {/* @New Post */}
            发布帖子
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <PostSearch postList={postList} />
          <Stack direction="row">
            <Box mr={2}>
              <PostsTypeSort
                options={TYPE_SORT_OPTIONS}
                onTypeSort={onTypeSort}
                typeSortOptionValue={typeSortOptionValue}
              />
            </Box>
            <PostsSort options={SORT_OPTIONS} onSort={onSort} sortOptionValue={sortOptionValue} />
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          {postList.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
