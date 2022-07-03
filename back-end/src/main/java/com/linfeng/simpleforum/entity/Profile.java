package com.linfeng.simpleforum.entity;


import lombok.*;
import org.apache.ibatis.type.Alias;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("Profile")
public class Profile {
    private String userId;
    private String university;
    private String college;
    private String major;
    private String goodAt;
}
