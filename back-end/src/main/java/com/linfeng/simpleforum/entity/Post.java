package com.linfeng.simpleforum.entity;


import lombok.*;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias(value = "Post")
public class Post {
    private String postId;
    private String title;
    private String type;
    private String content;
    private int heat;
    private String cover;
    private LocalDateTime postCreateTime;
    private String userId;

    private int likesCount;
    private int commentsCount;
    private int likeStatus;
    private String name;
    private String avatar;
    private String email;
}
