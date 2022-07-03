package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.FollowMapper;
import com.linfeng.simpleforum.entity.Follow;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.FollowService;
import com.linfeng.simpleforum.utils.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FollowServiceImpl implements FollowService {
    private final FollowMapper followMapper;

    @Autowired
    public FollowServiceImpl(FollowMapper followMapper) {
        this.followMapper = followMapper;
    }

    @Override
    public Follow getFollow(String userId) {
        Follow follow = new Follow();
        Integer followingCount = followMapper.countFollowingByUserId(userId);
        if (followingCount == null || followingCount == 0)
            follow.setFollowingCount(0);
        else
            follow.setFollowingCount(followingCount);

        Integer followersCount = followMapper.countFollowersByToUserId(userId);
        if (followersCount == null || followersCount == 0)
            follow.setFollowersCount(0);
        else
            follow.setFollowersCount(followersCount);
        follow.setFriendsCount(getFriendsCount(userId));
        return follow;
    }

    @Override
    public Follow getVisitUserFollow(String userId, String toUserId) {
        Follow follow = getFollow(userId);
        follow.setFollowStatus(getFollowStatus(userId, toUserId));
        return follow;
    }

    public boolean getFollowStatus(String userId, String toUserId) {
        Integer res = followMapper.getFollowExistence(userId, toUserId);
        return res != null && res != 0;
    }

    public int getFriendsCount(String userId) {
        List<Follow> followList = followMapper.listFollow(userId);
        int friendsCount = 0;
        for (Follow follow : followList) {
            Integer res = followMapper.getFollowExistence(follow.getToUserId(), userId);
            if (res != null && res != 0)
                friendsCount += 1;
        }
        return friendsCount;
    }

    @Override
    public ResponseResult updateFollowStatus(String userId, String toUserId, String followStatus) {
        Integer res = followMapper.getFollowExistence(userId, toUserId);
        if (res != null && res != 0) {
            Integer deleterRes = followMapper.deleteFollow(userId, toUserId);
            if (deleterRes != null && deleterRes != 0)
                return new ResponseResult(200, "Unsubscribe success", null);
            return new ResponseResult(999, "Unknown error", null);
        } else {
            Integer subRes = followMapper.insertFollow(UuidUtil.uuid(), userId, toUserId);
            if (subRes != 1)
                return new ResponseResult(999, "Unknown error", null);
            return new ResponseResult(200, "Subscribe success", null);
        }
    }
}
