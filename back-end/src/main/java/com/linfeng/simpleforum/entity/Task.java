package com.linfeng.simpleforum.entity;

import lombok.*;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("Task")
public class Task {
    private String taskId;
    private String taskLabel;
    private boolean completed;
    private String userId;
    private LocalDateTime createTime;
}
