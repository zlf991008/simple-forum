package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.entity.*;
import com.linfeng.simpleforum.service.ActivityService;
import com.linfeng.simpleforum.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 登录
     * @param email 用户邮箱
     * @param password 用户密码
     * @return 用户实体
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseResult login(@RequestParam(value = "email") String email, @RequestParam(value = "password") String password) {
        return userService.login(email, password);
    }

    /**
     * 注册
     * @param user 用户实体
     * @return 用户实体
     */
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseResult register(@RequestBody User user) {
        return userService.register(user);
    }

    /**
     * 更新用户信息
     * @param user 用户
     * @return 更新后的用户
     */
    @RequestMapping(value = "/updateDetail", method = RequestMethod.POST)
    public ResponseResult updateDetail(@RequestBody User user) {
        return userService.updateDetail(user);
    }

    @RequestMapping(value = "/updateAvatar", method = RequestMethod.POST)
    public ResponseResult updateAvatar(@RequestParam String userId, @RequestParam MultipartFile avatar) throws IOException {
        return userService.updateAvatar(userId, avatar);
    }

    /**
     * 获取用户所有信息
     * @param userId 用户Id
     * @return 用户，Profile
     */
    @RequestMapping(value = "get", method = RequestMethod.GET)
    public ResponseResult getUser(@RequestParam String userId, @RequestParam String toUserId) {
        return userService.getVisitUserByUserId(userId, toUserId);
    }
}

