package com.linfeng.simpleforum.entity;

import lombok.*;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("Comment")
public class Comment {
    private String commentId;
    private String postId;
    private String parentId;
    private String userId;
    private String replyToUserId;
    private String content;
    private LocalDateTime commentTime;
    private List<Comment> children;

    private String email;
    private String avatar;
    private String name;
    private String replyToUserName;
    private String replyToUserEmail;
    private String replyToUserAvatar;
}
