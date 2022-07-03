package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.dao.FollowMapper;
import com.linfeng.simpleforum.dao.ProfileMapper;
import com.linfeng.simpleforum.dao.UserMapper;
import com.linfeng.simpleforum.entity.Follow;
import com.linfeng.simpleforum.entity.Profile;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.entity.User;
import com.linfeng.simpleforum.service.FollowService;
import com.linfeng.simpleforum.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friend")
public class FriendController {

    private final ProfileMapper profileMapper;
    private final FollowMapper followMapper;
    private final UserMapper userMapper;

    @Autowired
    public FriendController(ProfileMapper profileMapper, FollowMapper followMapper, UserMapper userMapper) {
        this.profileMapper = profileMapper;
        this.followMapper = followMapper;
        this.userMapper = userMapper;
    }

    @RequestMapping(value = "/getFriends", method = RequestMethod.GET)
    public ResponseResult getFriends(@RequestParam String userId) {
        List<Follow> followList = followMapper.listFollow(userId);
        List<Map> followingUserList = new ArrayList<>();
        for (Follow follow: followList) {
            Map<String, Object> res = new HashMap<>();
            String followingUserId = follow.getToUserId();
            Profile profile = profileMapper.getProfileByUserId(followingUserId);
            User user = userMapper.getUserByUserId(followingUserId);

            res.put("avatar", user.getAvatar());
            res.put("name", user.getName());
            res.put("userId", user.getUserId());
            res.put("college", profile.getCollege());
            res.put("major", profile.getMajor());
            res.put("goodAt", profile.getGoodAt());

            followingUserList.add(res);
        }
        return new ResponseResult(200, "success", followingUserList);
    }
}
