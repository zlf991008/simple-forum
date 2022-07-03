package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Profile;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileMapper {
    Integer insertProfile(Profile profile);
    Integer updateProfile(Profile profile);
    Profile getProfileByUserId(String userId);
}
