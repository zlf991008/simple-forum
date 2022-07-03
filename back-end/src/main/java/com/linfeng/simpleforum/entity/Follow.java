package com.linfeng.simpleforum.entity;

import lombok.*;
import org.apache.ibatis.type.Alias;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("Follow")
public class Follow {
    private String followId;
    private String userId;
    private String toUserId;

    private Integer followingCount;
    private Integer followersCount;
    private Boolean followStatus;
    private Integer friendsCount;
}
