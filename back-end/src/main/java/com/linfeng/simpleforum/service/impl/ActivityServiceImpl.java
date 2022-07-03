package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.ActivityMapper;
import com.linfeng.simpleforum.entity.Activity;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.ActivityService;
import com.linfeng.simpleforum.utils.DateUtil;
import com.linfeng.simpleforum.utils.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ActivityServiceImpl implements ActivityService {

    private final ActivityMapper activityMapper;

    @Autowired
    public ActivityServiceImpl(ActivityMapper activityMapper) {
        this.activityMapper = activityMapper;
    }

    @Override
    public ResponseResult listActivityHeatByUserId(String userId) {
        List<Activity> activityList = activityMapper.listActivitiesByUserId(userId);
        if (activityList.size() == 0)
            return new ResponseResult(404, "Not fund activity data", null);

        int[] heatData = new int[12];
        int n = activityList.size();
        for (int i = 0; i < n; i++) {
            // 这样处理是因为 12 -> 0 -> 1 -> ... -> 11
            heatData[activityList.get(i).getActivityDate() % 12] = activityList.get(i).getActivityHeat();
        }

        Map<String, Object> res = new HashMap<>();
        res.put("userHeatData", heatData);
        res.put("averageHeatData", averageHeat());
        return new ResponseResult(200, "Get activity data succeeded", res);
    }

    public int[] averageHeat() {
        int[] averageHeat = new int[12];
        for (int i = 1; i < 13; i++) {
            Integer res = activityMapper.getMonthAverageHeat(i+"");
            if (res == null)
                res = 0;
            averageHeat[i % 12] = res;
        }
        return averageHeat;
    }

    // login +5
    // post  +10
    // like  +1
    // comment +2
    @Override
    public void addHeatByLogin(String userId) {
        String activityId = UuidUtil.uuid();
        int activityDate = DateUtil.activityDate();
        // 当前月份已有活跃度记录
        if (activityMapper.countActivityByActivityDate(userId, activityDate) != 0) {
            activityMapper.updateActivityHeat(userId, activityDate, 5);
        } else {
            Activity activity = new Activity(activityId, userId, 5, activityDate);
            activityMapper.insertActivity(activity);
        }
    }

    @Override
    public void addHeatByPost(String userId) {
        int activityDate = DateUtil.activityDate();
        activityMapper.updateActivityHeat(userId, activityDate, 10);
    }

    @Override
    public void addHeatByLike(String userId) {
        int activityDate = DateUtil.activityDate();
        activityMapper.updateActivityHeat(userId, activityDate, 1);
    }

    @Override
    public void addHeatByComment(String userId) {
        int activityDate = DateUtil.activityDate();
        activityMapper.updateActivityHeat(userId, activityDate, 2);
    }
}
