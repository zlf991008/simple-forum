import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// mui
import { Container, Typography, Box, Grid, Stack, Card, Link } from '@mui/material';

import axios from 'axios';
import useCurrentUser from '../hooks/useCurrentUser';
// components
import Page from '../components/Page';
import { addAvatarPrefix } from '../utils/addPrefix';

import { fToNow } from '../utils/formatTime';

NotificationItem.propTypes = {
  notification: PropTypes.object,
};

function NotificationItem({ notification }) {
  const { avatar, user, content, createTime } = notification;
  const { userId, name, email } = user;
  const navigate = useNavigate();

  const handleClickName = () => {
    navigate('/dashboard/visit', {
      state: {
        userId,
      },
    });
  };

  return (
    <Card>
      <Box sx={{ m: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            alt={name}
            src={addAvatarPrefix(avatar)}
            sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
          />
          <Stack direction="column">
            <Box fullWidth sx={{ pb: 2, pl: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row">
                  <Link underline="hover" color="inherit" to="#" onClick={() => handleClickName()}>
                    <Typography variant="h6" sx={{ color: 'text.primary', cursor: 'pointer' }} noWrap>
                      {name}
                    </Typography>
                  </Link>
                  <Typography variant="h6" sx={{ pl: 3, color: 'text.secondary' }} noWrap>
                    {email}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1" sx={{ pl: 3, color: 'text.secondary' }} noWrap>
                    {fToNow(createTime)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Typography variant="h6" sx={{ color: 'text.primary', pl: 2 }} noWrap>
              {content}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

export default function Notification() {
  const [notificationList, setNotificationList] = React.useState([]);
  const { currentUser } = useCurrentUser();
  React.useEffect(() => {
    const fetchNotificationList = async () => {
      await axios
        .get('/notification/getList', {
          params: {
            userId: currentUser.userId,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          if (res.data.statusCode === 200) setNotificationList(res.data.data);
        });
    };

    fetchNotificationList();
  }, []);

  return (
    <Page title="Notification">
      <Container>
        <Stack direction="column" alignItems="left" justifyContent="space-between" mb={1}>
          <Typography variant="h3" gutterBottom>
            {/* @Hi, Welcome back */}
            提示
          </Typography>
          <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
            {notificationList.map((notification) => (
              <NotificationItem key={notification.notificationId} notification={notification} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Page>
  );
}
