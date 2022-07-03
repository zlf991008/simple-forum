package com.linfeng.simpleforum.entity;

import lombok.*;
import org.apache.ibatis.type.Alias;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("Activity")
public class Activity {
    private String activityId;
    private String userId;
    private int activityHeat;
    private int activityDate;
}
