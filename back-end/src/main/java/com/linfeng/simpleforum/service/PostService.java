package com.linfeng.simpleforum.service;

import com.linfeng.simpleforum.entity.Post;
import com.linfeng.simpleforum.entity.ResponseResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface PostService {

    // 发布帖子
    ResponseResult insertPost(String userId, String title, String type, String content, MultipartFile cover) throws IOException;
    ResponseResult insertPostWithDefaultCover(String userId, String title, String type, String content, String cover);

    ResponseResult deletePost(String postId);

    String rebuildCover(String postId, MultipartFile cover) throws IOException;

    // 给帖子点赞/取消点赞
    ResponseResult likePost(String userId, String postId);

    // 发布的所有帖子
    ResponseResult allPostsInUser(String userId);

    // 今日热榜
    ResponseResult hotList(String userId);

    // 所有帖子
    ResponseResult allPostsOrderByHeat(String userId);

    ResponseResult allPostsOrderByLatest(String userId);

    ResponseResult allPostsOrderByOldest(String userId);
}
