import * as React from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Grid, Container, Typography, Stack, Divider, Box } from '@mui/material';
import axios from 'axios';

// components
import Page from '../components/Page';

// hooks
import useCurrentUser from '../hooks/useCurrentUser';
// sections
import HotList from '../sections/@dashboard/home/HotList';
import MyPosts from '../sections/@dashboard/home/MyPosts';
import ActivityChart from '../sections/@dashboard/home/ActivityChart';
import HomeTasks from '../sections/@dashboard/home/HomeTasks';

// // ----------------------------------------------------------------------

export default function Home() {
  console.log('Home render');
  const [hotList, setHotList] = React.useState([]);
  const [myPosts, setMyPosts] = React.useState([]);
  const { currentUser } = useCurrentUser();
  React.useEffect(() => {
    const fetchData = async () => {
      const fetchHotList = axios
        .get('/post/hotList', {
          params: {
            // 用来查询当前用户对帖子的状态
            userId: currentUser.userId,
          },
        })
        .then((res) => {
          res.data.data.forEach((element) => {
            const num = Math.ceil(Math.random() * 23);
            if (element.cover === null) element.cover = `/static/mock-images/covers/cover_${num + 1}.jpg`;
          });

          setHotList(res.data.data);
        });
      const fetchMyPosts = axios
        .get('/post/allPostsInUser', {
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
            setMyPosts(res.data.data);
          }
        });
      await Promise.all([fetchHotList, fetchMyPosts]);
    };

    fetchData();
  }, [currentUser.userId]);

  return (
    <Page title="Home">
      <Container maxWidth="xl">
        <Stack direction="column" alignItems="left" justifyContent="space-between" mb={1}>
          <Typography variant="h3" gutterBottom>
            {/* @Hi, Welcome back */}
            嗨，欢迎回来
          </Typography>

          <Grid item xs={12} md={6} lg={8}>
            {hotList === undefined || hotList.length === 0 ? (
              <Box mt={5} ml={2}>
                <Stack direction="column">
                  <Box mb={2}>
                    <Divider />
                  </Box>
                  <Typography variant="h4" gutterBottom>
                    {/* @Hot list is empty */}
                    今天还没有人发布帖子
                  </Typography>
                  <Box mb={2} />
                </Stack>
              </Box>
            ) : (
              // <HotList title="@Today Hot List" hotList={hotList} />
              <HotList title="今日热榜" hotList={hotList} />
            )}
            <Divider />
            <Box mt={3} sx={{ width: 1, maxHeight: 500 }}>
              <Stack direction="row" spacing={5}>
                <Box sx={{ width: '40%' }}>
                  <HomeTasks />
                </Box>
                <Box sx={{ width: '60%' }}>
                  <ActivityChart />
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Box mt={5}>
            <Divider />
          </Box>

          <Box mt={2}>
            {myPosts === undefined || myPosts.length === 0 ? (
              <Box mt={5} ml={2}>
                <Stack direction="column">
                  <Box mb={2}>
                    <Divider />
                  </Box>
                  <Typography variant="h4" gutterBottom>
                    {/* @My posts is empty */}
                    我的发帖记录
                  </Typography>
                  <Box mb={2} />
                </Stack>
              </Box>
            ) : (
              <MyPosts myPosts={myPosts} setMyPosts={setMyPosts} />
            )}
          </Box>
        </Stack>
      </Container>
    </Page>
  );
}
