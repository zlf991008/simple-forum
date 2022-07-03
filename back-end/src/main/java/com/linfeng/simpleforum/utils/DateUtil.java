package com.linfeng.simpleforum.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DateUtil {
    // 注册时间 2022-04-13
    public static LocalDateTime registerTime() {
        return LocalDateTime.now();
    }

    // 最近一次登陆时间
    public static LocalDateTime lastLoginTime() {
        return LocalDateTime.now();
    }

    // 帖子发布时间
    public static LocalDateTime postCreateTime() {
        return LocalDateTime.now();
    }

    public static int activityDate() {
        return Integer.parseInt(LocalDate.now().toString().substring(5, 7));
    }

    // 评论时间
    public static LocalDateTime commentTime() {
        return LocalDateTime.now();
    }

    // 任务创建时间
    public static LocalDateTime taskCreateTime() {
        return LocalDateTime.now();
    }

    public static LocalDateTime notificationCreateTime() {
        return LocalDateTime.now();
    }
    // LocalDateTime --> LocalDate -->String
    public static String localDateTimeToLocalDateToString(LocalDateTime localDateTime) {
        String str = localDateTime.toString();
        return str.substring(0, 10);
    }

    // LocalDate --> String
    public static String localDateToString(LocalDate localDate) {
        return localDate.toString();
    }

    // 当前日期
    public static String strLocalDate() {
        return LocalDate.now().toString();
    }


}
