package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Like;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeMapper {
    Integer insertLike(Like like);
    Integer deleteLike(String userId, String postId);
    Integer getLikeExistence(String userId, String postId);
    Integer countLikesCountByPostId(String postId);
}
