package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.NotificationMapper;
import com.linfeng.simpleforum.dao.UserMapper;
import com.linfeng.simpleforum.entity.Notification;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.NotificationService;
import com.linfeng.simpleforum.utils.DateUtil;
import com.linfeng.simpleforum.utils.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService{

    private final NotificationMapper notificationMapper;
    private final UserMapper userMapper;

    @Autowired
    public NotificationServiceImpl(NotificationMapper notificationMapper, UserMapper userMapper) {
        this.notificationMapper = notificationMapper;
        this.userMapper = userMapper;
    }

    @Override
    public ResponseResult insertPrivateLetter(String avatar, String content, String toUserId, String userId) {
        Notification notification = buildNotification(avatar, content, toUserId, userId);
        notification.setType("PRIVATE_LETTER");
        notification.setTitle("private letter");
        if (notificationMapper.insertNotification(notification) != 1)
            return new ResponseResult(999, "Add notification failed", notification);
        return new ResponseResult(200, "Add notification success", notification);
    }

    public Notification buildNotification(String avatar, String content, String toUserId, String userId) {
        Notification notification = new Notification();
        notification.setNotificationId(UuidUtil.uuid());
        notification.setCreateTime(DateUtil.notificationCreateTime());
        notification.setAvatar(avatar);
        notification.setContent(content);
        notification.setToUserId(toUserId);
        notification.setUserId(userId);
        return notification;
    }

    @Override
    public ResponseResult updateNotification(String userId) {
            if (notificationMapper.updateNotification(userId) != 1)
                return new ResponseResult(999, "Read notification failed", userId);
        return new ResponseResult(200, "Read notification success", null);
    }

    @Override
    public ResponseResult listNotificationsByUserId(String userId) {
        List<Notification> notificationList = notificationMapper.listNotificationsByUserId(userId);
        if (notificationList == null || notificationList.size() == 0)
            return new ResponseResult(404, "Notification list is empty", new Notification());
        for (Notification notification: notificationList) {
            notification.setUser(userMapper.getUserByUserId(notification.getUserId()));
        }
        return new ResponseResult(200, "Get notification list success", notificationList);
    }
}
