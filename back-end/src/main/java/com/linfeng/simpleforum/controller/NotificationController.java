package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.entity.Notification;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RequestMapping(value = "/addPrivateLetter", method = RequestMethod.POST)
    public ResponseResult addPrivateLetter(@RequestParam String avatar, @RequestParam String content, @RequestParam String toUserId, @RequestParam String userId) {
        return notificationService.insertPrivateLetter(avatar, content, toUserId, userId);
    }

    @RequestMapping(value = "/getList", method = RequestMethod.GET)
    public ResponseResult get(@RequestParam String userId) {
        return notificationService.listNotificationsByUserId(userId);
    }

    @RequestMapping(value = "readAll", method = RequestMethod.POST)
    public ResponseResult readAll(@RequestParam String userId) {
        return notificationService.updateNotification(userId);
    }
}
