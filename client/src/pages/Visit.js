import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Stack, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';

// components
import Page from '../components/Page';

// sections
import VisitUser from '../sections/@dashboard/visit/VisitUser';
import VisitProfile from '../sections/@dashboard/visit/VisitProfile';
import useCurrentUser from '../hooks/useCurrentUser';

export default function Visit() {
  const location = useLocation();
  const { userId } = location.state;
  const [visitUser, setVisitUser] = React.useState({});
  const [visitProfile, setVisitProfile] = React.useState({});
  const { currentUser } = useCurrentUser();
  React.useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('/user/get', {
          params: {
            userId: currentUser.userId,
            toUserId: userId,
          },
        })
        .then((res) => {
          setVisitUser(res.data.data.visitUser);
          setVisitProfile(res.data.data.visitProfile);
        });
    };
    fetchData();
  }, [userId, currentUser]);

  return (
    <Page>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {/* @{visitUser.name}'s Profile */}
            {visitUser.name} 的简介
          </Typography>
        </Stack>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                {visitUser && <VisitUser visitUser={visitUser} />}
              </Grid>
              <Grid item lg={8} md={6} xs={12}>
                {visitProfile && <VisitProfile visitProfile={visitProfile} />}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </Page>
  );
}
