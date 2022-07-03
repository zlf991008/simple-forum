package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.ActivityMapper;
import com.linfeng.simpleforum.dao.CommentMapper;
import com.linfeng.simpleforum.dao.ProfileMapper;
import com.linfeng.simpleforum.dao.UserMapper;
import com.linfeng.simpleforum.entity.Follow;
import com.linfeng.simpleforum.entity.Profile;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.entity.User;
import com.linfeng.simpleforum.service.ActivityService;
import com.linfeng.simpleforum.service.FollowService;
import com.linfeng.simpleforum.service.UserService;
import com.linfeng.simpleforum.utils.DateUtil;
import com.linfeng.simpleforum.utils.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final CommentMapper commentMapper;
    private final ActivityMapper activityMapper;
    private final ActivityService activityService;
    private final ProfileMapper profileMapper;
    private final FollowService followService;

    @Autowired
    public UserServiceImpl(UserMapper userMapper, CommentMapper commentMapper, ActivityMapper activityMapper, ActivityService activityService, ProfileMapper profileMapper, FollowService followService) {
        this.userMapper = userMapper;
        this.commentMapper = commentMapper;
        this.activityMapper = activityMapper;
        this.profileMapper = profileMapper;
        // ActivityService
        this.activityService = activityService;

        this.followService = followService;
    }

    /**
     * 查询用户邮箱是否已注册
     */
    @Override
    public boolean isExisted(String email) {
        return userMapper.countUserByEmail(email) > 0;
    }

    /**
     * 用户登录
     *
     * @param email    用户邮箱
     * @param password 用户密码
     * @return 用户实体
     */
    @Override
    public ResponseResult login(String email, String password) {
        // 判断用户邮箱是否已注册
        boolean isExisted = isExisted(email);
        Map<String, String> map = new HashMap<>();
        if (!isExisted) {
            map.put("email", email);
            return new ResponseResult(404, "Not found this user", map);
        } else {
            String result = userMapper.getPasswordByEmail(email);
            if (!password.equals(result)) {
                map.put("password", password);
                return new ResponseResult(401, "Wrong password", map);
            }

            // 更新最近一次登陆时间
            LocalDateTime localDateTime = LocalDateTime.now();
            userMapper.updateLastLoginTimeByEmail(email, localDateTime);
            String userId = userMapper.getIdByEmail(email);
            User user = userMapper.getUserByUserId(userId);
            user.setFollow(followService.getFollow(userId));
            // 更新活跃度
            activityService.addHeatByLogin(userId);
            return new ResponseResult(200, "Login succeeded", user);
        }
    }


    /**
     * 用户注册
     *
     * @param user 用户
     * @return 用户实体
     */
    @Override
    public ResponseResult register(User user) {
        // 判断用户邮箱是否已注册
        boolean isExisted = isExisted(user.getEmail());
        Map<String, String> map = new HashMap<>();
        if (isExisted) {
            map.put("email", user.getEmail());
            return new ResponseResult(409, "Email already existed", map);
        } else {
            // 设置 用户ID，注册时间
            user.setUserId(UuidUtil.uuid());
            user.setRegisterTime(DateUtil.registerTime());
            int result = userMapper.insertUser(user);
            if (result == 0)
                return new ResponseResult(999, "Register failed", user);
            return new ResponseResult(200, "Register succeeded", user);
        }
    }


    /**
     * 更新用户 详细资料
     *
     * @param user 用户
     * @return 更新后的用户
     */
    @Override
    public ResponseResult updateDetail(User user) {
        // 获取数据库中的数据
        User userInDB = userMapper.getUserByUserId(user.getUserId());

        // 如果修改了邮箱
        if (!userInDB.getEmail().equals(user.getEmail())) {
            if (isExisted(user.getEmail()))
                return new ResponseResult(409, "Email already existed", user);
        }
        if (userMapper.updateUser(user) != 1)
            return new ResponseResult(999, "Update failed", null);
        // 返回更新后的用户
        User newUser = userMapper.getUserByUserId(user.getUserId());
        return new ResponseResult(200, "Update succeed", newUser);
    }

    @Override
    public ResponseResult updateAvatar(String userId, MultipartFile avatar) throws IOException {
        if (avatar.isEmpty())
            return null;
        else {
            //文件上传的地址
            String filePath = "D:\\Developments\\Projects\\simple-forum\\client\\public\\static\\avatar";

            //获取文件的名称
//            final String fileName = avatar.getOriginalFilename();
            // 获取后缀名
            String contentType = avatar.getContentType();

            String suffix = "";
            if ("image/jpeg".equals(contentType)) suffix = "jpg";
            if ("image/jpg".equals(contentType)) suffix = "jpg";
            if ("image/png".equals(contentType)) suffix = "png";

            String fileName = userId + "." + suffix;

            //限制文件上传的类型
            if ("image/jpeg".equals(contentType) || "image/jpg".equals(contentType) || "image/png".equals(contentType)) {
                File file = new File(filePath, fileName);
                file.createNewFile();
                //完成文件的上传
                avatar.transferTo(file);
                if (userMapper.updateUserAvatar(userId, fileName) == 1) {
//                    User user = userMapper.getUserByUserId(userId);
                    return new ResponseResult(200, "Upload success", fileName);
                }
                return new ResponseResult(999, "Upload failed", fileName);
            } else return new ResponseResult(999, "Wrong type", contentType);
        }
    }

    @Override
    public ResponseResult getVisitUserByUserId(String userId ,String toUserId) {
        User user = userMapper.getUserByUserId(toUserId);
        Map<String, Object> finalRes = new HashMap<>();
        Map<String, Object> res = new HashMap<>();
        res.put("userId", user.getUserId());
        res.put("name", user.getName());
        res.put("email", user.getEmail());
        res.put("avatar", user.getAvatar());
        res.put("lastLoginTime", user.getLastLoginTime());
        Follow follow = followService.getVisitUserFollow(userId, toUserId);

        res.put("followingCount", follow.getFollowingCount());
        res.put("followersCount", follow.getFollowersCount());
        res.put("friendsCount", follow.getFriendsCount());
        res.put("followStatus", follow.getFollowStatus());
        finalRes.put("visitUser", res);
        Profile profile = profileMapper.getProfileByUserId(toUserId);
        if (profile == null)
            profile = new Profile(toUserId, "", "", "", "");
        res = new HashMap<>();
        res.put("university", profile.getUniversity());
        res.put("college", profile.getCollege());
        res.put("major", profile.getMajor());
        res.put("goodAt", profile.getGoodAt());
        finalRes.put("visitProfile", res);
        return new ResponseResult(200, "Get visit data success", finalRes);
    }
}