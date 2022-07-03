package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/activity")
public class ActivityController {
    private final ActivityService activityService;

    @Autowired
    public ActivityController (ActivityService activityService) {
        this.activityService = activityService;
    }

    @RequestMapping("/getData")
    public ResponseResult all(@RequestParam String userId) {
        return activityService.listActivityHeatByUserId(userId);
    }
}
