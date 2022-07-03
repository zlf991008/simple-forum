package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Activity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityMapper {
    Integer insertActivity(Activity activity);
    Integer getMonthAverageHeat(String activityDate);
    List<Activity> listActivitiesByUserId(String userId);

    Integer countActivityByActivityDate(String userId, int activityDate);

    Integer updateActivityHeat(String userId, int activityDate, int changeNum);
}
