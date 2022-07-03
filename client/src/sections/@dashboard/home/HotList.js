import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
// utils
import { fType } from '../../../utils/formatType';

// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import Label from '../../../components/Label';

import { addAvatarPrefix } from '../../../utils/addPrefix';
import useCurrentUser from '../../../hooks/useCurrentUser';

// ----------------------------------------------------------------------

HotList.propTypes = {
  title: PropTypes.string,
  hotList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function HotList({ title, hotList, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={<Typography variant="h4">{title}</Typography>} />

      {/* <Scrollbar>
          </Scrollbar> */}
      <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
        {hotList.map((post, index) => (
          <HotListItem key={index} post={post} />
        ))}
      </Stack>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          component={RouterLink}
          to="/dashboard/post"
        >
          {/* @View all */}
          查看全部
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

HotListItem.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    userId: PropTypes.string,
    avatar: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    heat: PropTypes.number,
    type: PropTypes.string,
  }),
};

function HotListItem({ post }) {
  const { title, userId, avatar, name, email, heat, type } = post;
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const handleClickTitle = () => {
    navigate('/dashboard/detail', {
      state: {
        post,
      },
      replace: true,
    });
  };

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
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={addAvatarPrefix(avatar)}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Stack direction="row">
          <Link underline="hover" color="inherit" to="#" onClick={() => handleClickTitle()}>
            <Typography color="inherit" variant="h6" sx={{ color: 'text.primary', cursor: 'pointer' }} noWrap>
              {title}
            </Typography>
          </Link>
          <Box sx={{ pl: 3 }}>
            <Label
              variant="ghost"
              sx={{ textTransform: 'uppercase' }}
              color={type === 'SEEK_HELP' || type === 'SEEK_OWNER' || type === 'SEEK_LOST_PROP' ? 'error' : 'primary'}
            >
              {fType(type)}
            </Label>
          </Box>
        </Stack>

        <Stack direction="row">
          <Link underline="hover" color="inherit" to="#" onClick={() => handleClickName()}>
            <Typography variant="body1" sx={{ color: 'text.secondary', cursor: 'pointer' }} noWrap>
              {name}
            </Typography>
          </Link>
          <Typography variant="body1" sx={{ pl: 3, color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Stack>
      </Box>
      <Stack direction="row">
        <LocalFireDepartmentTwoToneIcon />
        <Typography variant="caption" sx={{ pt: 0.5, pl: 1, pr: 3, flexShrink: 0, color: 'text.secondary' }}>
          {heat}
        </Typography>
      </Stack>
    </Stack>
  );
}
