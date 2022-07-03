import * as React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, CardContent, Divider, Typography, Stack, TextField } from '@mui/material';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import { addAvatarPrefix } from '../../../utils/addPrefix';
import useCurrentUser from '../../../hooks/useCurrentUser';

VisitUser.propTypes = {
  visitUser: PropTypes.object,
};

export default function VisitUser({ visitUser }) {
  const { avatar, name, email, userId, followingCount, followersCount, friendsCount, followStatus } = visitUser;
  const [status, setStatus] = React.useState(followStatus);
  const [message, setMessage] = React.useState('');
  const { currentUser } = useCurrentUser();

  React.useEffect(() => {
    setStatus(followStatus);
  }, [followStatus]);

  const handleChangeMessage = (e) => {
    if (e.target.value !== '') {
      setErrors(false);
      setHelperText('');
    }
    setMessage(e.target.value);
  };

  const [isSending, setIsSending] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');
  const [errors, setErrors] = React.useState(false);
  const handleSendMessage = () => {
    if (message === '') {
      setErrors(true);
      setHelperText('Not Null');
    } else {
      setIsSending(true);
      const sendMessage = async () => {
        const notificationData = new FormData();
        notificationData.append('avatar', currentUser.avatar);
        notificationData.append('content', message);
        notificationData.append('toUserId', userId);
        notificationData.append('userId', currentUser.userId);

        await axios.post('/notification/addPrivateLetter', notificationData).then((res) => {
          console.log(res);
        });
      };
      sendMessage();
      setTimeout(() => {
        setIsSending(false);
        setMessage('');
      }, 2000);
    }
  };

  const handleClickSubscribe = async () => {
    const formData = new FormData();
    formData.append('userId', currentUser.userId);
    formData.append('toUserId', userId);
    formData.append('followStatus', status);
    await axios.post('/follow/updateFollowStatus', formData).then();
    setStatus(!status);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Avatar
            src={addAvatarPrefix(avatar)}
            sx={{
              height: 64,
              mb: 2,
              width: 64,
            }}
          />
          <Stack spacing={2} direction="row" sx={{ ml: 8 }} alignItems="center">
            <Typography color="textPrimary" gutterBottom variant="h4">
              {name}
            </Typography>
            <Button>
              <Typography color="text.secondary" gutterBottom variant="h5" onClick={handleClickSubscribe}>
                {status === true ? '已关注' : '关注'}
              </Typography>
            </Button>
          </Stack>
          <Typography color="textSecondary" gutterBottom variant="subtitle1">
            {email}
          </Typography>

          <Stack spacing={8} mt={2} direction="row" justifyContent="space-between" alignItems="center">
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                已关注
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                {followingCount}
              </Typography>
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                关注者
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                {followersCount}
              </Typography>
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                朋友
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="subtitle1">
                {friendsCount}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box mt={3}>
          <Divider />
        </Box>
        <Box fullWidth mt={2}>
          <Stack direction="column" pt={2} spacing={2}>
            <TextField
              // label="@Message"
              label="私信"
              value={message}
              onChange={handleChangeMessage}
              multiline
              rows={3}
              helperText={helperText}
              error={errors}
            />
            <LoadingButton endIcon={<SendIcon />} variant="contained" onClick={handleSendMessage} loading={isSending}>
              {/* @Send Message */}
              发送私信
            </LoadingButton>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
