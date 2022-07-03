package com.linfeng.simpleforum.controller;
import com.linfeng.simpleforum.entity.Post;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/post")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseResult add(@RequestParam(value = "userId") String userId, @RequestParam(value = "title") String title, @RequestParam(value = "type") String type, @RequestParam(value = "content") String content, @RequestParam(value = "cover") MultipartFile cover) throws IOException {
        return postService.insertPost(userId, title, type, content, cover);
    }

    @RequestMapping(value = "/addWithDefaultCover", method = RequestMethod.POST)
    public ResponseResult addWithDefaultCover(@RequestParam(value = "userId") String userId, @RequestParam(value = "title") String title, @RequestParam(value = "type") String type, @RequestParam(value = "content") String content, @RequestParam(value = "cover") String cover) throws IOException {
        return postService.insertPostWithDefaultCover(userId, title, type, content, cover);
    }

    @RequestMapping(value = "/deletePost", method = RequestMethod.DELETE)
    public ResponseResult deletePost(@RequestParam(value = "postId") String postId) {
        return postService.deletePost(postId);
    }

    /**
     *
     * @param userId 用户ID
     * @param postId 帖子ID
     * @return 点赞后的状态 0->未点赞 1->已点赞
     */
    @RequestMapping(value = "/like", method = RequestMethod.POST)
    public ResponseResult likePost(@RequestParam(value = "userId") String userId, @RequestParam(value = "postId") String postId) {
        return postService.likePost(userId, postId);
    }

    /**
     * 查询用户发布过的所有帖子
     * @param userId 用户ID
     * @return List<Post>
     */
    @RequestMapping(value = "/allPostsInUser", method = RequestMethod.GET)
    public ResponseResult allPostsInUser(@RequestParam String userId){
        return postService.allPostsInUser(userId);
    }

    /**
     * 查询热榜
     * @return 今天热度排名 top7 的帖子
     */
    @RequestMapping(value = "/hotList", method = RequestMethod.GET)
    public ResponseResult hotList(@RequestParam(value = "userId") String userId) {
        return postService.hotList(userId);
    }

    /**
     * 最新帖子
     * @return 按照时间降序排列帖子列表
     */
    @RequestMapping(value = "/latest", method = RequestMethod.GET)
    public ResponseResult latest(@RequestParam(value = "userId") String userId) {
        System.out.println("latest");
        return postService.allPostsOrderByLatest(userId);
    }

    /**
     * 最新帖子
     * @return 按照时间降序排列帖子列表
     */
    @RequestMapping(value = "/oldest", method = RequestMethod.GET)
    public ResponseResult oldest(@RequestParam(value = "userId") String userId) {
        System.out.println("oldest");
        return postService.allPostsOrderByOldest(userId);
    }

    /**
     * 查询所有帖子
     * @return 按照热度降序排列的所有帖子
     */
    @RequestMapping(value = "popular", method = RequestMethod.GET)
    public ResponseResult popular(@RequestParam(value = "userId") String userId) {
        System.out.println("popular");
        return postService.allPostsOrderByHeat(userId);
    }
}
