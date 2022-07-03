import * as React from 'react';
import { Avatar, Box, Button, Card, CardContent, Divider, Typography, styled, Stack } from '@mui/material';
import axios from 'axios';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { addAvatarPrefix } from '../../../utils/addPrefix';

const Input = styled('input')({
  display: 'none',
});

export default function AccountProfile() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { avatar, email, name, follow } = currentUser;
  const { followingCount, followersCount, friendsCount } = follow;

  const handleUploadPicture = (e) => {
    const uploadPicture = async () => {
      const file = e.target.files[0];
      const avatarData = new FormData();
      avatarData.append('userId', currentUser.userId);
      avatarData.append('avatar', file);
      await axios
        .post('/user/updateAvatar', avatarData)
        .then((res) => {
          if (res.data.statusCode === 200) {
            setCurrentUser({ ...currentUser, avatar: res.data.data });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    uploadPicture();
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
          <Typography color="textPrimary" gutterBottom variant="h4">
            {name}
          </Typography>
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
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleUploadPicture} />
            <Button variant="contained" component="span" fullWidth>
              {/* @Upload Picture */}
              上传图片
            </Button>
          </label>
        </Box>
      </CardContent>
    </Card>
  );
}
