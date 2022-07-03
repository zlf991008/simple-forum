package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.entity.Profile;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public ResponseResult get(@RequestParam String userId) {
        return profileService.getProfileByUserId(userId);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ResponseResult update(@RequestBody Profile profile) {
        return profileService.updateProfile(profile);
    }
}
