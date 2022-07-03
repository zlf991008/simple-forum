package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Notification;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationMapper {
    Integer insertNotification(Notification notification);
    Integer updateNotification(String userId);
    List<Notification> listNotificationsByUserId(String userId);
}
