package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("follow")
public class FollowController {
    private final FollowService followService;

    @Autowired
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @RequestMapping(value = "/updateFollowStatus", method = RequestMethod.POST)
    public ResponseResult updateFollowStatus(@RequestParam String userId, @RequestParam String toUserId, @RequestParam String followStatus) {
        return followService.updateFollowStatus(userId, toUserId, followStatus);
    }

}
