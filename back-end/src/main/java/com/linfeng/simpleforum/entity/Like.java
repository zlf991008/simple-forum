package com.linfeng.simpleforum.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias(value = "Like")
public class Like {
    private String likeId;
    private String userId;
    private String postId;
}
