import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent, Stack } from '@mui/material';

// style
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';

// components
import Label from '../../../components/Label';

// sections
// import PostCardDetail from './PostCardDetail';

// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
import { fType } from '../../../utils/formatType';

import { addAvatarPrefix, addCoverPrefix } from '../../../utils/addPrefix';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function PostCard({ post, index }) {
  // 因为要更新状态，所以需要用到useState，所以需要重新用到一个setPost
  const { title, postCreateTime, cover, type, likesCount, commentsCount, heat, name, avatar } = post;
  const navigate = useNavigate();

  // 图标
  const POST_INFO = [
    { number: likesCount, icon: 'ant-design:heart-filled' },
    { number: commentsCount, icon: 'ant-design:message-filled' },
    { number: heat, icon: 'ant-design:fire-filled' },
  ];

  // index = 0 大图
  const latestPostLarge = index === -1;
  // index = 1 || 2 黑色背景
  // const latestPost = index === 1 || index === 2;
  const latestPost = index === -1;

  // Tree Comments
  // 回调函数
  const handleClickTitle = () => {
    navigate('/dashboard/detail', {
      state: {
        post,
      },
      replace: true,
    });
  };

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />
          <AvatarStyle
            alt={name}
            src={addAvatarPrefix(avatar)}
            sx={{
              ...((latestPostLarge || latestPost) && {
                zIndex: 9,
                top: 24,
                left: 24,
                width: 40,
                height: 40,
              }),
            }}
          />

          <CoverImgStyle alt={title} src={addCoverPrefix(cover)} />
        </CardMediaStyle>
        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
        >
          {latestPostLarge || latestPost ? (
            <Stack direction="row">
              <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                {fDate(postCreateTime)}
              </Typography>
              <Box
                sx={{
                  ml: latestPostLarge ? 5 : 1,
                }}
              >
                <Label
                  variant="filled"
                  color={
                    type === 'SEEK_HELP' || type === 'SEEK_OWNER' || type === 'SEEK_LOST_PROP' ? 'error' : 'primary'
                  }
                  sx={{ textTransform: 'uppercase' }}
                >
                  <Typography variant={latestPostLarge ? 'h5' : 'subtitle1'} color="text.primary">
                    {fType(type)}
                  </Typography>
                </Label>
              </Box>
            </Stack>
          ) : (
            <Box>
              <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                {fDate(postCreateTime)}
              </Typography>

              <Label
                variant="filled"
                sx={{
                  zIndex: 9,
                  top: 16,
                  right: 16,
                  position: 'absolute',
                  textTransform: 'uppercase',
                }}
                color={type === 'SEEK_HELP' || type === 'SEEK_OWNER' || type === 'SEEK_LOST_PROP' ? 'error' : 'primary'}
              >
                {fType(type)}
              </Label>
            </Box>
          )}

          <TitleStyle
            to="#"
            color="inherit"
            variant="subtitle1"
            underline="hover"
            // component={RouterLink}
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
            mt={latestPostLarge === true ? 2 : 0}
            onClick={() => handleClickTitle()}
          >
            <Typography sx={{ cursor: 'pointer' }} variant="subtitle1">
              {title}
            </Typography>
          </TitleStyle>

          <InfoStyle>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5,
                  ...((latestPostLarge || latestPost) && {
                    color: 'grey.500',
                  }),
                }}
              >
                <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
              </Box>
            ))}
          </InfoStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}
