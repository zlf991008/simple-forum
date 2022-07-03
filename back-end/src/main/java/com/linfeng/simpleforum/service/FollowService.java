package com.linfeng.simpleforum.service;

import com.linfeng.simpleforum.entity.Follow;
import com.linfeng.simpleforum.entity.ResponseResult;

public interface FollowService {
    Follow getFollow(String userId);
    ResponseResult updateFollowStatus(String userId, String toUserId, String followStatus);
    Follow getVisitUserFollow(String userId, String toUserId);
}
