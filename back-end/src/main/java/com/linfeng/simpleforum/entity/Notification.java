package com.linfeng.simpleforum.entity;

import lombok.*;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("Notification")
public class Notification {
    private String notificationId;
    private String title;
    private String content;
    private String avatar;
    private String type;
    private LocalDateTime createTime;
    private Boolean isUnRead;
    private String userId;
    private String toUserId;
    private User user;
}
