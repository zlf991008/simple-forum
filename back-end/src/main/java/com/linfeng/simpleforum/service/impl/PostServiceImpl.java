package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.CommentMapper;
import com.linfeng.simpleforum.dao.LikeMapper;
import com.linfeng.simpleforum.dao.PostMapper;
import com.linfeng.simpleforum.dao.UserMapper;
import com.linfeng.simpleforum.entity.*;
import com.linfeng.simpleforum.service.ActivityService;
import com.linfeng.simpleforum.service.PostService;
import com.linfeng.simpleforum.utils.DateUtil;
import com.linfeng.simpleforum.utils.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
@Transactional
public class PostServiceImpl implements PostService {
    private final PostMapper postMapper;
    private final UserMapper userMapper;
    private final CommentMapper commentMapper;
    private final LikeMapper likeMapper;
    private final ActivityService activityService;

    @Autowired
    public PostServiceImpl(PostMapper postMapper, UserMapper userMapper, LikeMapper likeMapper, CommentMapper commentMapper, ActivityService activityService) {
        this.postMapper = postMapper;
        this.userMapper = userMapper;
        this.commentMapper = commentMapper;
        this.likeMapper = likeMapper;

        // ActivityService
        this.activityService = activityService;
    }

    public Post basicPost(String userId, String title, String type, String content) {
        Post post = new Post();
        post.setPostId(UuidUtil.uuid());
        post.setTitle(title);
        post.setType(type);
        post.setContent(content);
        post.setUserId(userId);
        post.setPostCreateTime(DateUtil.postCreateTime());
        return post;
    }

    @Override
    public ResponseResult insertPost(String userId, String title, String type, String content, MultipartFile cover) throws IOException {
        Post post = basicPost(userId, title, type, content);
        if (cover.isEmpty()) {
            if (postMapper.insertPost(post) == 1) {
                activityService.addHeatByPost(userId);
                return new ResponseResult(200, "Add post succeeded", post);
            }
            return new ResponseResult(999, "Add post failed", post);
        }
        else {
            //文件上传的地址
            String filePath = "D:\\Developments\\Github Repositories\\simple-forum\\client\\public\\static\\cover";

            //获取文件的名称
//            final String fileName = avatar.getOriginalFilename();
            // 获取后缀名
            String contentType = cover.getContentType();

            String suffix = "";
            if ("image/jpeg".equals(contentType)) suffix = "jpg";
            if ("image/jpg".equals(contentType)) suffix = "jpg";
            if ("image/png".equals(contentType)) suffix = "png";

            String fileName = post.getPostId() + "." + suffix;

            //限制文件上传的类型
            if ("image/jpeg".equals(contentType) || "image/jpg".equals(contentType) || "image/png".equals(contentType)) {
                File file = new File(filePath, fileName);
                file.createNewFile();
                //完成文件的上传
                cover.transferTo(file);
                post.setCover(fileName);
                if (postMapper.insertPost(post) == 1) {
                    activityService.addHeatByPost(userId);
                    return new ResponseResult(200, "Post succeeded", post);
                }
                return new ResponseResult(999, "Post failed", post);
            }
            else return new ResponseResult(999, "Wrong cover type", contentType);
        }
    }

    @Override
    public ResponseResult insertPostWithDefaultCover(String userId, String title, String type, String content, String cover) {
        Post post = basicPost(userId, title, type, content);
        post.setCover(cover);
        if (postMapper.insertPost(post) == 1) {
            activityService.addHeatByPost(userId);
            return new ResponseResult(200, "Add post succeeded", post);
        }
        return new ResponseResult(999, "Add post failed", post);
    }

    @Override
    public ResponseResult deletePost(String postId) {
        if (postMapper.deletePostByPostId(postId) > 0)
            return new ResponseResult(200, "Delete post success", postId);
        return new ResponseResult(999, "Delete post failed", postId);
    }


    @Override
    public String rebuildCover(String postId, MultipartFile cover) throws IOException {
        if (cover.isEmpty())
            return null;
        else {
            //文件上传的地址
            String filePath = "D:\\Developments\\Projects\\simple-forum\\client\\public\\static\\cover";
            // 获取后缀名
            String contentType = cover.getContentType();

            String suffix = "";
            if ("image/jpeg".equals(contentType)) suffix = "jpg";
            if ("image/jpg".equals(contentType)) suffix = "jpg";
            if ("image/png".equals(contentType)) suffix = "png";
            String fileName = postId + "." + suffix;

            //限制文件上传的类型
            if ("image/jpeg".equals(contentType) || "image/jpg".equals(contentType) || "image/png".equals(contentType)) {
                try {
                    File file = new File(filePath, fileName);
                    file.createNewFile();
                    cover.transferTo(file);
                } catch (IOException e) {
                    return null;
                }
                return fileName;
            }
            return "Wrong cover type";
        }
    }

