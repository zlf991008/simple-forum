package com.linfeng.simpleforum.entity;

import lombok.*;
import org.apache.ibatis.type.Alias;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias(value = "User")
public class User {

    private String userId;

    private String email;

    private String name;

    private String password;

    // 其实是static目录下的url
    private String avatar;

    private LocalDateTime lastLoginTime;

    private LocalDateTime registerTime;

    private Follow follow;
}
