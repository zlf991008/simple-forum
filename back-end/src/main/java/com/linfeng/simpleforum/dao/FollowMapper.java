package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Follow;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowMapper {
    Integer insertFollow(String followId, String userId, String toUserId);
    Integer deleteFollow(String userId, String toUserId);
    Integer getFollowExistence(String userId, String toUserId);
    List<Follow> listFollow(String userId);
    Integer countFollowingByUserId(String userId);
    Integer countFollowersByToUserId(String toUserId);
}
