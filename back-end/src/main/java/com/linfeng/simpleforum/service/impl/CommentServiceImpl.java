package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.CommentMapper;
import com.linfeng.simpleforum.dao.PostMapper;
import com.linfeng.simpleforum.dao.UserMapper;
import com.linfeng.simpleforum.entity.Comment;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.entity.User;
import com.linfeng.simpleforum.service.ActivityService;
import com.linfeng.simpleforum.service.CommentService;
import com.linfeng.simpleforum.utils.DateUtil;
import com.linfeng.simpleforum.utils.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final UserMapper userMapper;
    private final PostMapper postMapper;
    private final ActivityService activityService;



    @Autowired
    public CommentServiceImpl(CommentMapper commentMapper,UserMapper userMapper, PostMapper postMapper, ActivityService activityService) {
        this.commentMapper = commentMapper;
        this.userMapper = userMapper;
        this.postMapper = postMapper;

        // ActivityService
        this.activityService = activityService;
    }

    /**
     * 添加一条评论
     * @param comment 评论信息
     * @return 评论的结果
     */
    @Override
    public ResponseResult insertComment(Comment comment) {
        comment.setCommentId(UuidUtil.uuid());
        comment.setCommentTime(DateUtil.commentTime());
        int result = commentMapper.insertComment(comment);
        if (result != 1)
            return new ResponseResult(999, "Comment failed", comment);
        postMapper.updateHeatByPostId(comment.getPostId(), 20);
        activityService.addHeatByComment(comment.getUserId());
        return new ResponseResult(200, "Comment succeeded", comment);
    }


    // ===========================
    // 树类评论
    // ===========================
    /**
     * 查询一个帖子下的所有评论，并组合好
     * @param postId 帖子ID
     * @return 组合好的评论
     */
    @Override
    public ResponseResult listCommentsByPostId(String postId) {
        //存放迭代找出的所有子代的集合
        List<Comment> finalComments = new ArrayList<>();
        // 所有顶层评论
        List<Comment> topComments = commentMapper.listTopCommentsByPostId(postId);
        // 判断顶层是否为空
        if (topComments.isEmpty())
            return new ResponseResult(200, "Comments is empty", null);
        else {
            // 遍历顶层回复
            for (Comment comment : topComments) {
                User user = userMapper.getUserByUserId(comment.getReplyToUserId());
                comment.setReplyToUserName(user.getName());
                comment.setReplyToUserEmail(user.getEmail());
                comment.setReplyToUserAvatar(user.getAvatar());

                // 将顶层评论传入，并接收结果
                Comment resultComment = combineComments(comment);
                // 将结果加入最后集合
                finalComments.add(resultComment);
            }
            return new ResponseResult(200, "Query succeeded", finalComments);
        }
    }

    /**
     *
     * @param comment 当前评论
     * @return 已经组合好的子评论
     */
    @Override
    public Comment combineComments(Comment comment) {
        // 获取子评论
        String commentId = comment.getCommentId();
        List<Comment> sonCommentList = commentMapper.listSonCommentsByCommentId(commentId);

        // 如果子评论不为空
        if (sonCommentList.size() > 0) {
            // 遍历子评论
            for (Comment sonComment : sonCommentList) {
                // 拿到子评论集合
                List<Comment> temp = comment.getChildren();
                if (temp == null)
                    temp = new ArrayList<>();
                // 将返回的子评论加入子评论集合
                temp.add(combineComments(sonComment));
                comment.setChildren(temp);
            }
        }
        User user = userMapper.getUserByUserId(comment.getReplyToUserId());
        comment.setReplyToUserName(user.getName());
        comment.setReplyToUserEmail(user.getEmail());
        comment.setReplyToUserAvatar(user.getAvatar());
        return comment;
    }


    // ===========================
    // 数组类评论
    // ===========================
    List<Comment> newFinalComments = new ArrayList<>();
    @Override
    public ResponseResult newListCommentsByPostId(String postId) {

        List<Comment> topComments = commentMapper.listTopCommentsByPostId(postId);
        if (topComments.isEmpty())
            return new ResponseResult(200, "Comments is empty", null);
        else {
            // 遍历顶层回复
            for (Comment topComment : topComments) {
                newFinalComments.add(topComment);
                newCombineComments(topComment);
            }

            ResponseResult responseResult = new ResponseResult(200, "Query succeeded", newFinalComments);
            newFinalComments = new ArrayList<>();
            return responseResult;
        }
    }

    @Override
    public Comment newCombineComments(Comment comment) {
        // 获取子评论
        String commentId = comment.getCommentId();
        List<Comment> sonCommentList = commentMapper.listSonCommentsByCommentId(commentId);

        // 如果子评论不为空
        if (sonCommentList.size() > 0) {
            // 遍历子评论
            for (Comment sonComment : sonCommentList) {
                newFinalComments.add(sonComment);
                newCombineComments(sonComment);
            }
        }
        return comment;
    }




//    @Override
//    public List<Map> rebuildCommentsResult(List<Comment> commentList) {
//        List<Map> res = new ArrayList<>();
//        for(Comment comment: commentList) {
//            Map<String, Object> map = new HashMap<>();
//            map.put("commentId", comment.getCommentId());
//            map.put("postId", comment.getPostId());
//            map.put("parentId", comment.getParentId());
//            map.put("replyToUserId", commentMapper.getReplyToUserIdByParentId(comment.getParentId()));
//            map.put("replyToName", commentMapper.getReplyToNameByParentId(comment.getParentId()));
//            map.put("name", comment.getName());
//            map.put("userId", comment.getUserId());
//            map.put("avatar", comment.getAvatar());
//            map.put("content", comment.getContent());
//            map.put("commentTime", comment.getCommentTime());
//            map.put("children", comment.getChildren());
//            res.add(map);
//        }
//        return res;
//    }


}