    @Override
    public ResponseResult likePost(String userId, String postId) {
        // 先查询用户是否点赞该帖子
        // 如果有结果，说明此时已经点赞了，需要取消点赞
        if (likeMapper.getLikeExistence(userId, postId) != 0) {
            // 删除有结果说明没问题
            if (likeMapper.deleteLike(userId, postId) != 1)
                return new ResponseResult(999, "Dislike failed", 1);
            postMapper.updateHeatByPostId(postId, -10);
            activityService.addHeatByLike(userId);
            return new ResponseResult(200, "Dislike succeeded", 0);
        } else {
            // 如果没有结果，说明此时需要点赞
            Like like = new Like(UuidUtil.uuid(), userId, postId);
            Integer res = likeMapper.insertLike(like);
            if (res != null && res != 0)
                return new ResponseResult(999, "Like failed", 0);
            postMapper.updateHeatByPostId(postId, +10);
            activityService.addHeatByLike(userId);
            return new ResponseResult(200, "Like succeeded", 1);
        }
        // 0 -> 未点赞
        // 1 -> 已点赞
    }

    /**
     * 用户发布过的所有帖子
     *
     * @param userId 用户ID
     * @return 用户发布过的所有帖子
     */
    @Override
    public ResponseResult allPostsInUser(String userId) {
        List<Post> result = postMapper.listPostsByUserId(userId);
        if (result.size() == 0)
            return new ResponseResult(404, "All posts is empty", null);
        return new ResponseResult(200, "All posts", result);
    }

    /**
     * 查询所有帖子
     *
     * @return 按照热度降序排列的所有帖子
     */
    @Override
    public ResponseResult allPostsOrderByHeat(String userId) {
        List<Post> result = postMapper.listPostsAllByHeat();
        if (result.isEmpty())
            return new ResponseResult(999, "Post list is empty", rebuildPostResult(result, userId));
        return new ResponseResult(200, "Post list order by heat desc", result);
    }

    /**
     * 今日热榜
     *
     * @return 今天热度排名 top7 的帖子
     */
    @Override
    public ResponseResult hotList(String userId) {
        // 只需要日期即可
        String postTime = DateUtil.strLocalDate();
        List<Post> result = postMapper.listPostsByTime(postTime);
        if (result.isEmpty())
            return new ResponseResult(999, "Today hot list is empty", rebuildPostResult(result, userId));
        return new ResponseResult(200, "Get today hot list succeeded", rebuildPostResult(result, userId));
    }

    /**
     * 将所有帖子按时间降序排列
     *
     * @return List<Post>
     */
    @Override
    public ResponseResult allPostsOrderByLatest(String userId) {
        List<Post> postList = postMapper.listPostsAllByLatest();
        if (postList.size() < 1)
            return new ResponseResult(404, "Post list is empty", null);
        return new ResponseResult(200, "Post list sorted by latest", rebuildPostResult(postList, userId));
    }

    /**
     * 将所有帖子按时间升序排列
     *
     * @return List<Post>
     */
    @Override
    public ResponseResult allPostsOrderByOldest(String userId) {
        List<Post> postList = postMapper.listPostsAllByOldest();
        if (postList.size() < 1)
            return new ResponseResult(404, "Post list is empty", null);
        return new ResponseResult(200, "Post list sorted by oldest", rebuildPostResult(postList, userId));
    }

    // 加入一个当前用户对帖子的点赞情况
    // 这个userId是为了读取currentUser对于帖子的点赞情况
    public List<Post> rebuildPostResult(List<Post> postList, String userId) {
        List<Post> res = new ArrayList<>();
        for (Post post : postList) {
            post.setLikeStatus(likeMapper.getLikeExistence(userId, post.getPostId()));
            post.setLikesCount(likeMapper.countLikesCountByPostId(post.getPostId()));
            post.setCommentsCount(commentMapper.countCommentsCountByPostId(post.getPostId()));
            res.add(post);
        }
        return res;
    }
}
