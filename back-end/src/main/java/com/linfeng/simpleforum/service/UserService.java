package com.linfeng.simpleforum.service;

import com.linfeng.simpleforum.entity.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {

    // 判断邮箱是否已注册
    boolean isExisted(String email);

    // 注册
    public ResponseResult register(User user);

    // 登录
    public ResponseResult login(String email, String password);

    // 修改个人资料
    public ResponseResult updateDetail(User user);

    // 修改个人头像
    public ResponseResult updateAvatar(String userId, MultipartFile avatar) throws IOException;

    public ResponseResult getVisitUserByUserId(String userId, String toUserId);
}
