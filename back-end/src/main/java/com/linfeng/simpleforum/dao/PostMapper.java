package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Post;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface PostMapper {
    Integer insertPost(Post post);
    Integer updateHeatByPostId(String postId, int changeNum);
    Integer deletePostByPostId(String postId);

    Integer updatePostByPostId(Post post);
    Post getPostByPostId(String postId);
    List<Post> listPostsByUserId(String userId);  // 查询用户的帖子
    List<Post> listPostsByTime(String postCreateTime); // 根据时间查询帖子,并按热度降序排列
    List<Post> listPostsAllByHeat();
    List<Post> listPostsAllByLatest();
    List<Post> listPostsAllByOldest();

}
