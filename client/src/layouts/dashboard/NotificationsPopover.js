import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import axios from 'axios';
import { fToNow } from '../../utils/formatTime';

// components
import Iconify from '../../components/Iconify';
import MenuPopover from '../../components/MenuPopover';

import useCurrentUser from '../../hooks/useCurrentUser';
import { addAvatarPrefix } from '../../utils/addPrefix';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const anchorRef = React.useRef(null);
  const { currentUser } = useCurrentUser();
  const [notifications, setNotifications] = React.useState([]);
  const [totalUnRead, setTotalUnRead] = React.useState();
  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const navigate = useNavigate();

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
          if (res.data.statusCode === 200) setNotifications(res.data.data);
        });
    };

    fetchNotificationList();
  }, [currentUser.userId]);

  React.useEffect(() => {
    if (notifications) setTotalUnRead(notifications.filter((item) => item.isUnRead === true).length);
  }, [notifications, totalUnRead]);

  const [open, setOpen] = React.useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
    const updateNotifications = async () => {
      const form = new FormData();
      form.append('userId', currentUser.userId);
      await axios.post('/notification/readAll', form).then((res) => {
        console.log(res);
      });
    };

    updateNotifications();
  };

  const goToNotification = () => {
    navigate('/dashboard/notification');
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {/* Notifications */}
              提示
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {/* @You have {totalUnRead} unread messages */}
              你有 {totalUnRead} 条未读信息
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>aa
        </Scrollbar> */}
        <List
          disablePadding
          subheader={
            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
              {/* @New */}
              新的
            </ListSubheader>
          }
        >
          {notifications.slice(0, 2).map((notification) => (
            <NotificationItem key={notification.notificationId} notification={notification} />
          ))}
        </List>

        {/* <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.notificationId} notification={notification} />
            ))}
          </List> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={goToNotification}>
            {/* @View All */}
            查看全部
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.object,
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }} src={addAvatarPrefix(avatar)} />
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createTime)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.content)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_chat.svg" />,
      title,
    };
  }

  if (notification.type === 'PRIVATE_LETTER') {
    return {
      avatar: notification.avatar,
      title: notification.title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
