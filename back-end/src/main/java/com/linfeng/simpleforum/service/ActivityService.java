package com.linfeng.simpleforum.service;

import com.linfeng.simpleforum.entity.ResponseResult;

public interface ActivityService {

    ResponseResult listActivityHeatByUserId(String userId);

    // login +5
    // post  +10
    // like  +1
    // comment +2
    void addHeatByLogin(String userId);
    void addHeatByPost(String userId);
    void addHeatByLike(String userId);
    void addHeatByComment(String userId);

}
