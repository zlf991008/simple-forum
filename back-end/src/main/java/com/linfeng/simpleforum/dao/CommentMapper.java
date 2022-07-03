package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Comment;
import com.linfeng.simpleforum.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentMapper {
    int insertComment(Comment comment);
    int countCommentsCountByPostId(String postId);

    List<Comment> listTopCommentsByPostId(String postId);
    List<Comment> listSonCommentsByCommentId(String commentId);

}
