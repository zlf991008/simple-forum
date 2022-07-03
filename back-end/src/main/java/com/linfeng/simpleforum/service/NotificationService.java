package com.linfeng.simpleforum.service;
import com.linfeng.simpleforum.entity.ResponseResult;

import java.util.List;

public interface NotificationService {
    ResponseResult insertPrivateLetter(String avatar, String content, String toUserId, String userId);
    ResponseResult updateNotification(String userId);
    ResponseResult listNotificationsByUserId(String userId);
}
