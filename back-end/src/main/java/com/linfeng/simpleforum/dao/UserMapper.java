package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.User;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserMapper {

    int insertUser(User user);
    int deleteByUserId(String userId);
    int updateUser(User user);
    int updateUserAvatar(String userId, String avatar);
    void updateLastLoginTimeByEmail(String email, LocalDateTime lastLoginTime);
    User getUserByUserId(String userId);
//    User getReplyToUserByReplyToUserId(String replyToUserId);
    String getIdByEmail(String email);
    String getPasswordByEmail(String email);
    List<User> listUsers();

    int countUserByEmail(String email);
}
