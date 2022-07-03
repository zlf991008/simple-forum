package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.ProfileMapper;
import com.linfeng.simpleforum.entity.Follow;
import com.linfeng.simpleforum.entity.Profile;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.FollowService;
import com.linfeng.simpleforum.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final ProfileMapper profileMapper;

    @Autowired
    public ProfileServiceImpl(ProfileMapper profileMapper) {
        this.profileMapper = profileMapper;
    }

    @Override
    public ResponseResult updateProfile(Profile profile) {
        if (profileMapper.getProfileByUserId(profile.getUserId()) == null) {
            if (profileMapper.insertProfile(profile) == 1)
                return new ResponseResult(200, "Add profile success", profile);
            return new ResponseResult(999, "Add profile failed", profile);
        }
        if (profileMapper.updateProfile(profile) != 1)
            return new ResponseResult(999, "Update profile failed", profile);
        return new ResponseResult(200, "Update profile success", profile);
    }

    @Override
    public ResponseResult getProfileByUserId(String userId) {
        Profile profile = profileMapper.getProfileByUserId(userId);
        if (profile == null)
            return new ResponseResult(404, "Not found Profile", null);
        return new ResponseResult(200, "Get profile success", profile);
    }
}
