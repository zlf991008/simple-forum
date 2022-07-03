package com.linfeng.simpleforum.service;

import com.linfeng.simpleforum.entity.*;

public interface ProfileService {
    ResponseResult updateProfile(Profile profile);
    ResponseResult getProfileByUserId(String userId);
}
